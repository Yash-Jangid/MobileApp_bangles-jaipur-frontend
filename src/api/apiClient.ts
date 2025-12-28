import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, getApiUrl, HTTP_STATUS } from '../config/api.config';
import { getAccessToken, getRefreshToken, saveAccessToken, clearAuthData } from '../utils/storage';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor - Attach access token to every request
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (__DEV__) {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error: AxiosError) => {
        if (__DEV__) {
            console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (__DEV__) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Log error in development
        if (__DEV__) {
            console.error('❌ Response Error:', {
                status: error.response?.status,
                url: originalRequest?.url,
                message: error.message,
            });
        }

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getRefreshToken();

                if (!refreshToken) {
                    // No refresh token, logout user
                    await clearAuthData();
                    processQueue(new Error('No refresh token available'), null);
                    return Promise.reject(error);
                }

                // Call refresh token endpoint
                const response = await axios.post(
                    getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH),
                    { refreshToken }
                );

                const { accessToken } = response.data;

                // Save new access token
                await saveAccessToken(accessToken);

                // Update authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                processQueue(null, accessToken);
                isRefreshing = false;

                // Retry original request with new token
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Refresh failed, clear auth data
                await clearAuthData();

                return Promise.reject(refreshError);
            }
        }

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
