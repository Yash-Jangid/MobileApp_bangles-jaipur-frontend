/**
 * Reusable Skeleton Loader Component
 * 
 * Displays placeholder "shimmer" effect while content is loading.
 * Used across all component variants for consistent loading states.
 */

import React from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = React.memo(({
    width = '100%',
    height = 20,
    borderRadius = 4,
    style,
}) => {
    const { theme } = useTheme();
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmer.start();
        return () => shimmer.stop();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height: height as any,
                    borderRadius,
                    backgroundColor: theme.isDark ? '#333' : '#E0E0E0',
                    opacity,
                },
                style,
            ]}
        />
    );
});

SkeletonLoader.displayName = 'SkeletonLoader';

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});
