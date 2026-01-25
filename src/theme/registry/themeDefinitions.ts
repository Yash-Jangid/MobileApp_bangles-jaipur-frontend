/**
 * Theme Definitions
 * 
 * Register all application themes here.
 * This replaces the old mockApi.ts approach.
 */

import { themeRegistry } from './ThemeRegistry';
import { BaseModernTheme } from '../presets/modern.preset';
import { BaseLegacyTheme } from '../presets/legacy.preset';

/**
 * White Shine Jewelry Theme (Zeraki/Modern)
 * Custom header and navigation configuration
 */
themeRegistry.registerTheme({
    id: 'white-shine-jewelry',
    name: 'White Shine Jewelry',
    family: 'modern',
    config: {
        ...BaseModernTheme,
        id: 'white-shine-jewelry',
        name: 'White Shine Jewelry',
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
        layout: {
            ...BaseModernTheme.layout,
            // Custom navigation tabs for white-shine-jewelry
            navigationTabs: ['Home', 'Collections', 'Wishlist', 'Profile'],
        },
    } as any,
    // Override header component for this theme only
    componentOverrides: {
        header: 'WhiteShine',
    },
    metadata: {
        description: 'Modern, clean design for jewelry e-commerce with custom header',
        category: 'Modern',
        tags: ['modern', 'clean', 'zeraki', 'white-shine'],
    },
});

/**
 * Midnight Shine Theme (Legacy/Dark)
 */
themeRegistry.registerTheme({
    id: 'midnight-shine',
    name: 'MidNight Shine',
    family: 'legacy',
    config: {
        ...BaseLegacyTheme,
        id: 'midnight-shine',
        name: 'MidNight Shine',
        colors: {
            primary: { light: '#D4AF37', dark: '#D4AF37' },
            secondary: { light: '#8B4513', dark: '#8B4513' },
            accent: { light: '#FF6B6B', dark: '#FF6B6B' },

            // Midnight Shine is always dark
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
    } as any,
    metadata: {
        description: 'Classic dark theme with gold accents',
        category: 'Legacy',
        tags: ['dark', 'legacy', 'midnight'],
    },
});

/**
 * Export registry for use in app
 */
export { themeRegistry };
