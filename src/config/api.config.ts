export const API_CONFIG = {
    BASE_URL: __DEV__ ? 'http://10.0.2.2:3000' : 'https://api.jaipurbangles.com',

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
            UPDATE_PROFILE: '/users/profile',
            ADDRESSES: '/users/addresses',
        },

        // Products
        PRODUCTS: {
            LIST: '/products',
            DETAILS: (slug: string) => `/products/${slug}`,
        },

        // Categories
        CATEGORIES: {
            LIST: '/categories',
            DETAILS: (id: number) => `/categories/${id}`,
        },

        // Cart
        CART: {
            ITEMS: '/cart/items',
            ADD: '/cart/items',
            UPDATE: (itemId: number) => `/cart/items/${itemId}`,
            REMOVE: (itemId: number) => `/cart/items/${itemId}`,
            CLEAR: '/cart/clear',
        },

        // Orders
        ORDERS: {
            CREATE: '/orders',
            LIST: '/orders',
            DETAILS: (id: number) => `/orders/${id}`,
        },

        // Payments
        PAYMENTS: {
            INITIATE: '/payments/initiate',
        },

        // Health
        HEALTH: '/health',
    },
};

// Build full API URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
