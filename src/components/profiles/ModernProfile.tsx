/**
 * Modern Profile Component (Zeraki Style)
 * 
 * Used by: Zeraki, Modern themes
 * Features: Section headers, grouped menu links, appearance settings
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Fonts } from '../../common/fonts';
import {
    ChevronRight,
    Package,
    Heart,
    MapPin,
    LifeBuoy,
    Settings,
    LogOut,
    Sun,
    Moon,
    Monitor,
} from 'lucide-react-native';

interface ModernProfileProps {
    user: any;
    orders: any[];
    refreshing: boolean;
    onRefresh: () => void;
    onNavigate: (screen: string, params?: any) => void;
    onLogout: () => void;
    themeMode: string;
    onThemeModeChange: (mode: 'light' | 'dark' | 'auto') => void;
}

const MenuLink = ({ title, icon: IconComponent, onPress, subtitle, theme, isDark }: any) => (
    <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
            <IconComponent size={20} color={theme.colors.textPrimary} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
            {subtitle && <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
);

export const ModernProfile: React.FC<ModernProfileProps> = React.memo(({
    user,
    orders,
    refreshing,
    onRefresh,
    onNavigate,
    onLogout,
    themeMode,
    onThemeModeChange,
}) => {
    const { theme } = useTheme();
    const isDark = theme.isDark;
    const totalOrders = orders?.length || 0;

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.colors.surfaceHighlight }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            }
        >
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.background }]}>
                <View style={styles.profileInfoContainer}>
                    <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{user?.name || 'User'}</Text>
                        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user?.email || ''}</Text>
                        <TouchableOpacity style={styles.editProfileBtn}>
                            <Text style={[styles.editProfileText, { color: theme.colors.primary }]}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Account Settings Section */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textSecondary }]}>MY ACCOUNT</Text>

                <MenuLink
                    title="Orders"
                    subtitle={`Check your order status (${totalOrders})`}
                    icon={Package}
                    onPress={() => onNavigate('OrderHistory')}
                    theme={theme}
                    isDark={isDark}
                />
                <MenuLink
                    title="Wishlist"
                    subtitle="Your favorite items"
                    icon={Heart}
                    onPress={() => { }}
                    theme={theme}
                    isDark={isDark}
                />
                <MenuLink
                    title="Addresses"
                    subtitle="Manage delivery addresses"
                    icon={MapPin}
                    onPress={() => { }}
                    theme={theme}
                    isDark={isDark}
                />
                <MenuLink
                    title="Help Center"
                    subtitle="Help regarding your recent purchases"
                    icon={LifeBuoy}
                    onPress={() => { }}
                    theme={theme}
                    isDark={isDark}
                />
            </View>

            {/* App Settings Section */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textSecondary }]}>SETTINGS</Text>

                {/* Theme Selector */}
                <TouchableOpacity
                    style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                    onPress={() => {
                        const nextMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
                        onThemeModeChange(nextMode as any);
                    }}
                >
                    <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
                        {themeMode === 'light' ? <Sun size={20} color={theme.colors.textPrimary} /> :
                            themeMode === 'dark' ? <Moon size={20} color={theme.colors.textPrimary} /> :
                                <Monitor size={20} color={theme.colors.textPrimary} />}
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>Appearance</Text>
                        <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                            {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
                        </Text>
                    </View>
                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <MenuLink
                    title="App Settings"
                    icon={Settings}
                    onPress={() => { }}
                    theme={theme}
                    isDark={isDark}
                />
            </View>

            {/* Logout Button */}
            <View style={[styles.sectionContainer, { backgroundColor: 'transparent', marginVertical: 20, paddingHorizontal: 16 }]}>
                <TouchableOpacity
                    style={[styles.logoutRow, { backgroundColor: theme.colors.background, borderRadius: 8 }]}
                    onPress={onLogout}
                >
                    <LogOut size={20} color={theme.colors.error} />
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                </TouchableOpacity>
                <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
});

ModernProfile.displayName = 'ModernProfile';

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
    avatarCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    avatarText: {
        fontSize: 28,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        marginBottom: 8,
    },
    editProfileBtn: {
        alignSelf: 'flex-start',
    },
    editProfileText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    sectionContainer: {
        marginBottom: 12,
        paddingVertical: 8,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        letterSpacing: 1,
        marginBottom: 8,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: Fonts.regular,
        marginTop: 8,
        marginBottom: 16,
    },
});
