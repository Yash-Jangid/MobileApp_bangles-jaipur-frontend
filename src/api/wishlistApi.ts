/**
 * Wishlist API Client
 * Handles all wishlist-related API calls
 */

import apiClient from './apiClient';

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        description: string;
        sellingPrice: number;
        originalPrice: number;
        discount: number;
        stock: number;
        images: Array<{ imageUrl: string; isPrimary: boolean; sortOrder: number }>;
        category: { name: string };
    };
    createdAt: string;
    updatedAt: string;
}

export interface WishlistResponse {
    success: boolean;
    data: WishlistItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Get user's wishlist
 */
export const fetchWishlist = async (
    page: number = 1,
    limit: number = 20
): Promise<WishlistResponse> => {
    const response = await apiClient<WishlistResponse>({
        method: 'GET',
        url: '/wishlist',
        params: { page, limit },
    });
    return response.data;
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (productId: string) => {
    const response = await apiClient({
        method: 'POST',
        url: '/wishlist',
        data: { productId },
    });
    return response.data;
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (productId: string) => {
    const response = await apiClient({
        method: 'DELETE',
        url: `/wishlist/${productId}`,
    });
    return response.data;
};

/**
 * Check if product is in wishlist
 */
export const checkWishlist = async (productId: string): Promise<boolean> => {
    const response = await apiClient<{ success: boolean; data: { isInWishlist: boolean } }>({
        method: 'GET',
        url: `/wishlist/check/${productId}`,
    });
    return response.data.data.isInWishlist;
};

/**
 * Get wishlist count
 */
export const getWishlistCount = async (): Promise<number> => {
    const response = await apiClient<{ success: boolean; data: { count: number } }>({
        method: 'GET',
        url: '/wishlist/count',
    });
    return response.data.data.count;
};

/**
 * Clear entire wishlist
 */
export const clearWishlist = async () => {
    const response = await apiClient({
        method: 'DELETE',
        url: '/wishlist',
    });
    return response.data;
};
