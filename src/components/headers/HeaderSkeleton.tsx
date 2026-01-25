/**
 * Header Skeleton Loader
 * 
 * Loading placeholder for header while theme is being resolved
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { useTheme } from '../../theme/ThemeContext';

export const HeaderSkeleton: React.FC = React.memo(() => {
    const { theme } = useTheme();

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}
            edges={['top']}
        >
            <View style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderBottomColor: theme.colors.border,
                }
            ]}>
                {/* Logo Skeleton */}
                <View style={styles.leftSection}>
                    <SkeletonLoader width={100} height={40} borderRadius={8} />
                </View>

                {/* Icons Skeleton */}
                <View style={styles.rightSection}>
                    <SkeletonLoader width={24} height={24} borderRadius={12} />
                    <SkeletonLoader width={24} height={24} borderRadius={12} />
                    <SkeletonLoader width={24} height={24} borderRadius={12} />
                </View>
            </View>
        </SafeAreaView>
    );
});

HeaderSkeleton.displayName = 'HeaderSkeleton';

const styles = StyleSheet.create({
    safeArea: {
        borderBottomWidth: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: Platform.OS === 'android' ? 60 : 50,
        borderBottomWidth: 1,
    },
    leftSection: {
        flex: 2,
        alignItems: 'flex-start',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
});
