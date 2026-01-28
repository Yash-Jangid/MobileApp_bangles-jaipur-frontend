import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeConfiguration, ProcessedTheme, ThemeMode, ThemeColors, ColorToken } from './types';
import { fetchThemeConfig, zerakiTheme, midnightTheme } from './mockApi';
import { getActiveTheme } from '../api/themesApi';

const THEME_ID_KEY = '@app_theme_id';
const THEME_MODE_KEY = '@app_theme_mode';

interface ThemeContextType {
    theme: ProcessedTheme;
    themeMode: ThemeMode | 'auto';
    activeMode: ThemeMode;
    themeId: string;
    isLoading: boolean;
    toggleThemeMode: () => void;
    setThemeMode: (mode: ThemeMode | 'auto') => void;
    setThemeId: (id: string) => void;
}

// Initial default to prevent null checks everywhere before load
const defaultTheme = zerakiTheme;
const defaultProcessed: ProcessedTheme = {
    colors: Object.keys(defaultTheme.colors).reduce((acc, key) => ({
        ...acc, [key]: defaultTheme.colors[key as keyof ThemeColors].light
    }), {} as any),
    typography: defaultTheme.typography,
    spacing: defaultTheme.spacing,
    borderRadius: defaultTheme.borderRadius,
    layout: defaultTheme.layout,
    isDark: false,
    mode: 'light'
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultProcessed,
    themeMode: 'auto',
    activeMode: 'light',
    themeId: defaultTheme.id,
    isLoading: true,
    toggleThemeMode: () => { },
    setThemeMode: () => { },
    setThemeId: () => { },
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeId, setThemeIdState] = useState<string>(defaultTheme.id);
    const [themeConfig, setThemeConfig] = useState<ThemeConfiguration>(defaultTheme);
    const [themeMode, setThemeModeState] = useState<ThemeMode | 'auto'>('auto');
    const [isLoading, setIsLoading] = useState(true);

    // 1. Load persisted settings
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [savedId, savedMode] = await Promise.all([
                AsyncStorage.getItem(THEME_ID_KEY),
                AsyncStorage.getItem(THEME_MODE_KEY)
            ]);

            // Try to fetch active theme from backend first
            const activeTheme = await getActiveTheme();

            if (activeTheme) {
                setThemeConfig(activeTheme);
                setThemeIdState(activeTheme.id);
            } else if (savedId) {
                // Fallback to saved ID if backend fails
                setThemeIdState(savedId);
                const config = await fetchThemeConfig(savedId);
                setThemeConfig(config);
            }

            if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto') {
                setThemeModeState(savedMode);
            }
        } catch (error) {
            console.error('Failed to load theme settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Handle Theme ID Change (Switching Design Systems)
    const setThemeId = async (id: string) => {
        setIsLoading(true);
        try {
            // Check if it's one of our mock themes first (legacy support)
            // Or ideally, we should have an API to fetch a specific theme by ID if we want to switch
            // For now, let's keep the mockApi for switching manually, or fetch from backend if we implement getThemeById
            const config = await fetchThemeConfig(id);
            setThemeConfig(config);
            setThemeIdState(id);
            await AsyncStorage.setItem(THEME_ID_KEY, id);
        } catch (error) {
            console.error('Failed to set theme ID:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Handle Mode Change (Light/Dark)
    const setThemeMode = async (mode: ThemeMode | 'auto') => {
        setThemeModeState(mode);
        await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    };

    const toggleThemeMode = () => {
        const current = activeMode;
        setThemeMode(current === 'light' ? 'dark' : 'light');
    };

    // 4. Compute Active Mode
    const activeMode: ThemeMode = useMemo(() => {
        if (themeMode === 'auto') {
            return systemColorScheme === 'dark' ? 'dark' : 'light';
        }
        return themeMode;
    }, [themeMode, systemColorScheme]);

    // 5. Flatten Theme for Consumers
    const processedTheme: ProcessedTheme = useMemo(() => {
        const colors = Object.entries(themeConfig.colors).reduce((acc, [key, token]) => {
            return {
                ...acc,
                [key]: token[activeMode]
            };
        }, {} as { [K in keyof ThemeColors]: string });

        return {
            colors,
            typography: themeConfig.typography,
            spacing: themeConfig.spacing,
            borderRadius: themeConfig.borderRadius,
            layout: themeConfig.layout,
            isDark: activeMode === 'dark',
            mode: activeMode
        };
    }, [themeConfig, activeMode]);

    return (
        <ThemeContext.Provider value={{
            theme: processedTheme,
            themeMode,
            activeMode,
            themeId,
            isLoading,
            toggleThemeMode,
            setThemeMode,
            setThemeId
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
