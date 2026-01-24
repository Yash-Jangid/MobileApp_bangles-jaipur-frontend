import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    isActive: boolean;
    displayOrder: number;
    link?: string;
    createdAt: string;
    updatedAt: string;
    adText?: string;
}

/**
 * Get all active banners (Public endpoint)
 */
export const getBanners = async (): Promise<BackendResponse<Banner[]>> => {
    try {
        const response = await apiClient.get<BackendResponse<Banner[]>>(
            `${API_CONFIG.ENDPOINTS.BANNERS.LIST}`
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
