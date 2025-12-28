import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';

// User profile types
export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface BackendResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
}

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<BackendResponse<UserProfile>> => {
    try {
        const response = await apiClient.get<BackendResponse<UserProfile>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<BackendResponse<UserProfile>> => {
    try {
        const response = await apiClient.patch<BackendResponse<UserProfile>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE,
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
