import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService, saveAccessToken, saveRefreshToken, clearAuthData } from '../../utils/storage';
import * as authApi from '../../api/authApi';
import * as registrationApi from '../../api/registrationApi';
import type { RegisterDto, VerifyOtpDto, LoginDto, AuthResponse } from '../../types/auth.types';

/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */

export interface User {
	id: string; // UUID from backend
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	avatar?: string;
	role: string;
}

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isGuestMode: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isGuestMode: false,
	loading: false,
	error: null,
};

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Parse API errors consistently across all thunks
 */
const parseApiError = (error: unknown): string => {
	if (error && typeof error === 'object') {
		const err = error as any;
		return err.response?.data?.message || err.message || 'An unexpected error occurred';
	}
	return 'An unexpected error occurred';
};

/**
 * Validate and unwrap backend response
 * Throws if response is malformed
 */
const validateAuthResponse = (response: any): AuthResponse => {
	const data = response.data || response;

	if (!data || !data.user || !data.accessToken || !data.refreshToken) {
		console.error('Invalid auth response:', response);
		throw new Error('Invalid server response: missing required authentication data');
	}

	return data;
};

/**
 * Handle successful authentication - saves tokens and returns normalized payload
 * This is the single source of truth for post-auth processing
 */
const handleAuthSuccess = async (responseData: AuthResponse) => {
	const { accessToken, refreshToken, user } = responseData;

	// Save tokens to secure storage
	await saveAccessToken(accessToken);
	await saveRefreshToken(refreshToken);
	await storageService.setUserData(user);

	// Return normalized user object
	return {
		user: {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		},
		accessToken,
		refreshToken,
	};
};

/**
 * ============================================================================
 * ASYNC THUNKS
 * ============================================================================
 */

/**
 * Register new user (legacy - not used in new signup flow)
 */
export const registerUser = createAsyncThunk(
	'auth/register',
	async (data: RegisterDto, { rejectWithValue }) => {
		try {
			const response = await authApi.registerUser(data);
			const validatedData = validateAuthResponse(response);
			return await handleAuthSuccess(validatedData);
		} catch (error) {
			return rejectWithValue(parseApiError(error));
		}
	}
);

/**
 * Verify registration OTP and create account
 */
export const verifyRegistrationOtpThunk = createAsyncThunk(
	'auth/verifyRegistrationOtp',
	async (data: VerifyOtpDto, { rejectWithValue }) => {
		try {
			const response = await registrationApi.verifyRegistrationOtp(data);
			const validatedData = validateAuthResponse(response);
			return await handleAuthSuccess(validatedData);
		} catch (error) {
			return rejectWithValue(parseApiError(error));
		}
	}
);

/**
 * Login with email and password
 */
export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials: LoginDto, { rejectWithValue }) => {
		try {
			const response = await authApi.loginUser(credentials);
			const validatedData = validateAuthResponse(response);
			return await handleAuthSuccess(validatedData);
		} catch (error) {
			return rejectWithValue(parseApiError(error));
		}
	}
);

/**
 * Logout user and clear all auth data
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
	try {
		await authApi.logoutUser();
	} catch (error) {
		// Continue with local cleanup even if backend call fails
		console.warn('Logout API call failed, proceeding with local cleanup:', error);
	} finally {
		// Always clear local data
		await clearAuthData();
		await storageService.removeUserData();
	}
	return true;
});

/**
 * Check authentication status
 * Trusts redux-persist for state rehydration
 */
export const checkAuthStatus = createAsyncThunk(
	'auth/checkStatus',
	async (_, { getState, rejectWithValue }) => {
		try {
			const state = getState() as { auth: AuthState };
			const { accessToken, user } = state.auth;

			// Redux-persist handles rehydration automatically
			if (accessToken && user) {
				return { user, accessToken };
			}

			return rejectWithValue('No stored credentials');
		} catch (error) {
			return rejectWithValue(parseApiError(error));
		}
	}
);

/**
 * ============================================================================
 * SLICE
 * ============================================================================
 */

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		enableGuestMode: (state) => {
			state.isGuestMode = true;
		},
		disableGuestMode: (state) => {
			state.isGuestMode = false;
		},
	},
	extraReducers: (builder) => {
		// Register
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.isGuestMode = false;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Verify Registration OTP
		builder
			.addCase(verifyRegistrationOtpThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(verifyRegistrationOtpThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.isGuestMode = false;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			.addCase(verifyRegistrationOtpThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Login
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.isGuestMode = false;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Logout
		builder
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.isGuestMode = false;
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state) => {
				// Even on error, clear state (logout should always succeed locally)
				state.loading = false;
				state.isAuthenticated = false;
				state.isGuestMode = false;
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.error = null;
			});

		// Check Auth Status
		builder
			.addCase(checkAuthStatus.pending, (state) => {
				state.loading = true;
			})
			.addCase(checkAuthStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.error = null;
			})
			.addCase(checkAuthStatus.rejected, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.accessToken = null;
			});
	},
});

export const { clearError, setLoading, enableGuestMode, disableGuestMode } = authSlice.actions;
export default authSlice.reducer;
