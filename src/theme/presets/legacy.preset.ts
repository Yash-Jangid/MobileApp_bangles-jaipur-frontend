/**
 * Legacy Theme Preset
 * 
 * Base configuration for legacy/Midnight-style themes.
 * Provides defaults for classic, dark-themed designs.
 */

import { ThemeConfiguration } from '../types';
import { ComponentVariantMap } from '../registry/types';

/**
 * Legacy Component Defaults
 * Used by Midnight Shine and other legacy themes
 */
export const LEGACY_COMPONENTS: ComponentVariantMap = {
    Header: 'Legacy',
    Profile: 'Legacy',
    ProductCard: 'Classic',
    Navigation: 'None',
    OrderList: 'Compact',
    Cart: 'Minimal',
};

/**
 * Legacy Layout Defaults
 */
export const LEGACY_LAYOUT = {
    headerStyle: 'simple-centered' as const,
    showBottomTabs: false,
    cardStyle: 'standard' as const,
    showLegacySections: true,
};

/**
 * Legacy Typography
 */
export const LEGACY_TYPOGRAPHY = {
    h1: { fontFamily: 'System', fontSize: 26, fontWeight: 'bold' as const },
    h2: { fontFamily: 'System', fontSize: 22, fontWeight: 'bold' as const },
    h3: { fontFamily: 'System', fontSize: 18, fontWeight: '600' as const },
    body1: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal' as const },
    body2: { fontFamily: 'System', fontSize: 14, fontWeight: 'normal' as const },
    caption: { fontFamily: 'System', fontSize: 12, fontWeight: 'normal' as const },
    button: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: 'bold' as const
    },
};

/**
 * Legacy Spacing
 */
export const LEGACY_SPACING = {
    unit: 8,
    screenPadding: 20,
    cardPadding: 16,
};

/**
 * Legacy Border Radius
 */
export const LEGACY_BORDER_RADIUS = {
    small: 8,
    medium: 12,
    large: 24,
    round: 50,
};

/**
 * Base Legacy Theme Configuration
 * Extend this for specific legacy themes
 */
export const BaseLegacyTheme: Partial<ThemeConfiguration> = {
    layoutMode: 'default',
    typography: LEGACY_TYPOGRAPHY,
    spacing: LEGACY_SPACING,
    borderRadius: LEGACY_BORDER_RADIUS,
    layout: LEGACY_LAYOUT,
};
