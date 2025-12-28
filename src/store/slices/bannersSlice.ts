import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as bannersApi from '../../api/bannersApi';
import { Banner } from '../../api/bannersApi';

export interface BannersState {
    banners: Banner[];
    loading: boolean;
    error: string | null;
}

const initialState: BannersState = {
    banners: [],
    loading: false,
    error: null,
};

// Async thunk to fetch banners
export const fetchBanners = createAsyncThunk(
    'banners/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await bannersApi.getBanners();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch banners');
        }
    }
);

const bannersSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        clearBannersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearBannersError } = bannersSlice.actions;
export default bannersSlice.reducer;
