import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as ordersApi from '../../api/ordersApi';
import { Order, CreateOrderPayload } from '../../api/ordersApi';

export interface OrdersState {
    orders: Order[];
    currentOrder: Order | null;
    loading: {
        list: boolean;
        details: boolean;
        create: boolean;
    };
    error: {
        list: string | null;
        details: string | null;
        create: string | null;
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
}

const initialState: OrdersState = {
    orders: [],
    currentOrder: null,
    loading: {
        list: false,
        details: false,
        create: false,
    },
    error: {
        list: null,
        details: null,
        create: null,
    },
    meta: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (payload: CreateOrderPayload, { rejectWithValue }) => {
        try {
            const response = await ordersApi.createOrder(payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create order');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrders(page, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchOrderDetails',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrderById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch order details');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearOrdersError: (state) => {
            state.error = {
                list: null,
                details: null,
                create: null,
            };
        },
    },
    extraReducers: (builder) => {
        // Create Order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading.create = false;
                state.currentOrder = action.payload; // Set created order as current for completion screen
                // Optionally add to orders list if appropriate
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload as string;
            });

        // Fetch Orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading.list = true;
                state.error.list = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading.list = false;
                state.orders = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading.list = false;
                state.error.list = action.payload as string;
            });

        // Fetch Order Details
        builder
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading.details = true;
                state.error.details = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading.details = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading.details = false;
                state.error.details = action.payload as string;
            });
    },
});

export const { clearCurrentOrder, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
