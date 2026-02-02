import { PageResponse } from '../types/sdui';

// In a real app, this URL should be in a config file or environment variable
// For Android Emulator, use 10.0.2.2 instead of localhost
// For iOS Simulator, use localhost
const API_BASE_URL = 'http://localhost:8000/api';

export const PageConfigService = {
    fetchPageBySlug: async (slug: string): Promise<PageResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/page-config/by-slug/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Host': 'tenant1.localhost', // mimic tenant1 for testing
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch page config:', error);
            throw error;
        }
    }
};
