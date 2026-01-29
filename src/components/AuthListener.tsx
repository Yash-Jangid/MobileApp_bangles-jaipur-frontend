import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthFailureListener } from '../api/apiClient';
import { logoutUser } from '../store/slices/authSlice';
import { AppDispatch } from '../store';

/**
 * Headless component that syncs API-level auth failures with Redux and UI.
 * Must be placed inside the Redux Provider.
 */
export const AuthListener: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Register the listener to handle forced logouts from apiClient
        setAuthFailureListener(() => {
            console.log('🏁 [Root] Auth failure notified from API layer. Dispatching logout.');
            dispatch(logoutUser());
        });

        return () => {
            // Cleanup: No-op listener
            setAuthFailureListener(() => { });
        };
    }, [dispatch]);

    return null;
};
