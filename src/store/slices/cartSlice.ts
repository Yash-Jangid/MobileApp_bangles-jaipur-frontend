import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as cartApi from '../../api/cartApi';
import { CartItem, CartSummary, AddToCartPayload, UpdateCartItemPayload } from '../../api/cartApi';

export interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    discountAmount: number;
    shippingAmount: number;
    finalAmount: number;
    loading: boolean;
    error: string | null;
    actionLoading: {
        add: boolean;
        update: boolean;
        remove: boolean;
        clear: boolean;
    };
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    discountAmount: 0,
    shippingAmount: 0,
    finalAmount: 0,
    loading: false,
    error: null,
    actionLoading: {
        add: false,
        update: false,
        remove: false,
        clear: false,
    },
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {
            const response = await cartApi.addToCart(payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, payload }: { id: number; payload: UpdateCartItemPayload }, { rejectWithValue }) => {
        try {
            const response = await cartApi.updateCartItem(id, payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update cart item');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeFromCart(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to remove from cart');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await cartApi.clearCart();
            return { success: true };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalItems = action.payload.totalItems;
                state.discountAmount = action.payload.discountAmount;
                state.shippingAmount = action.payload.shippingAmount;
                state.finalAmount = action.payload.finalAmount;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Add to Cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.actionLoading.add = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.actionLoading.add = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalItems = action.payload.totalItems;
                state.discountAmount = action.payload.discountAmount;
                state.shippingAmount = action.payload.shippingAmount;
                state.finalAmount = action.payload.finalAmount;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.actionLoading.add = false;
                state.error = action.payload as string;
            });

        // Update Cart Item
        builder
            .addCase(updateCartItem.pending, (state) => {
                state.actionLoading.update = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.actionLoading.update = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalItems = action.payload.totalItems;
                state.discountAmount = action.payload.discountAmount;
                state.shippingAmount = action.payload.shippingAmount;
                state.finalAmount = action.payload.finalAmount;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.actionLoading.update = false;
                state.error = action.payload as string;
            });

        // Remove from Cart
        builder
            .addCase(removeFromCart.pending, (state) => {
                state.actionLoading.remove = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.actionLoading.remove = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalItems = action.payload.totalItems;
                state.discountAmount = action.payload.discountAmount;
                state.shippingAmount = action.payload.shippingAmount;
                state.finalAmount = action.payload.finalAmount;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.actionLoading.remove = false;
                state.error = action.payload as string;
            });

        // Clear Cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.actionLoading.clear = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.actionLoading.clear = false;
                state.items = [];
                state.totalAmount = 0;
                state.totalItems = 0;
                state.discountAmount = 0;
                state.shippingAmount = 0;
                state.finalAmount = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.actionLoading.clear = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
