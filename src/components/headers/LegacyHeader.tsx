/**
 * Legacy Header Component (Midnight/Classic Style)
 * 
 * Used by: Midnight Shine, Legacy themes
 * Features: Logo on left, Wishlist/Profile icons on right, taller design
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, User } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Images } from '../../common/images';

interface LegacyHeaderProps {
    onWishlistPress?: () => void;
    onProfilePress?: () => void;
}

export const LegacyHeader: React.FC<LegacyHeaderProps> = React.memo(({
    onWishlistPress,
    onProfilePress,
}) => {
    const { theme } = useTheme();

    return (
        <>
            <StatusBar
                backgroundColor={theme.colors.surface}
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />
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
                    {/* Left: Logo */}
                    <View style={styles.leftSection}>
                        <Image
                            source={Images.logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Right: Wishlist + Profile Icons */}
                    <View style={styles.rightSection}>
                        <TouchableOpacity onPress={onWishlistPress} style={styles.iconButton}>
                            <Heart size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
                            <User size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
});

LegacyHeader.displayName = 'LegacyHeader';

const styles = StyleSheet.create({
    safeArea: {
        borderBottomWidth: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 80, // Taller than standard
        borderBottomWidth: 1,
    },
    leftSection: {
        alignItems: 'flex-start',
    },
    logo: {
        width: 60,
        height: 60,
    },
    rightSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 8,
    },
});
