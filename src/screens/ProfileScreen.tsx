import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/ordersSlice';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const { orders, loading: ordersLoading } = useAppSelector((state) => state.orders);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            await dispatch(fetchOrders()).unwrap();
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(logoutUser());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ]
        );
    };

    // Calculate stats from real data
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const menuItems = [
        {
            id: 1,
            title: 'My Orders',
            icon: '📦',
            route: 'Orders',
            badge: totalOrders > 0 ? totalOrders.toString() : undefined,
        },
        {
            id: 2,
            title: 'Wishlist',
            icon: '❤️',
            route: 'Wishlist',
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

    const recentOrders = orders.slice(0, 2);

    return (
        <View style={styles.container}>
            <CustomHeader title="My Profile" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Profile Header Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>₹{(totalSpent / 1000).toFixed(1)}K</Text>
                        <Text style={styles.statLabel}>Total Spent</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                </View>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
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
                                <View style={styles.orderIconContainer}>
                                    <Text style={styles.orderIcon}>📦</Text>
                                </View>
                                <View style={styles.orderDetails}>
                                    <Text style={styles.orderName} numberOfLines={1}>
                                        Order #{order.id}
                                    </Text>
                                    <Text style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </Text>
                                    <View style={styles.orderFooter}>
                                        <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                                        <View style={[
                                            styles.orderStatusBadge,
                                            order.status === 'delivered' && styles.statusDelivered,
                                            order.status === 'pending' && styles.statusPending,
                                        ]}>
                                            <Text style={[
                                                styles.orderStatus,
                                                order.status === 'delivered' && styles.statusDeliveredText,
                                                order.status === 'pending' && styles.statusPendingText,
                                            ]}>
                                                {order.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Menu Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIconContainer}>
                                    <Text style={styles.menuIcon}>{item.icon}</Text>
                                </View>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.badge && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{item.badge}</Text>
                                    </View>
                                )}
                                <Text style={styles.menuChevron}>›</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        paddingTop: 32,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 36,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#1a1a1a',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statCard: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#D4AF37',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: Fonts.medium,
        color: '#666',
    },
    section: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: '#D4AF37',
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F5F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    orderIcon: {
        fontSize: 28,
    },
    orderDetails: {
        flex: 1,
    },
    orderName: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#666',
        marginBottom: 8,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderAmount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#1a1a1a',
    },
    orderStatusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
    },
    statusDelivered: {
        backgroundColor: '#E8F5E9',
    },
    statusPending: {
        backgroundColor: '#FFF3E0',
    },
    orderStatus: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
        color: '#666',
        textTransform: 'capitalize',
    },
    statusDeliveredText: {
        color: '#2E7D32',
    },
    statusPendingText: {
        color: '#F57C00',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuIcon: {
        fontSize: 20,
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: '#1a1a1a',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#D4AF37',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        minWidth: 24,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: '#FFF',
    },
    menuChevron: {
        fontSize: 24,
        color: '#CCC',
    },
    logoutButton: {
        marginHorizontal: 16,
        marginTop: 32,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: '#FF3B30',
    },
});
