/**
 * Modern Theme Preset
 * 
 * Base configuration for modern/Zeraki-style themes.
 * Provides sensible defaults that can be extended by specific themes.
 */

import { ThemeConfiguration } from '../types';
import { ComponentVariantMap } from './types';

/**
 * Modern Component Defaults
 * Used by Zeraki and other modern themes
 */
export const MODERN_COMPONENTS: ComponentVariantMap = {
    Header: 'Standard',
    Profile: 'Modern',
    ProductCard: 'Zeraki',
    Navigation: 'BottomTabs',
    OrderList: 'Detailed',
    Cart: 'Standard',
};

/**
 * Modern Layout Defaults
 */
export const MODERN_LAYOUT = {
    headerStyle: 'logo-left-icons-right' as const,
    showBottomTabs: true,
    cardStyle: 'zeraki-minimal' as const,
    showLegacySections: false,
};

/**
 * Modern Typography
 */
export const MODERN_TYPOGRAPHY = {
    h1: { fontFamily: 'System', fontSize: 24, fontWeight: '700' as const },
    h2: { fontFamily: 'System', fontSize: 20, fontWeight: '600' as const },
    h3: { fontFamily: 'System', fontSize: 18, fontWeight: '600' as const },
    body1: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal' as const },
    body2: { fontFamily: 'System', fontSize: 14, fontWeight: 'normal' as const },
    caption: { fontFamily: 'System', fontSize: 12, fontWeight: 'normal' as const },
    button: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '600' as const,
        letterSpacing: 0.5
    },
};

/**
 * Modern Spacing
 */
export const MODERN_SPACING = {
    unit: 4,
    screenPadding: 16,
    cardPadding: 12,
};

/**
 * Modern Border Radius
 */
export const MODERN_BORDER_RADIUS = {
    small: 4,
    medium: 8,
    large: 16,
    round: 999,
};

/**
 * Base Modern Theme Configuration
 * Extend this for specific modern themes
 */
export const BaseModernTheme: Partial<ThemeConfiguration> = {
    layoutMode: 'zeraki',
    typography: MODERN_TYPOGRAPHY,
    spacing: MODERN_SPACING,
    borderRadius: MODERN_BORDER_RADIUS,
    layout: MODERN_LAYOUT,
};
