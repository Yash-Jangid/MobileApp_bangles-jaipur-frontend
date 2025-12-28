import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // User data (would come from Redux/API in production)
    const user = {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=D4AF37&color=fff&size=200',
        memberSince: 'Jan 2024',
        totalOrders: 12,
        totalSpent: 145890,
    };

    const menuItems = [
        {
            id: 1,
            title: 'My Orders',
            icon: '📦',
            route: 'Orders',
            badge: '3',
        },
        {
            id: 2,
            title: 'Wishlist',
            icon: '❤️',
            route: 'Wishlist',
            badge: '8',
        },
        {
            id: 3,
            title: 'Addresses',
            icon: '📍',
            route: 'Addresses',
        },
        {
            id: 4,
            title: 'Payment Methods',
            icon: '💳',
            route: 'PaymentMethods',
        },
        {
            id: 5,
            title: 'Help & Support',
            icon: '💬',
            route: 'Support',
        },
        {
            id: 6,
            title: 'About Us',
            icon: 'ℹ️',
            route: 'About',
        },
    ];

    const recentOrders = [
        {
            id: 1,
            name: 'Royal Kundan Gold Bangles',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop',
            status: 'Delivered',
            date: 'Dec 15, 2024',
            amount: 15999,
        },
        {
            id: 2,
            name: 'Diamond Studded Pearl Bangles',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
            status: 'In Transit',
            date: 'Dec 18, 2024',
            amount: 28999,
        },
    ];

    return (
        <View style={styles.container}>
            <CustomHeader title="My Profile" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Header Card */}
                <LinearGradient
                    colors={[colors.primary.main, colors.secondary.main]}
                    style={styles.profileHeader}
                >
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Text style={styles.editAvatarText}>✏️</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
                </LinearGradient>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{user.totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>₹{(user.totalSpent / 1000).toFixed(0)}K</Text>
                        <Text style={styles.statLabel}>Total Spent</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>8</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Orders</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                            <Text style={styles.seeAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentOrders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                        >
                            <Image source={{ uri: order.image }} style={styles.orderImage} />
                            <View style={styles.orderDetails}>
                                <Text style={styles.orderName} numberOfLines={1}>{order.name}</Text>
                                <Text style={styles.orderDate}>{order.date}</Text>
                                <View style={styles.orderFooter}>
                                    <Text style={styles.orderAmount}>₹{order.amount}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        order.status === 'Delivered' ? styles.statusDelivered : styles.statusTransit
                                    ]}>
                                        <Text style={styles.statusText}>{order.status}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Menu Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => item.route && navigation.navigate(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.badge && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{item.badge}</Text>
                                    </View>
                                )}
                                <Text style={styles.menuArrow}>›</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Settings Toggles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.toggleItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🔔</Text>
                            <Text style={styles.menuTitle}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: colors.neutral.gray300, true: colors.primary.light }}
                            thumbColor={notifications ? colors.primary.main : colors.neutral.gray400}
                        />
                    </View>

                    <View style={styles.toggleItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🌙</Text>
                            <Text style={styles.menuTitle}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: colors.neutral.gray300, true: colors.primary.light }}
                            thumbColor={darkMode ? colors.primary.main : colors.neutral.gray400}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        padding: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: colors.neutral.white,
    },
    editAvatarButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: colors.neutral.white,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    editAvatarText: {
        fontSize: 14,
    },
    userName: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: colors.neutral.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.neutral.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.neutral.white,
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.neutral.white,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: colors.primary.main,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
    },
    section: {
        padding: 16,
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: colors.text.primary,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: colors.primary.main,
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: colors.neutral.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    orderDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    orderName: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        color: colors.text.primary,
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderAmount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: colors.primary.main,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDelivered: {
        backgroundColor: colors.semantic.success,
    },
    statusTransit: {
        backgroundColor: colors.semantic.warning,
    },
    statusText: {
        fontSize: 11,
        fontFamily: Fonts.medium,
        color: colors.neutral.white,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.neutral.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    menuTitle: {
        fontSize: 15,
        fontFamily: Fonts.medium,
        color: colors.text.primary,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: colors.accent.main,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Fonts.bold,
        color: colors.neutral.white,
    },
    menuArrow: {
        fontSize: 24,
        color: colors.text.tertiary,
    },
    toggleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.neutral.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    logoutButton: {
        backgroundColor: colors.neutral.white,
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.semantic.error,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: colors.semantic.error,
    },
    bottomSpacing: {
        height: 40,
    },
});
