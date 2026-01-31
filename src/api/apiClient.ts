import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, getApiUrl, HTTP_STATUS } from '../config/api.config';
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, clearAuthData } from '../utils/storage';
import { store } from '../store';
import { setServiceUnavailable } from '../store/slices/appSettingsSlice';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Circuit Breaker Configuration ---
const CIRCUIT_BREAKER_CONFIG = {
    MAX_RETRY_ATTEMPTS: 3,           // Max retries per request
    MAX_CONSECUTIVE_FAILURES: 5,     // Max failures before circuit opens
    CIRCUIT_RESET_TIMEOUT: 30000,    // 30 seconds before retry
    BACKOFF_MULTIPLIER: 1000,        // Base backoff time (ms)
};

// Circuit Breaker State
let consecutiveFailures = 0;
let circuitOpenUntil = 0;
let lastFailureTime = 0;

/**
 * Check if circuit breaker is open (too many failures)
 */
const isCircuitOpen = (): boolean => {
    const now = Date.now();
    if (now < circuitOpenUntil) {
        if (__DEV__) {
            const remainingMs = circuitOpenUntil - now;
            console.warn(`⚡ [Circuit Breaker] Circuit is OPEN. Retry in ${Math.ceil(remainingMs / 1000)}s`);
        }
        return true;
    }
    // Circuit timeout elapsed, reset
    if (circuitOpenUntil > 0 && now >= circuitOpenUntil) {
        if (__DEV__) console.log('🔓 [Circuit Breaker] Circuit CLOSED. Retrying...');
        consecutiveFailures = 0;
        circuitOpenUntil = 0;
        store.dispatch(setServiceUnavailable(false));
    }
    return false;
};

/**
 * Record a failure and potentially open the circuit
 */
const recordFailure = () => {
    consecutiveFailures++;
    lastFailureTime = Date.now();

    if (consecutiveFailures >= CIRCUIT_BREAKER_CONFIG.MAX_CONSECUTIVE_FAILURES) {
        circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_CONFIG.CIRCUIT_RESET_TIMEOUT;
        if (__DEV__) {
            console.error(
                `🚨 [Circuit Breaker] TOO MANY FAILURES (${consecutiveFailures}). ` +
                `Circuit OPEN for ${CIRCUIT_BREAKER_CONFIG.CIRCUIT_RESET_TIMEOUT / 1000}s`
            );
        }
        // Notify store
        store.dispatch(setServiceUnavailable(true));
    }
};

/**
 * Record a success and reset failure count
 */
const recordSuccess = () => {
    if (consecutiveFailures > 0) {
        if (__DEV__) console.log('✅ [Circuit Breaker] Request succeeded. Resetting failure count.');
        consecutiveFailures = 0;
        circuitOpenUntil = 0;
    }
};

// --- Global Auth Event Listener ---
let onAuthFailure: (() => void) | null = null;
export const setAuthFailureListener = (callback: () => void) => {
    onAuthFailure = callback;
};

const notifyAuthFailure = () => {
    if (onAuthFailure) {
        onAuthFailure();
    }
};

// --- Token Synchronization & Utilities ---
let refreshTokenPromise: Promise<string | null> | null = null;

/**
 * Safe Base64 decoding for React Native (Hermes/JSC)
 */
const b64Decode = (str: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = String(str).replace(/=+$/, '');
    if (str.length % 4 === 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && (bc = bc % 4 ? bc * 64 + bs : bs, bc++ % 4)
            ? (output += String.fromCharCode(255 & (bc >> ((-2 * bc) & 6))))
            : 0
    ) {
        bs = chars.indexOf(buffer);
    }
    return output;
};

/**
 * Decodes JWT and checks if it's expired or about to expire in the next 60s.
 */
const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return true;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Try global atob first, then fallback to built-in decoder
        const atobFunc = (global as any).atob || b64Decode;
        const decoded = atobFunc(base64);

        const jsonPayload = decodeURIComponent(
            decoded.split('').map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const { exp } = JSON.parse(jsonPayload);
        const now = Math.floor(Date.now() / 1000);
        const bufferTime = 120; // 2 minutes buffer for clock drift

        const isExpired = now > (exp - bufferTime);
        if (isExpired && __DEV__) {
            console.log(`🕒 [Auth] Token is near expiry. Now: ${now}, Exp: ${exp}, Buffer: ${bufferTime}`);
        }
        return isExpired;
    } catch (e) {
        if (__DEV__) console.warn('⚠️ [Auth] Error decoding token:', e);
        return true;
    }
};

/**
 * Core Refresh Logic (Singleton)
 * Returns a promise that resolves to the new access token or null on failure.
 */
const performTokenRefresh = async (): Promise<string | null> => {
    if (refreshTokenPromise) {
        if (__DEV__) console.log('⏳ [Auth] Waiting for existing refresh promise...');
        return refreshTokenPromise;
    }

    refreshTokenPromise = (async () => {
        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                if (__DEV__) console.error('❌ [Auth] No refresh token found in storage');
                throw new Error('NO_REFRESH');
            }

            if (__DEV__) console.log('🔄 [Auth] Starting token refresh rotation...');

            const response = await axios.post(
                getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH),
                { refreshToken },
                { timeout: 15000 }
            );

            const tokens = response.data?.data || response.data;
            const { accessToken, refreshToken: newRefreshToken } = tokens;

            if (!accessToken) {
                if (__DEV__) console.error('❌ [Auth] Backend response missing access token');
                throw new Error('NO_ACCESS_TOKEN');
            }

            // Save new tokens
            await saveAccessToken(accessToken);
            if (newRefreshToken) {
                await saveRefreshToken(newRefreshToken);
            }

            // Update instance default
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            if (__DEV__) console.log('✨ [Auth] Token refreshed successfully');
            return accessToken;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            if (__DEV__) console.error(`❌ [Auth] Refresh failed. Status: ${status}, Message: ${message}`);

            const isAuthError = status === 401 || status === 403 || error.message === 'NO_REFRESH';

            if (isAuthError) {
                if (__DEV__) console.error('🚫 [Auth] Persistent session death. Clearing data...');
                await clearAuthData();
                notifyAuthFailure();
            } else {
                if (__DEV__) console.warn('⚠️ [Auth] Refresh failed due to network/server issue. Session preserved.');
            }
            return null;
        } finally {
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
};

// Request Interceptor - Proactive Refresh
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Define public endpoints that don't require authentication
        const publicEndpoints = [
            '/auth/login',
            '/auth/register',
            '/auth/forgot-password',
            '/auth/verify-otp',
            '/auth/reset-password',
            '/auth/logout', // Logout must be public to prevent infinite loop when auth fails
        ];

        // Check if this is a public endpoint
        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            config.url?.includes(endpoint)
        );

        // Skip auth logic for public endpoints
        if (isPublicEndpoint) {
            if (__DEV__) {
                console.log(`🌐 [Public] ${config.method?.toUpperCase()} ${config.url} - No auth required`);
            }
            return config;
        }

        const accessToken = await getAccessToken();

        // 1. If no token, just proceed (let backend handle public/private)
        if (!accessToken) return config;

        // 2. Proactive check: If token is expired or about to expire, refresh it now
        if (isTokenExpired(accessToken)) {
            const newToken = await performTokenRefresh();
            if (newToken && config.headers) {
                config.headers.Authorization = `Bearer ${newToken}`;
            }
        } else if (config.headers) {
            // Token is still fine
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Log request in development
        if (__DEV__) {
            console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - Reactive Fallback (Handles unexpected 401s)
apiClient.interceptors.response.use(
    (response) => {
        // Record success to reset circuit breaker
        recordSuccess();

        if (__DEV__) {
            console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Safety check: prevent processing if no config
        if (!originalRequest) {
            recordFailure();
            return Promise.reject(error);
        }

        // Initialize retry count if not present
        if (typeof originalRequest._retryCount === 'undefined') {
            originalRequest._retryCount = 0;
        }

        // Check if circuit breaker is open
        if (isCircuitOpen()) {
            if (__DEV__) {
                console.error('🚫 [Circuit Breaker] Request blocked - too many failures. Please wait.');
            }
            return Promise.reject(new Error('Circuit breaker is open. Too many consecutive failures. Please try again later.'));
        }

        // Check per-request retry limit
        if (originalRequest._retryCount >= CIRCUIT_BREAKER_CONFIG.MAX_RETRY_ATTEMPTS) {
            if (__DEV__) {
                console.error(
                    `🔴 [Retry Limit] Max retries (${CIRCUIT_BREAKER_CONFIG.MAX_RETRY_ATTEMPTS}) ` +
                    `reached for ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`
                );
            }
            recordFailure();
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Only if it wasn't caught pre-emptively
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
            // Define public endpoints that should not trigger token refresh
            const publicEndpoints = [
                '/auth/login',
                '/auth/register',
                '/auth/refresh',
                '/auth/forgot-password',
                '/auth/verify-otp',
                '/auth/reset-password',
                '/auth/logout',
            ];

            // Skip token refresh for public endpoints
            const isPublicEndpoint = publicEndpoints.some(endpoint =>
                originalRequest.url?.includes(endpoint)
            );

            if (isPublicEndpoint) {
                // Just reject the error without trying to refresh
                if (__DEV__) {
                    console.log(`🌐 [Public Endpoint] Not retrying ${originalRequest.url} - auth not required`);
                }
                return Promise.reject(error);
            }

            // Increment retry count
            originalRequest._retryCount++;

            if (__DEV__) {
                console.log(
                    `🔄 [Retry ${originalRequest._retryCount}/${CIRCUIT_BREAKER_CONFIG.MAX_RETRY_ATTEMPTS}] ` +
                    `Attempting token refresh for ${originalRequest.url}`
                );
            }

            // Exponential backoff: wait before retrying (prevents hammering the server)
            const backoffMs = CIRCUIT_BREAKER_CONFIG.BACKOFF_MULTIPLIER * originalRequest._retryCount;
            if (backoffMs > 0) {
                await new Promise(resolve => setTimeout(resolve, backoffMs));
            }

            const newToken = await performTokenRefresh();

            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                if (__DEV__) console.log(`✅ [Retry] Token refreshed, retrying request...`);
                return apiClient(originalRequest);
            } else {
                // Token refresh failed
                recordFailure();
                return Promise.reject(error);
            }
        }

        // For other errors, record failure and reject
        recordFailure();
        return Promise.reject(error);
    }
);

// Export configured client
export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
    if (error.response) {
        // Server responded with error
        const message = error.response.data?.message || error.response.data?.error;
        return message || 'An error occurred. Please try again.';
    } else if (error.request) {
        // No response received
        return 'Network error. Please check your connection.';
    } else {
        // Request setup error
        return error.message || 'An unexpected error occurred.';
    }
};
