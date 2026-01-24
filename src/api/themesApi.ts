import apiClient, { handleApiError } from './apiClient';
import { BackendResponse } from './authApi';
import { ThemeConfiguration } from '../theme/types';
import { API_CONFIG, HTTP_STATUS } from '../config/api.config';

export interface BackendTheme {
    id: string;
    name: string;
    config: ThemeConfiguration;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getActiveTheme = async (): Promise<ThemeConfiguration | null> => {
    try {
        const response = await apiClient.get<BackendTheme>(
            '/themes/active'
        );

        if (response.status === HTTP_STATUS.NO_CONTENT || !response.data) {
            return null;
        }

        return response.data.config;
    } catch (error) {
        console.warn('Failed to fetch active theme, falling back to local defaults', error);
        return null;
    }
};
