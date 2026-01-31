import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../store/hooks';
import { setOffline } from '../store/slices/appSettingsSlice';

/**
 * ConnectivityManager
 * 
 * Global manager for monitoring internet connectivity.
 * Updates the Redux store state which in turn triggers the OfflineScreen.
 */
export const ConnectivityManager: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener((state) => {
            const isOffline = state.isConnected === false || state.isInternetReachable === false;

            if (__DEV__) {
                console.log(`🌐 [Connectivity] Connected: ${state.isConnected}, Reachable: ${state.isInternetReachable}`);
            }

            dispatch(setOffline(isOffline));
        });

        // Initial check
        NetInfo.fetch().then((state) => {
            const isOffline = state.isConnected === false || state.isInternetReachable === false;
            dispatch(setOffline(isOffline));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return null; // This component doesn't render anything
};
