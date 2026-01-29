/**
 * Wishlist Redux Slice
 * Manages wishlist state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as wishlistApi from '../../api/wishlistApi';
import { WishlistItem } from '../../api/wishlistApi';

interface WishlistState {
    items: WishlistItem[];
    total: number;
    page: number;
    limit: number;
    isLoading: boolean;
    error: string | null;
    count: number;
}

const initialState: WishlistState = {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    isLoading: false,
    error: null,
    count: 0,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
        const response = await wishlistApi.fetchWishlist(page, limit);
        return response;
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId: string) => {
        const response = await wishlistApi.addToWishlist(productId);
        return response.data; // Return the new wishlist item
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId: string) => {
        await wishlistApi.removeFromWishlist(productId);
        return productId;
    }
);

export const fetchWishlistCount = createAsyncThunk(
    'wishlist/fetchCount',
    async () => {
        const count = await wishlistApi.getWishlistCount();
        return count;
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistState: (state) => {
            state.items = [];
            state.total = 0;
            state.count = 0;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch wishlist
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action: any) => {
                state.isLoading = false;
                const responseData = action.payload.data;
                if (responseData && responseData.items) {
                    state.items = responseData.items;
                    state.total = responseData.meta?.total || 0;
                    state.page = responseData.meta?.page || 1;
                    state.count = responseData.meta?.total || 0;
                } else {
                    // Fallback for cases where data might be at the root
                    state.items = action.payload.data || [];
                    state.total = action.payload.meta?.total || 0;
                    state.count = action.payload.meta?.total || 0;
                }
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch wishlist';
            });

        // Add to wishlist
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                // Add the new item to the list if it doesn't already exist
                if (action.payload && !state.items.find(item => item.id === action.payload.id)) {
                    state.items.unshift(action.payload);
                    state.count = state.items.length;
                    state.total = state.items.length;
                }
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to add to wishlist';
            });

        // Remove from wishlist
        builder
            .addCase(removeFromWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.productId !== action.payload);
                state.count = Math.max(0, state.count - 1);
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to remove from wishlist';
            });

        // Fetch count
        builder
            .addCase(fetchWishlistCount.fulfilled, (state, action) => {
                state.count = action.payload;
            });
    },
});

export const { clearWishlistState } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.count;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.isLoading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
    state.wishlist.items.some(item => item.productId === productId);

export default wishlistSlice.reducer;
