import { ThemeConfiguration } from './types';

export const zerakiTheme: ThemeConfiguration = {
    id: 'white-shine-jewelry',
    name: 'White Shine Jewelry',
    layoutMode: 'zeraki',
    colors: {
        primary: { light: '#D4AF37', dark: '#FFD700' }, // Gold
        secondary: { light: '#8B4513', dark: '#A0522D' },
        accent: { light: '#00C853', dark: '#00E676' }, // Vivid Green for badges

        background: { light: '#FFFFFF', dark: '#121212' },
        surface: { light: '#FFFFFF', dark: '#1E1E1E' },
        surfaceHighlight: { light: '#F5F5F5', dark: '#2C2C2C' },

        textPrimary: { light: '#111827', dark: '#FFFFFF' },
        textSecondary: { light: '#6B7280', dark: '#B3B3B3' },
        textInverse: { light: '#FFFFFF', dark: '#000000' },
        textInteractive: { light: '#FFFFFF', dark: '#000000' },

        buttonBackground: { light: '#000000', dark: '#D4AF37' }, // Black in light, Gold in dark
        buttonText: { light: '#FFFFFF', dark: '#000000' },

        success: { light: '#00C853', dark: '#00C853' }, // Green Badge
        error: { light: '#D32F2F', dark: '#FF5252' },   // Red Price
        info: { light: '#2196F3', dark: '#64B5F6' },

        border: { light: '#E5E7EB', dark: '#374151' },
        divider: { light: '#F3F4F6', dark: '#1F2937' },
    },
    typography: {
        h1: { fontFamily: 'System', fontSize: 24, fontWeight: '700' },
        h2: { fontFamily: 'System', fontSize: 20, fontWeight: '600' },
        h3: { fontFamily: 'System', fontSize: 18, fontWeight: '600' },
        body1: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal' },
        body2: { fontFamily: 'System', fontSize: 14, fontWeight: 'normal' },
        caption: { fontFamily: 'System', fontSize: 12, fontWeight: 'normal' },
        button: { fontFamily: 'System', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
    },
    spacing: {
        unit: 4,
        screenPadding: 16,
        cardPadding: 12,
    },
    borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
        round: 999,
    },
    layout: {
        headerStyle: 'logo-left-icons-right',
        showBottomTabs: true,
        cardStyle: 'zeraki-minimal',
        showLegacySections: false
    }
};

export const midnightTheme: ThemeConfiguration = {
    id: 'midnight-shine',
    name: 'MidNight Shine',
    layoutMode: 'default',
    colors: {
        primary: { light: '#D4AF37', dark: '#D4AF37' },
        secondary: { light: '#8B4513', dark: '#8B4513' },
        accent: { light: '#FF6B6B', dark: '#FF6B6B' },

        // Midnight Shine should be DARK by default, even in "Light" mode
        background: { light: '#000000', dark: '#000000' },
        surface: { light: '#111111', dark: '#111111' },
        surfaceHighlight: { light: '#222222', dark: '#222222' },

        textPrimary: { light: '#FFFFFF', dark: '#FFFFFF' },
        textSecondary: { light: '#9CA3AF', dark: '#9CA3AF' },
        textInverse: { light: '#000000', dark: '#000000' },
        textInteractive: { light: '#FFFFFF', dark: '#FFFFFF' },

        buttonBackground: { light: '#D4AF37', dark: '#D4AF37' },
        buttonText: { light: '#FFFFFF', dark: '#FFFFFF' },

        success: { light: '#10B981', dark: '#10B981' },
        error: { light: '#EF4444', dark: '#EF4444' },
        info: { light: '#3B82F6', dark: '#3B82F6' },

        border: { light: '#374151', dark: '#374151' },
        divider: { light: '#374151', dark: '#374151' },
    },
    typography: {
        h1: { fontFamily: 'System', fontSize: 26, fontWeight: 'bold' },
        h2: { fontFamily: 'System', fontSize: 22, fontWeight: 'bold' },
        h3: { fontFamily: 'System', fontSize: 18, fontWeight: '600' },
        body1: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal' },
        body2: { fontFamily: 'System', fontSize: 14, fontWeight: 'normal' },
        caption: { fontFamily: 'System', fontSize: 12, fontWeight: 'normal' },
        button: { fontFamily: 'System', fontSize: 16, fontWeight: 'bold' },
    },
    spacing: {
        unit: 8,
        screenPadding: 20,
        cardPadding: 16,
    },
    borderRadius: {
        small: 8,
        medium: 12,
        large: 24,
        round: 50, // More rounded in old theme
    },
    layout: {
        headerStyle: 'simple-centered',
        showBottomTabs: false, // Old theme used Drawer or Stack mostly
        cardStyle: 'standard',
        showLegacySections: true
    }
};

// Simulate API Fetch
export const fetchThemeConfig = async (themeId: string): Promise<ThemeConfiguration> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            if (themeId === 'white-shine-jewelry') resolve(zerakiTheme);
            else resolve(midnightTheme);
        }, 100);
    });
};
