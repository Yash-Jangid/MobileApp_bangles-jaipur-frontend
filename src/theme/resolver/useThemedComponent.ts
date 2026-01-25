/**
 * useThemedComponent Hook
 * 
 * Dynamically resolves and returns the correct component variant
 * based on the active theme.
 * 
 * Features:
 * - Memoization for performance
 * - Automatic skeleton loading
 * - Type-safe component resolution
 */

import { useMemo } from 'react';
import { ComponentType as ReactComponentType } from 'react';
import { useTheme } from '../ThemeContext';
import { themeRegistry } from '../registry/ThemeRegistry';
import { ComponentType } from '../registry/types';
import { getComponentImplementation, getSkeletonComponent } from './ComponentResolver';

interface UseThemedComponentOptions {
    /** Show skeleton while loading */
    showSkeleton?: boolean;
    /** Fallback component if variant not found */
    fallback?: ReactComponentType<any>;
}

/**
 * Hook to get themed component variant
 * 
 * @param componentType - Type of component to resolve
 * @param options - Configuration options
 * @returns Resolved component implementation
 * 
 * @example
 * ```tsx
 * const HeaderComponent = useThemedComponent('Header');
 * return <HeaderComponent onSearchPress={...} />;
 * ```
 */
export function useThemedComponent<T extends ComponentType>(
    componentType: T,
    options: UseThemedComponentOptions = {}
): ReactComponentType<any> {
    const { themeId, isLoading } = useTheme();
    const { showSkeleton = true, fallback } = options;

    const component = useMemo(() => {
        // Show skeleton while theme is loading
        if (isLoading && showSkeleton) {
            const skeleton = getSkeletonComponent(componentType);
            if (skeleton) return skeleton;
        }

        // Get variant from registry
        const variant = themeRegistry.getComponentVariant(themeId, componentType);

        // Resolve component implementation
        const implementation = getComponentImplementation(componentType, variant);

        // Fallback handling
        if (!implementation) {
            if (fallback) {
                console.warn(`Using fallback component for ${componentType}`);
                return fallback;
            }

            // Use skeleton as last resort
            const skeleton = getSkeletonComponent(componentType);
            if (skeleton) {
                console.warn(`Using skeleton as fallback for ${componentType}`);
                return skeleton;
            }

            throw new Error(
                `No component found for ${componentType} variant '${variant}' and no fallback provided`
            );
        }

        return implementation;
    }, [themeId, componentType, isLoading, showSkeleton, fallback]);

    return component;
}
