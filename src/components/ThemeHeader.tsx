import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Images } from '../common/images';

interface ThemeHeaderProps {
    title?: string;
    onSearchPress?: () => void;
    onCartPress?: () => void;
    onProfilePress?: () => void;
    onMenuPress?: () => void;
}

export const ThemeHeader: React.FC<ThemeHeaderProps> = ({
    title,
    onSearchPress,
    onCartPress,
    onProfilePress,
    onMenuPress
}) => {
    const { theme } = useTheme();
    // zeraki = logo left, icons right (modern)
    // legacy (midnight) = logo left, wishlist/profile right (classic)
    // Actually, both seem to be "Logo Left". The main difference is the ICONS and HEIGHT.

    // We can say: isZeraki = use the Modern/Zeraki layout.
    // !isZeraki (Midnight) = use the AppHeader (Legacy) layout.
    const isZeraki = theme.layout.headerStyle === 'logo-left-icons-right';

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
                        borderBottomWidth: 1,
                        // Legacy AppHeader height was 80, Zeraki is 60/50.
                        height: isZeraki ? (Platform.OS === 'android' ? 60 : 50) : 80,
                    }
                ]}>

                    {/* Left Section: Logo for BOTH now (Legacy had Logo too) */}
                    <View style={styles.leftSection}>
                        <Image
                            source={Images.logo}
                            style={[
                                styles.logo,
                                // Legacy logo was 60x60, Zeraki 60x60 (or 120x50 in style). 
                                // Let's use standard logo style but adjust for legacy height if needed.
                                !isZeraki && { width: 60, height: 60 }
                            ]}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Center Section: Empty for both (Zeraki has nothing, Legacy has nothing) 
                        Note: Previous code had a Title for !isZeraki. We are REMOVING that to match AppHeader.
                    */}
                    <View style={styles.centerSection} />

                    {/* Right Section */}
                    <View style={styles.rightSection}>
                        {isZeraki ? (
                            // Modern / Zeraki Icons
                            <>
                                <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
                                    <Search size={22} color={theme.colors.textPrimary} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
                                    <ShoppingCart size={22} color={theme.colors.textPrimary} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
                                    <User size={22} color={theme.colors.textPrimary} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            // Legacy / Midnight Icons (Heart + User)
                            <>
                                {/* Wishlist (Heart) - Assuming we need a handler or placeholder */}
                                <TouchableOpacity onPress={() => { /* TODO: Wishlist Nav */ }} style={styles.iconButton}>
                                    <Heart size={24} color={theme.colors.textPrimary} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
                                    <User size={24} color={theme.colors.textPrimary} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

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
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    leftSectionZeraki: {
        flex: 2,
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
    logo: {
        width: 120,
        height: 50,
    },

    centerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    iconButton: {
        padding: 4,
    }
});
