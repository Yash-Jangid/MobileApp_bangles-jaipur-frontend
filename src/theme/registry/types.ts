/**
 * Theme Registry Type Definitions
 * 
 * Flexible, strongly-typed interfaces for scalable theme system.
 * Supports 100+ themes with minimal code changes.
 */

import { ThemeConfiguration } from '../types';

/**
 * Theme Family Groups
 * Used for inheritance and variant management
 */
export type ThemeFamily = 'modern' | 'legacy' | 'minimal' | 'custom';

/**
 * Component Variant Types
 * Add new component types here as system grows
 */
export type ComponentType =
    | 'Header'
    | 'Profile'
    | 'ProductCard'
    | 'Navigation'
    | 'OrderList'
    | 'Cart';

/**
 * Header Variants
 * Each variant is a separate component implementation
 */
export type HeaderVariant = 'Standard' | 'Legacy' | 'Minimal' | 'WhiteShine';

/**
 * Profile Variants
 */
export type ProfileVariant = 'Modern' | 'Legacy' | 'Card' | 'Compact';

/**
 * Product Card Variants
 */
export type ProductCardVariant = 'Zeraki' | 'Classic' | 'Grid' | 'List';

/**
 * Navigation Variants
 */
export type NavigationVariant = 'BottomTabs' | 'Drawer' | 'None';

/**
 * Order List Variants
 */
export type OrderListVariant = 'Detailed' | 'Compact' | 'Card';

/**
 * Cart Variants
 */
export type CartVariant = 'Standard' | 'Minimal';

/**
 * Component Variant Map
 * Defines which variant to use for each component type
 * 
 * EXTENSIBLE: Add new components here without modifying existing code
 */
export interface ComponentVariantMap {
    Header: HeaderVariant;
    Profile: ProfileVariant;
    ProductCard: ProductCardVariant;
    Navigation: NavigationVariant;
    OrderList: OrderListVariant;
    Cart: CartVariant;
}

/**
 * Partial Component Variant Map
 * Allows themes to specify only components they want to override
 */
export type PartialComponentVariantMap = Partial<ComponentVariantMap>;

/**
 * Theme Variant Definition
 * Complete theme specification including visual tokens and component mappings
 */
export interface ThemeVariant {
    /** Unique theme identifier */
    id: string;

    /** Human-readable theme name */
    name: string;

    /** Theme family for inheritance */
    family: ThemeFamily;

    /** Component variant mappings */
    components: ComponentVariantMap;

    /** Visual configuration (colors, typography, spacing, etc.) */
    config: ThemeConfiguration;

    /** Optional: Parent theme to inherit from */
    extends?: string;

    /** Optional: Metadata for admin panel */
    metadata?: {
        description?: string;
        previewImage?: string;
        category?: string;
        tags?: string[];
        createdBy?: string;
        createdAt?: Date;
    };
}

/**
 * Theme Registration Options
 * Simplified interface for registering new themes
 */
export interface ThemeRegistrationOptions {
    id: string;
    name: string;
    family?: ThemeFamily;
    components?: PartialComponentVariantMap; // Can override specific components
    config: ThemeConfiguration;
    extends?: string; // Inherit from base theme
    metadata?: ThemeVariant['metadata'];
}

/**
 * Component Variant Registry
 * Maps variant names to actual component implementations
 */
export type ComponentVariantRegistry<T extends ComponentType> = {
    [K in ComponentVariantMap[T]]: React.ComponentType<any>;
};

/**
 * Theme Resolver Result
 * Cached result of component resolution
 */
export interface ResolvedComponent<T extends ComponentType = ComponentType> {
    variant: ComponentVariantMap[T];
    component: React.ComponentType<any>;
    themeId: string;
    cachedAt: number;
}

/**
 * Theme Registry Configuration
 */
export interface RegistryConfig {
    /** Enable caching for component resolution */
    enableCaching: boolean;

    /** Cache TTL in milliseconds */
    cacheTTL: number;

    /** Enable validation of theme configurations */
    enableValidation: boolean;

    /** Fallback theme ID if requested theme not found */
    fallbackThemeId: string;

    /** Enable lazy loading of component variants */
    enableLazyLoading: boolean;
}

/**
 * Default Registry Configuration
 */
export const DEFAULT_REGISTRY_CONFIG: RegistryConfig = {
    enableCaching: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    enableValidation: true,
    fallbackThemeId: 'white-shine-jewelry',
    enableLazyLoading: true,
};

/**
 * Type guard for ComponentType
 */
export function isComponentType(value: string): value is ComponentType {
    return ['Header', 'Profile', 'ProductCard', 'Navigation', 'OrderList', 'Cart'].includes(value);
}

/**
 * Type guard for ThemeFamily
 */
export function isThemeFamily(value: string): value is ThemeFamily {
    return ['modern', 'legacy', 'minimal', 'custom'].includes(value);
}
