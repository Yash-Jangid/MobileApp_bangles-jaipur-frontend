/**
 * Legacy Profile Component (Midnight/Classic Style)
 * 
 * Used by: Midnight Shine, Legacy themes
 * Features: Inline order list, simplified menu, dark mode toggle
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
    Heart,
    MapPin,
    LifeBuoy,
    Settings,
    LogOut,
    Moon,
} from 'lucide-react-native';

interface LegacyProfileProps {
    user: any;
    orders: any[];
    refreshing: boolean;
    onRefresh: () => void;
    onNavigate: (screen: string, params?: any) => void;
    onLogout: () => void;
    themeMode: string;
    onThemeModeChange: (mode: 'light' | 'dark') => void;
}

const MenuLink = ({ title, icon: IconComponent, onPress, theme, isDark }: any) => (
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
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
);

export const LegacyProfile: React.FC<LegacyProfileProps> = React.memo(({
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

    const renderLegacyOrder = (order: any) => (
        <TouchableOpacity
            key={order.id}
            style={[styles.legacyOrderItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => onNavigate('OrderDetails', { orderId: order.id })}
        >
            <View>
                <Text style={[styles.legacyOrderTitle, { color: theme.colors.textPrimary }]}>
                    Order #{order.orderNumber || order.id?.slice(-6)}
                </Text>
                <Text style={[styles.legacyOrderDate, { color: theme.colors.textSecondary }]}>
                    {new Date(order.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Text style={[styles.legacyOrderStatus, { color: theme.colors.primary }]}>{order.status}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
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

            {/* Content Container */}
            <View style={{ padding: 16 }}>
                {/* Orders Section */}
                <View style={{ marginBottom: 24 }}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>My Orders</Text>
                        <TouchableOpacity onPress={() => onNavigate('OrderHistory')}>
                            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recent Orders List */}
                    {orders && orders.length > 0 ? (
                        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            {orders.slice(0, 3).map(renderLegacyOrder)}
                        </View>
                    ) : (
                        <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
                            <Text style={{ color: theme.colors.textSecondary }}>No recent orders</Text>
                        </View>
                    )}
                </View>

                {/* Menu Items */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <MenuLink title="Wishlist" icon={Heart} onPress={() => { }} theme={theme} isDark={isDark} />
                    <MenuLink title="Addresses" icon={MapPin} onPress={() => { }} theme={theme} isDark={isDark} />
                    <MenuLink title="Help Center" icon={LifeBuoy} onPress={() => { }} theme={theme} isDark={isDark} />
                    <MenuLink title="Settings" icon={Settings} onPress={() => { }} theme={theme} isDark={isDark} />
                </View>

                {/* Dark Mode Toggle */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 24 }]}>
                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 0 }]}
                        onPress={() => onThemeModeChange(themeMode === 'light' ? 'dark' : 'light')}
                    >
                        <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
                            <Moon size={20} color={theme.colors.textPrimary} />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>Dark Mode</Text>
                        </View>
                        <View style={[
                            styles.toggle,
                            { backgroundColor: isDark ? theme.colors.primary : '#ccc', alignItems: isDark ? 'flex-end' : 'flex-start' }
                        ]}>
                            <View style={styles.toggleKnob} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <View style={{ marginVertical: 20 }}>
                    <TouchableOpacity
                        style={[styles.logoutRow, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
                        onPress={onLogout}
                    >
                        <LogOut size={20} color={theme.colors.error} />
                        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                    </TouchableOpacity>
                    <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    );
});

LegacyProfile.displayName = 'LegacyProfile';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        paddingVertical: 24,
        paddingHorizontal: 20,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    viewAllText: {
        fontSize: 14,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    emptyCard: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    legacyOrderItem: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    legacyOrderTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    legacyOrderDate: {
        fontSize: 12,
    },
    legacyOrderStatus: {
        fontSize: 14,
        fontWeight: '600',
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
    },
    toggle: {
        width: 40,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleKnob: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
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
    },
});
