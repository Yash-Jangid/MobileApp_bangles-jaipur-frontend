import apiClient, { handleApiError } from './apiClient';
import { API_CONFIG } from '../config/api.config';
import { BackendResponse } from './authApi';

// Product Types
export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSpecifications {
  material?: string;
  size?: string;
  weight?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  mrp: string;
  sellingPrice: string;
  discountPercentage: string;
  stockQuantity: number;
  lowStockThreshold: number;
  sku: string;
  specifications: ProductSpecifications;
  isFeatured: boolean;
  isActive: boolean;
  images: ProductImage[];
  categoryId: string;
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  categoryId?: string;
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
}

/**
 * Get all products with filters and pagination
 */
export const getProducts = async (params?: ProductsQueryParams): Promise<BackendResponse<ProductsListResponse>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`;
    const response = await apiClient.get<BackendResponse<ProductsListResponse>>(url);
    console.log("Products response.data", response.data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (slug: string): Promise<BackendResponse<Product>> => {
  try {
    const response = await apiClient.get<BackendResponse<Product>>(
      API_CONFIG.ENDPOINTS.PRODUCTS.DETAILS(slug)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<BackendResponse<Product>> => {
  try {
    const response = await apiClient.get<BackendResponse<Product>>(
      `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/products/id/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit: number = 10): Promise<BackendResponse<ProductsListResponse>> => {
  return getProducts({ isFeatured: true, limit, page: 1 });
};
