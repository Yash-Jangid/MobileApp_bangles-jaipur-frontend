/**
 * WhiteShineHeader Component
 * 
 * Custom header specifically for the White Shine Jewelry theme.
 * Layout: Logo (left) | Search + Cart (right)
 */

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Images } from '../../common/images';

export interface WhiteShineHeaderProps {
    onSearchPress?: () => void;
    onCartPress?: () => void;
    // Other props not used but kept for compatibility
    onProfilePress?: () => void;
    onMenuPress?: () => void;
    onWishlistPress?: () => void;
}

/**
 * WhiteShineHeader - Minimalist header for White Shine Jewelry
 * Shows only logo, search, and cart
 */
export const WhiteShineHeader: React.FC<WhiteShineHeaderProps> = React.memo(({
    onSearchPress,
    onCartPress,
}) => {
    const { theme } = useTheme();

    return (
        <>
            <StatusBar
                backgroundColor={theme.colors.surface}
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />
            <SafeAreaView
                style={[styles.safeArea, {
                    backgroundColor: theme.colors.surface
                }]}
                edges={['top']}
            >
                <View style={[
                    styles.container,
                    {
                        backgroundColor: theme.colors.surface,
                        borderBottomColor: theme.colors.border,
                    }
                ]}>
                    {/* Left Section: Logo */}
                    <View style={styles.leftSection}>
                        <Image
                            source={Images.logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Center Section: Empty for clean look */}
                    <View style={styles.centerSection} />

                    {/* Right Section: Search + Cart */}
                    <View style={styles.rightSection}>
                        <TouchableOpacity
                            onPress={onSearchPress}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <Search size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onCartPress}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <ShoppingCart size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
});

WhiteShineHeader.displayName = 'WhiteShineHeader';

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
    centerSection: {
        flex: 1,
    },
    logo: {
        width: 120,
        height: 50,
    },
    rightSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20,  // Good spacing between search and cart
    },
    iconButton: {
        padding: 4,
    },
});
