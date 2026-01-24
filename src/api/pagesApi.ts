import apiClient, { handleApiError } from './apiClient';
import { BackendResponse } from './authApi';
import { API_CONFIG, HTTP_STATUS } from '../config/api.config';

export interface PageConfig {
    key: string;
    config: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export const getPageConfig = async (key: string): Promise<Record<string, any> | null> => {
    try {
        const response = await apiClient.get<PageConfig>(
            `/pages/${key}`
        );

        if (response.status === HTTP_STATUS.NO_CONTENT || !response.data) {
            return null;
        }

        return response.data.config;
    } catch (error) {
        console.warn(`Failed to fetch page config for ${key}`, error);
        return null;
    }
};
