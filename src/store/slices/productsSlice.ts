import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as productsApi from '../../api/productsApi';
import * as categoriesApi from '../../api/categoriesApi';
import { Product, ProductsQueryParams } from '../../api/productsApi';
import { Category } from '../../api/categoriesApi';

// State interface
export interface ProductsState {
    products: Product[];
    featuredProducts: Product[];
    categories: Category[];
    selectedProduct: Product | null;
    loading: {
        products: boolean;
        featuredProducts: boolean;
        categories: boolean;
        productDetails: boolean;
    };
    error: {
        products: string | null;
        featuredProducts: string | null;
        categories: string | null;
        productDetails: string | null;
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
}

const initialState: ProductsState = {
    products: [],
    featuredProducts: [],
    categories: [],
    selectedProduct: null,
    loading: {
        products: false,
        featuredProducts: false,
        categories: false,
        productDetails: false,
    },
    error: {
        products: null,
        featuredProducts: null,
        categories: null,
        productDetails: null,
    },
    meta: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params: ProductsQueryParams | undefined, { rejectWithValue }) => {
        try {
            const response = await productsApi.getProducts(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeaturedProducts',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const response = await productsApi.getFeaturedProducts(limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch featured products');
        }
    }
);

export const fetchProductBySlug = createAsyncThunk(
    'products/fetchProductBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await productsApi.getProductBySlug(slug);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch product details');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await productsApi.getProductById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch product details');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.getCategories();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
    }
);

// Slice
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        clearProductsError: (state) => {
            state.error = {
                products: null,
                featuredProducts: null,
                categories: null,
                productDetails: null,
            };
        },
    },
    extraReducers: (builder) => {
        // Fetch products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading.products = true;
                state.error.products = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading.products = false;
                state.products = action.payload.items;
                state.meta = action.payload.meta;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading.products = false;
                state.error.products = action.payload as string;
            });

        // Fetch featured products
        builder
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.loading.featuredProducts = true;
                state.error.featuredProducts = null;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.loading.featuredProducts = false;
                state.featuredProducts = action.payload.items;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.loading.featuredProducts = false;
                state.error.featuredProducts = action.payload as string;
            });

        // Fetch product by slug
        builder
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading.productDetails = true;
                state.error.productDetails = null;
            })
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                state.loading.productDetails = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductBySlug.rejected, (state, action) => {
                state.loading.productDetails = false;
                state.error.productDetails = action.payload as string;
            });

        // Fetch product by ID
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading.productDetails = true;
                state.error.productDetails = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading.productDetails = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading.productDetails = false;
                state.error.productDetails = action.payload as string;
            });

        // Fetch categories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading.categories = true;
                state.error.categories = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading.categories = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading.categories = false;
                state.error.categories = action.payload as string;
            });
    },
});

export const { clearSelectedProduct, clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
