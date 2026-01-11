export const lightTheme = {
    isDark: false,
    colors: {
        // Primary brand colors
        primary: '#D4AF37',
        primaryLight: '#F5E6B3',
        primaryDark: '#B8941F',
        headerBackground: '#360F10',
        headerText: '#FFFFFF',

        // Background colors
        background: '#FFFFFF',
        backgroundSecondary: '#F8F8F8',
        backgroundTertiary: '#F5F0E8',

        // Card and surface colors
        card: '#FFFFFF',
        surface: '#FFFFFF',

        // Text colors
        text: '#1a1a1a',
        textSecondary: '#666666',
        textMuted: '#999999',
        textLight: '#FFFFFF',

        // Border and divider
        border: 'rgba(0,0,0,0.08)',
        divider: 'rgba(0,0,0,0.06)',

        // Status colors
        success: '#2E7D32',
        successBackground: '#E8F5E9',
        warning: '#F57C00',
        warningBackground: '#FFF3E0',
        error: '#FF3B30',
        errorBackground: '#FFEBEE',
        info: '#2196F3',
        infoBackground: '#E3F2FD',

        // Action colors
        actionCard1: '#FFE5E5',
        actionCard2: '#FFF0E5',
        actionCard3: '#E5F5FF',
        actionCard4: '#F0E5FF',
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
        },
    },
};

export const darkTheme = {
    isDark: true,
    colors: {
        // Primary brand colors (slightly adjusted for dark mode)
        primary: '#D4AF37',
        primaryLight: '#E5C866',
        primaryDark: '#B8941F',

        // Background colors
        background: '#121212',
        backgroundSecondary: '#1E1E1E',
        backgroundTertiary: '#2A2A2A',
        headerBackground: '#360F10',
        headerText: '#FFFFFF',

        // Card and surface colors
        card: '#1E1E1E',
        surface: '#2A2A2A',

        // Text colors
        text: '#FFFFFF',
        textSecondary: '#B3B3B3',
        textMuted: '#808080',
        textLight: '#1a1a1a',

        // Border and divider
        border: 'rgba(255,255,255,0.1)',
        divider: 'rgba(255,255,255,0.08)',

        // Status colors
        success: '#4CAF50',
        successBackground: '#1B5E20',
        warning: '#FF9800',
        warningBackground: '#E65100',
        error: '#F44336',
        errorBackground: '#B71C1C',
        info: '#2196F3',
        infoBackground: '#0D47A1',

        // Action colors (darker variants)
        actionCard1: '#3D1F1F',
        actionCard2: '#3D2B1F',
        actionCard3: '#1F2B3D',
        actionCard4: '#2B1F3D',
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 1,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 2,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 4,
        },
    },
};

export type Theme = typeof lightTheme;
