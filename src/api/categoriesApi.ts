import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';

// Category Types
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesListResponse {
    data: Category[];
    meta: {
        total: number;
    };
}

/**
 * Get all categories
 */
export const getCategories = async (): Promise<BackendResponse<Category[]>> => {
    try {
        const response = await apiClient.get<BackendResponse<Category[]>>(
            API_CONFIG.ENDPOINTS.CATEGORIES.LIST
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: number): Promise<BackendResponse<Category>> => {
    try {
        const response = await apiClient.get<BackendResponse<Category>>(
            API_CONFIG.ENDPOINTS.CATEGORIES.DETAILS(id)
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
