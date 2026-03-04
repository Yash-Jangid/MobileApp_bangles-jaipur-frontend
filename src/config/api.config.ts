import { API_BASE_URL } from './env.config';

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,

    // API Version
    VERSION: 'v1',

    // Timeout in milliseconds
    TIMEOUT: 30000,

    // Endpoints
    ENDPOINTS: {
        // Auth
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            REFRESH: '/auth/refresh',
            LOGOUT: '/auth/logout',
        },

        // Users
        USERS: {
            PROFILE: '/users/profile',
            ADDRESSES: '/users/addresses',
            BY_ID: (id: string) => `/users/${id}`,
        },

        // Products
        PRODUCTS: {
            LIST: '/products',
            DETAILS: (slug: string) => `/products/${slug}`,
        },

        // Categories
        CATEGORIES: {
            LIST: '/categories',
            DETAILS: (id: string) => `/categories/${id}`,
        },

        // Cart
        CART: {
            ITEMS: '/cart/items',
            ADD: '/cart/items',
            UPDATE: (itemId: string) => `/cart/items/${itemId}`,
            REMOVE: (itemId: string) => `/cart/items/${itemId}`,
            CLEAR: '/cart/clear',
        },

        // Orders
        ORDERS: {
            CREATE: '/orders',
            LIST: '/orders',
            DETAILS: (id: string) => `/orders/${id}`,
        },

        // Banners
        BANNERS: {
            LIST: '/banners',
        },

        // Payments
        PAYMENTS: {
            INITIATE: '/payments/initiate',
            METHODS: '/payments/methods',
        },

        // Health
        HEALTH: '/health',
    },
};

// Build full API URL
export const getApiUrl = (endpoint: string): string => {
    console.log('Building API URL...', `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`);
    return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
