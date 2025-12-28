import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/ApiService';
import { storageService, saveAccessToken, saveRefreshToken, clearAuthData } from '../../utils/storage';
import * as authApi from '../../api/authApi';
export interface User {
	name: string;
	email: string;
	id: number;
	avatar?: string;
	role?: string;
}

export interface AuthState {
	user: User | null;
	token: string | null; // For backward compatibility with old API
	accessToken: string | null; // New backend JWT access token
	refreshToken: string | null; // New backend refresh token
	isAuthenticated: boolean;
	isGuestMode: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isGuestMode: false,
	loading: false,
	error: null,
};

// Register new user with backend API
export const registerUser = createAsyncThunk(
	'auth/register',
	async (data: { firstName: string; lastName: string; email: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await authApi.registerUser(data);
			console.log('Register response from backend:', response);

			// Backend returns: { data: { accessToken, refreshToken, user } }
			const { accessToken, refreshToken, user } = response.data;

			// Save tokens
			await saveAccessToken(accessToken);
			await saveRefreshToken(refreshToken);
			await storageService.setUserData(user);

			return {
				user: {
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
					role: user.role,
				},
				accessToken,
				refreshToken,
			};
		} catch (error: any) {
			return rejectWithValue(error.message || 'Registration failed');
		}
	}
);

// Login with new backend API
export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		try {
			// Try new backend API first
			const response = await authApi.loginUser({ email, password });
			console.log('Login response from backend:', response);

			// Backend returns: { data: { accessToken, refreshToken, user } }
			const { accessToken, refreshToken, user } = response.data;

			// Save tokens
			await saveAccessToken(accessToken);
			await saveRefreshToken(refreshToken);
			await storageService.setUserData(user);

			return {
				user: {
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
					role: user.role,
				},
				accessToken,
				refreshToken,
			};
		} catch (error: any) {
			// Fallback to old API if new backend fails
			try {
				const oldResponse = await apiService.login(email, password);
				if (oldResponse.success) {
					return {
						user: oldResponse.data,
						token: oldResponse.data?.token,
						accessToken: null,
						refreshToken: null,
					};
				}
			} catch (fallbackError) {
				console.log('Old API also failed');
			}
			return rejectWithValue(error.message || 'Login failed');
		}
	}
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		// Call backend logout endpoint
		await authApi.logoutUser();

		// Clear all stored data
		await clearAuthData();
		await storageService.removeAuthToken();
		await storageService.removeUserData();
		return true;
	} catch (error) {
		// Even if backend call fails, clear local data
		await clearAuthData();
		await storageService.removeAuthToken();
		await storageService.removeUserData();
		return true;
	}
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { getState, rejectWithValue }) => {
	try {
		console.log('Checking auth status...');
		// Redux Persist automatically rehydrates state, so we check the current state
		const state = getState() as { auth: AuthState };
		const { token, user } = state.auth;

		console.log('Current Redux state:', { token: !!token, user: !!user });

		if (token && user) {
			console.log('Found token and user in Redux state');
			return { user, token };
		}

		// Fallback: check AsyncStorage if Redux state is empty
		console.log('Checking AsyncStorage fallback...');
		const storedToken = await storageService.getAuthToken();
		const storedUserData = await storageService.getUserData();
		console.log('AsyncStorage data:', { token: !!storedToken, user: !!storedUserData });

		if (storedToken && storedUserData) {
			console.log('Found token and user in AsyncStorage');
			return { user: storedUserData, token: storedToken };
		}

		console.log('No stored credentials found');
		return rejectWithValue('No stored credentials');
	} catch (error) {
		console.error('Error checking auth status:', error);
		return rejectWithValue('Failed to check auth status');
	}
});

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
		// Register cases
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				console.log('Registration successful:', action.payload.user?.name);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Login cases
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token || null;
				state.accessToken = action.payload.accessToken || null;
				state.refreshToken = action.payload.refreshToken || null;
				console.log('Login successful, user authenticated:', action.payload.user?.name);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(checkAuthStatus.pending, (state) => {
				state.loading = true;
			})
			.addCase(checkAuthStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.error = null;
				console.log('Auth status check successful, user is authenticated:', action.payload.user?.name);
			})
			.addCase(checkAuthStatus.rejected, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			});
	},
});

export const { clearError, setLoading, enableGuestMode, disableGuestMode } = authSlice.actions;
export default authSlice.reducer;
