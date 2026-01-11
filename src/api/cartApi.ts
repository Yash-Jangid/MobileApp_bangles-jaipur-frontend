import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';
import { Product } from './productsApi';

export interface CartItem {
  id: number;
  productId: string;
  quantity: number;
  size: string;
  product: Product;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  discountAmount: number;
  shippingAmount: number;
  finalAmount: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  size: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

/**
 * Get current user's cart
 */
export const getCart = async (): Promise<BackendResponse<CartSummary>> => {
  try {
    const response = await apiClient.get<BackendResponse<CartSummary>>(API_CONFIG.ENDPOINTS.CART.ITEMS);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (payload: AddToCartPayload): Promise<BackendResponse<CartSummary>> => {
  try {
    const response = await apiClient.post<BackendResponse<CartSummary>>(
      API_CONFIG.ENDPOINTS.CART.ADD,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, payload: UpdateCartItemPayload): Promise<BackendResponse<CartSummary>> => {
  try {
    const response = await apiClient.patch<BackendResponse<CartSummary>>(
      API_CONFIG.ENDPOINTS.CART.UPDATE(itemId),
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId: string): Promise<BackendResponse<CartSummary>> => {
  try {
    const response = await apiClient.delete<BackendResponse<CartSummary>>(
      API_CONFIG.ENDPOINTS.CART.REMOVE(itemId)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<BackendResponse<{ success: boolean }>> => {
  try {
    const response = await apiClient.delete<BackendResponse<{ success: boolean }>>(
      API_CONFIG.ENDPOINTS.CART.CLEAR
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
