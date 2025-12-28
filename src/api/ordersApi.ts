import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';
import { CartItem } from './cartApi';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size: string;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
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
  items: {
    productId: number;
    quantity: number;
    size: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
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
export const getOrderById = async (orderId: number): Promise<BackendResponse<Order>> => {
  try {
    const response = await apiClient.get<BackendResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS.DETAILS(orderId)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
