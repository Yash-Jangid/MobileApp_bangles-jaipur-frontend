/**
 * Profile Skeleton Loader
 * 
 * Loading placeholder for profile while theme is being resolved
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { useTheme } from '../../theme/ThemeContext';

export const ProfileSkeleton: React.FC = React.memo(() => {
    const { theme } = useTheme();

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Header Skeleton */}
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.background }]}>
                <View style={styles.profileInfoContainer}>
                    {/* Avatar */}
                    <SkeletonLoader width={70} height={70} borderRadius={35} style={styles.avatar} />

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <SkeletonLoader width="60%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
                        <SkeletonLoader width="80%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                        <SkeletonLoader width="40%" height={14} borderRadius={4} />
                    </View>
                </View>
            </View>

            {/* Menu Items Skeleton */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                <SkeletonLoader width="30%" height={12} borderRadius={4} style={styles.sectionHeader} />

                {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.menuItem}>
                        <SkeletonLoader width={36} height={36} borderRadius={18} style={styles.iconSkeleton} />
                        <View style={styles.menuTextContainer}>
                            <SkeletonLoader width="40%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                            <SkeletonLoader width="60%" height={12} borderRadius={4} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Settings Section Skeleton */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                <SkeletonLoader width="30%" height={12} borderRadius={4} style={styles.sectionHeader} />

                {[1, 2].map((i) => (
                    <View key={i} style={styles.menuItem}>
                        <SkeletonLoader width={36} height={36} borderRadius={18} style={styles.iconSkeleton} />
                        <View style={styles.menuTextContainer}>
                            <SkeletonLoader width="40%" height={16} borderRadius={4} />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
});

ProfileSkeleton.displayName = 'ProfileSkeleton';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: 12,
        paddingVertical: 8,
    },
    sectionHeader: {
        marginBottom: 8,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    iconSkeleton: {
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
});
