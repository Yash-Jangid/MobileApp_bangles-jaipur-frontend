/**
 * Theme Registry - Central Theme Management System
 * 
 * Singleton registry for managing all themes and component variants.
 * Handles theme registration, retrieval, caching, and inheritance.
 */

import {
    ThemeVariant,
    ThemeRegistrationOptions,
    ComponentType,
    ComponentVariantMap,
    PartialComponentVariantMap,
    RegistryConfig,
    DEFAULT_REGISTRY_CONFIG,
    ResolvedComponent,
} from './types';
import { ThemeConfiguration } from '../types';

const FAMILY_DEFAULTS: Record<string, Partial<ComponentVariantMap>> = {
    modern: {
        Header: 'Standard',
        Profile: 'Modern',
        ProductCard: 'Zeraki',
        Navigation: 'BottomTabs',
        OrderList: 'Detailed',
        Cart: 'Standard',
    },
    legacy: {
        Header: 'Legacy',
        Profile: 'Legacy',
        ProductCard: 'Classic',
        Navigation: 'None',
        OrderList: 'Compact',
        Cart: 'Minimal',
    },
    minimal: {
        Header: 'Minimal',
        Profile: 'Compact',
        ProductCard: 'List',
        Navigation: 'None',
        OrderList: 'Compact',
        Cart: 'Minimal',
    },
    custom: {
        Header: 'Standard',
        Profile: 'Modern',
        ProductCard: 'Zeraki',
        Navigation: 'BottomTabs',
        OrderList: 'Detailed',
        Cart: 'Standard',
    },
};

/**
 * Theme Registry Class
 * Singleton pattern for centralized theme management
 */
class ThemeRegistry {
    private static instance: ThemeRegistry;
    private themes: Map<string, ThemeVariant> = new Map();
    private componentCache: Map<string, ResolvedComponent> = new Map();
    private config: RegistryConfig;

    private constructor(config: Partial<RegistryConfig> = {}) {
        this.config = { ...DEFAULT_REGISTRY_CONFIG, ...config };
    }

    /**
     * Get singleton instance
     */
    public static getInstance(config?: Partial<RegistryConfig>): ThemeRegistry {
        if (!ThemeRegistry.instance) {
            ThemeRegistry.instance = new ThemeRegistry(config);
        }
        return ThemeRegistry.instance;
    }

    /**
     * Register a new theme
     * 
     * @param options - Theme registration options
     * @returns The registered theme variant
     */
    public registerTheme(options: ThemeRegistrationOptions): ThemeVariant {
        // Validate theme ID uniqueness
        if (this.themes.has(options.id)) {
            console.warn(`Theme '${options.id}' already registered. Overwriting.`);
        }

        // Build component map with inheritance
        const components = this.buildComponentMap(options);

        // Create theme variant
        const theme: ThemeVariant = {
            id: options.id,
            name: options.name,
            family: options.family || 'custom',
            components,
            config: options.config,
            extends: options.extends,
            metadata: options.metadata,
        };

        // Validate if enabled
        if (this.config.enableValidation) {
            this.validateTheme(theme);
        }

        // Register theme
        this.themes.set(options.id, theme);

        // Clear cache since new theme registered
        this.clearCache();

        console.log(`✅ Registered theme: ${theme.name} (${theme.id})`);
        return theme;
    }

    /**
     * Get a theme by ID
     * 
     * @param themeId - Theme identifier
     * @returns Theme variant or undefined
     */
    public getTheme(themeId: string): ThemeVariant | undefined {
        const theme = this.themes.get(themeId);

        if (!theme && this.config.fallbackThemeId) {
            console.warn(`Theme '${themeId}' not found. Using fallback: ${this.config.fallbackThemeId}`);
            return this.themes.get(this.config.fallbackThemeId);
        }

        return theme;
    }

    /**
     * Get component variant for a theme
     * 
     * @param themeId - Theme identifier
     * @param componentType - Component type
     * @returns Component variant name
     */
    public getComponentVariant<T extends ComponentType>(
        themeId: string,
        componentType: T
    ): ComponentVariantMap[T] {
        // Check cache first
        const cacheKey = `${themeId}:${componentType}`;

        if (this.config.enableCaching) {
            const cached = this.componentCache.get(cacheKey);
            if (cached && this.isCacheValid(cached)) {
                return cached.variant as ComponentVariantMap[T];
            }
        }

        // Get theme
        const theme = this.getTheme(themeId);
        if (!theme) {
            throw new Error(`Theme '${themeId}' not found`);
        }

        // Get variant
        const variant = theme.components[componentType];

        // Cache result
        if (this.config.enableCaching) {
            this.componentCache.set(cacheKey, {
                variant,
                component: null as any, // Component reference added by resolver
                themeId,
                cachedAt: Date.now(),
            });
        }

        return variant;
    }

    /**
     * Get all registered themes
     */
    public getAllThemes(): ThemeVariant[] {
        return Array.from(this.themes.values());
    }

    /**
     * Get themes by family
     */
    public getThemesByFamily(family: string): ThemeVariant[] {
        return this.getAllThemes().filter(theme => theme.family === family);
    }

    /**
     * Check if theme exists
     */
    public hasTheme(themeId: string): boolean {
        return this.themes.has(themeId);
    }

    /**
     * Unregister a theme
     */
    public unregisterTheme(themeId: string): boolean {
        const deleted = this.themes.delete(themeId);
        if (deleted) {
            this.clearCache();
        }
        return deleted;
    }

    /**
     * Clear component cache
     */
    public clearCache(): void {
        this.componentCache.clear();
    }

    /**
     * Update registry configuration
     */
    public updateConfig(config: Partial<RegistryConfig>): void {
        this.config = { ...this.config, ...config };
    }

    // ============== Private Methods ==============

    /**
     * Build component map with inheritance and defaults
     */
    private buildComponentMap(options: ThemeRegistrationOptions): ComponentVariantMap {
        let baseComponents: Partial<ComponentVariantMap> = {};

        // 1. Start with family defaults
        if (options.family) {
            baseComponents = { ...FAMILY_DEFAULTS[options.family] };
        }

        // 2. Inherit from parent theme if specified
        if (options.extends) {
            const parentTheme = this.themes.get(options.extends);
            if (parentTheme) {
                baseComponents = { ...baseComponents, ...parentTheme.components };
            } else {
                console.warn(`Parent theme '${options.extends}' not found. Skipping inheritance.`);
            }
        }

        // 3. Apply custom component overrides
        if (options.components) {
            baseComponents = { ...baseComponents, ...options.components };
        }

        // 4. Validate all required components are specified
        const requiredComponents: ComponentType[] = ['Header', 'Profile', 'ProductCard', 'Navigation', 'OrderList', 'Cart'];
        const missingComponents = requiredComponents.filter(comp => !baseComponents[comp]);

        if (missingComponents.length > 0) {
            throw new Error(
                `Theme '${options.id}' is missing component mappings: ${missingComponents.join(', ')}`
            );
        }

        return baseComponents as ComponentVariantMap;
    }

    /**
     * Validate theme configuration
     */
    private validateTheme(theme: ThemeVariant): void {
        // Validate theme ID
        if (!theme.id || theme.id.trim() === '') {
            throw new Error('Theme ID cannot be empty');
        }

        // Validate theme name
        if (!theme.name || theme.name.trim() === '') {
            throw new Error('Theme name cannot be empty');
        }

        // Validate component mappings
        if (!theme.components) {
            throw new Error(`Theme '${theme.id}' must have component mappings`);
        }

        // Validate configuration
        if (!theme.config) {
            throw new Error(`Theme '${theme.id}' must have configuration`);
        }

        // Validate colors exist
        if (!theme.config.colors) {
            throw new Error(`Theme '${theme.id}' must have colors configuration`);
        }

        console.log(`✅ Theme '${theme.id}' validated successfully`);
    }

    /**
     * Check if cached component is still valid
     */
    private isCacheValid(cached: ResolvedComponent): boolean {
        const age = Date.now() - cached.cachedAt;
        return age < this.config.cacheTTL;
    }
}

// Export singleton instance
export const themeRegistry = ThemeRegistry.getInstance();

// Export class for testing
export { ThemeRegistry };
