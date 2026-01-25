/**
 * Standard Header Component (Modern/Zeraki Style)
 * 
 * Used by: Zeraki, Modern themes
 * Features: Logo on left, Search/Cart/Profile icons on right
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart, User } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Images } from '../../common/images';

interface StandardHeaderProps {
    onSearchPress?: () => void;
    onCartPress?: () => void;
    onProfilePress?: () => void;
}

export const StandardHeader: React.FC<StandardHeaderProps> = React.memo(({
    onSearchPress,
    onCartPress,
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

                    {/* Right: Action Icons */}
                    <View style={styles.rightSection}>
                        <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
                            <Search size={22} color={theme.colors.textPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
                            <ShoppingCart size={22} color={theme.colors.textPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
                            <User size={22} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
});

StandardHeader.displayName = 'StandardHeader';

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
    logo: {
        width: 120,
        height: 50,
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
});
