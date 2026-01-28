import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart, User, Heart } from 'lucide-react-native';
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
    onSearchPress,
    onCartPress,
    onProfilePress,
}) => {
    const { theme } = useTheme();
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
                        height: isZeraki ? (Platform.OS === 'android' ? 80 : 60) : 80,
                    }
                ]}>

                    <View style={styles.leftSection}>
                        <Image
                            source={Images.logo}
                            style={[
                                styles.logo,
                                !isZeraki && { width: 60, height: 60 }
                            ]}
                            resizeMode="contain"
                            width={100}
                            height={80}
                        />
                    </View>
                    <View style={styles.centerSection} />

                    <View style={styles.rightSection}>
                        {isZeraki ? (
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

                    {/* Bottom Shadow for Android */}
                    {Platform.OS === 'android' && (
                        <LinearGradient
                            colors={['rgba(0,0,0,0.08)', 'transparent']}
                            style={styles.bottomShadow}
                        />
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        zIndex: 100,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            // elevation removed for Android custom shadow
        }),
        zIndex: 100,
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
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
    iconButton: {
        padding: 4,
    },
    bottomShadow: {
        position: 'absolute',
        bottom: -4,
        left: 0,
        right: 0,
        height: 4,
        zIndex: -1,
    }
});
