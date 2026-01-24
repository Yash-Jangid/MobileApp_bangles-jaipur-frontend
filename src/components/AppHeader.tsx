import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Images } from '../common/images';
import { Heart, User } from 'lucide-react-native';
import { theme } from '../theme';

interface AppHeaderProps {
    showWishlist?: boolean;
    showProfile?: boolean;
    onWishlistPress?: () => void;
    onProfilePress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    showWishlist = true,
    showProfile = true,
    onWishlistPress,
    onProfilePress,
}) => {
    const { theme, isDark } = useTheme();

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.surface}
            />
            <SafeAreaView
                style={[styles.container, {
                    backgroundColor: theme.colors.surface,
                    borderBottomColor: theme.colors.border,
                }]}
                edges={['top']}
            >
                <View style={styles.header}>
                    <View style={styles.leftSection}>
                        <Image
                            source={Images.logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Right Icons */}
                    <View style={styles.rightSection}>
                        {showWishlist && (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={onWishlistPress}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Heart size={24} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        )}
                        {showProfile && (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={onProfilePress}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <User size={24} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        paddingHorizontal: 16,
    },
    leftSection: {
        // flex: 1,
        display: 'flex',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
});
