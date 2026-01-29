import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';

// Request/Response Types
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Backend wraps all responses in this structure
export interface BackendResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
}

// Actual auth data returned in response.data
export interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

// Full auth response from backend
export type AuthResponse = BackendResponse<AuthData>;

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.REGISTER,
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Login user
 */
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.LOGIN,
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
        const response = await apiClient.post<RefreshTokenResponse>(
            API_CONFIG.ENDPOINTS.AUTH.REFRESH,
            { refreshToken }
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
    try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
        // Even if logout fails on backend, we'll clear local data
        console.error('Logout error:', handleApiError(error));
    }
};

// Password Reset Types
export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordWithOtpRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface VerifyOtpResponse {
    valid: boolean;
    message: string;
}

export interface ResetPasswordResponse {
    message: string;
}

/**
 * Request password reset OTP
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    try {
        const response = await apiClient.post<ForgotPasswordResponse>(
            '/auth/forgot-password',
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Verify OTP code
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
        const response = await apiClient.post<VerifyOtpResponse>(
            '/auth/verify-otp',
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Reset password with OTP
 */
export const resetPasswordWithOtp = async (data: ResetPasswordWithOtpRequest): Promise<ResetPasswordResponse> => {
    try {
        const response = await apiClient.post<ResetPasswordResponse>(
            '/auth/reset-password',
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
