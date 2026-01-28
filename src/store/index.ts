import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import appSettingsReducer from './slices/appSettingsSlice';
import profileReducer from './slices/profileSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import bannersReducer from './slices/bannersSlice';
import wishlistReducer from './slices/wishlistSlice';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['auth', 'appSettings'],
	timeout: 10000,
	debug: __DEV__,
};

const rootReducer = combineReducers({
	auth: authReducer,
	appSettings: appSettingsReducer,
	profile: profileReducer,
	products: productsReducer,
	cart: cartReducer,
	orders: ordersReducer,
	banners: bannersReducer,
	wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
