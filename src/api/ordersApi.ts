import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';
import { CartItem } from './cartApi';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  size: string;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  addressType?: string;
}

export interface Order {
  id: string; // Backend uses UUID
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'phonepe' | 'razorpay';
  couponCode?: string;
}

export interface OrdersListResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Create a new order
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<BackendResponse<Order>> => {
  try {
    const response = await apiClient.post<BackendResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS.CREATE,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get all orders for current user
 */
export const getOrders = async (page: number = 1, limit: number = 20): Promise<BackendResponse<OrdersListResponse>> => {
  try {
    const response = await apiClient.get<BackendResponse<OrdersListResponse>>(
      `${API_CONFIG.ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get order details by ID
 */
export const getOrderById = async (orderId: string): Promise<BackendResponse<Order>> => {
  try {
    const response = await apiClient.get<BackendResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS.DETAILS(orderId)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
/**
 * Get enabled payment methods from backend
 */
export const getEnabledPaymentMethods = async (): Promise<BackendResponse<string[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<string[]>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.METHODS
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
