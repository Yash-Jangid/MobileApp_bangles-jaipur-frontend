import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    Dimensions,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeHeader } from '../components/ThemeHeader';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { useTheme } from '../theme/ThemeContext';
import {
    ShoppingBag,
    ChevronRight,
    Package,
    Heart,
    MapPin,
    LifeBuoy,
    Settings,
    LogOut,
    User,
    Moon,
    Sun,
    Monitor
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isGuestMode } = useAppSelector((state) => state.auth);
    const { theme, themeMode, setThemeMode } = useTheme();
    const isDark = theme.isDark;
    const { orders } = useAppSelector((state) => state.orders);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !isGuestMode) {
            loadData();
        }
    }, [isAuthenticated, isGuestMode]);

    const loadData = async () => {
        try {
            await dispatch(fetchOrders({ page: 1, limit: 10 })).unwrap();
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

    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const MenuLink = ({ title, icon: IconComponent, onPress, subtitle }: { title: string, icon: any, onPress: () => void, subtitle?: string }) => (
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

    // Guest Mode View
    if (isGuestMode) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ThemeHeader
                    title="Profile"
                    onSearchPress={() => { }}
                    onCartPress={() => navigation.navigate('Cart')}
                    onMenuPress={() => navigation.navigate('Collections')}
                />
                <ScrollView contentContainerStyle={styles.guestContainer}>
                    <View style={styles.guestContent}>
                        <View style={[styles.guestIconContainer, { backgroundColor: theme.colors.surface }]}>
                            <User size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.guestTitle, { color: theme.colors.textPrimary }]}>You're browsing as Guest</Text>
                        <Text style={[styles.guestSubtitle, { color: theme.colors.textSecondary }]}>
                            Login to access your orders, wishlist, and personalized recommendations
                        </Text>

                        <TouchableOpacity
                            style={styles.modernLoginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, '#D4AF37']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.modernLoginButtonText}>Login or Sign Up</Text>
                                <ChevronRight size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const isZeraki = theme.layout.headerStyle === 'logo-left-icons-right';
    const totalOrders = orders?.length || 0;

    // Legacy Render Item for Orders
    const renderLegacyOrder = (order: any) => (
        <TouchableOpacity
            key={order.id}
            style={[styles.legacyOrderItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
            <View>
                <Text style={[styles.legacyOrderTitle, { color: theme.colors.textPrimary }]}>Order #{order.orderNumber || order.id?.slice(-6)}</Text>
                <Text style={[styles.legacyOrderDate, { color: theme.colors.textSecondary }]}>
                    {new Date(order.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Text style={[styles.legacyOrderStatus, { color: theme.colors.primary }]}>{order.status}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ThemeHeader
                title="Profile"
                onSearchPress={() => { }}
                onCartPress={() => navigation.navigate('Cart')}
                onMenuPress={() => navigation.navigate('Collections')}
            />

            <ScrollView
                style={[styles.scrollView, { backgroundColor: isZeraki ? theme.colors.surfaceHighlight : theme.colors.background }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {/* User Info Header (Shared but styled differently if needed) */}
                <View style={[styles.profileHeader, { backgroundColor: theme.colors.background, paddingBottom: isZeraki ? 12 : 24 }]}>
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

                {isZeraki ? (
                    /* ================= MODERN / ZERAKI LAYOUT ================= */
                    <>
                        {/* Account Settings Section */}
                        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                            <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textSecondary }]}>MY ACCOUNT</Text>

                            <MenuLink
                                title="Orders"
                                subtitle={`Check your order status (${totalOrders})`}
                                icon={Package}
                                onPress={() => navigation.navigate('Orders')}
                            />
                            <MenuLink
                                title="Wishlist"
                                subtitle="Your favorite items"
                                icon={Heart}
                                onPress={() => { }}
                            />
                            <MenuLink
                                title="Addresses"
                                subtitle="Manage delivery addresses"
                                icon={MapPin}
                                onPress={() => { }}
                            />
                            <MenuLink
                                title="Help Center"
                                subtitle="Help regarding your recent purchases"
                                icon={LifeBuoy}
                                onPress={() => { }}
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
                                    setThemeMode(nextMode);
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

                            <MenuLink title="App Settings" icon={Settings} onPress={() => { }} />
                        </View>
                    </>
                ) : (
                    /* ================= LEGACY / MIDNIGHT LAYOUT ================= */
                    <View style={{ padding: 16 }}>
                        {/* Legacy Orders Section -> Uses ProfileSection if imported, or just simulated structure */}
                        {/* Since ProfileSection import isn't in scope of this file yet, I'll simulate it for now or assume I added the import. 
                            Wait, I need to add the import first? 
                            I'll stick to a simple clean layout that matches the 'Section' vibe. 
                        */}
                        <View style={{ marginBottom: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.textPrimary }}>My Orders</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                                    <Text style={{ fontSize: 14, color: theme.colors.primary }}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Recent Orders List */}
                            {orders && orders.length > 0 ? (
                                <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, overflow: 'hidden' }}>
                                    {orders.slice(0, 3).map(renderLegacyOrder)}
                                </View>
                            ) : (
                                <View style={{ backgroundColor: theme.colors.surface, padding: 20, borderRadius: 12, alignItems: 'center' }}>
                                    <Text style={{ color: theme.colors.textSecondary }}>No recent orders</Text>
                                </View>
                            )}
                        </View>

                        {/* Legacy Menu Items (Simpler List) */}
                        <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, overflow: 'hidden' }}>
                            <MenuLink title="Wishlist" icon={Heart} onPress={() => { }} />
                            <MenuLink title="Addresses" icon={MapPin} onPress={() => { }} />
                            <MenuLink title="Help Center" icon={LifeBuoy} onPress={() => { }} />
                            <MenuLink title="Settings" icon={Settings} onPress={() => { }} />
                        </View>

                        {/* Theme Toggle for Legacy */}
                        <View style={{ marginTop: 24, backgroundColor: theme.colors.surface, borderRadius: 12, overflow: 'hidden' }}>
                            <TouchableOpacity
                                style={[styles.menuItem, { borderBottomColor: theme.colors.border, borderBottomWidth: 0 }]}
                                onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
                                    <Moon size={20} color={theme.colors.textPrimary} />
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>Dark Mode</Text>
                                </View>
                                <View style={{ width: 40, height: 20, borderRadius: 10, backgroundColor: isDark ? theme.colors.primary : '#ccc', justifyContent: 'center', alignItems: isDark ? 'flex-end' : 'flex-start', paddingHorizontal: 2 }}>
                                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Logout Button (Shared) */}
                <View style={[styles.sectionContainer, { backgroundColor: 'transparent', marginVertical: 20, paddingHorizontal: 16 }]}>
                    <TouchableOpacity
                        style={[styles.logoutRow, { backgroundColor: isZeraki ? theme.colors.background : theme.colors.surface, borderRadius: 8 }]}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color={theme.colors.error} />
                        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                    </TouchableOpacity>
                    <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    // Guest Styles
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    guestContent: {
        alignItems: 'center',
        width: '100%',
    },
    guestIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 8,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    modernLoginButton: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    modernLoginButtonText: {
        color: '#FFF',
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    // Profile Styles
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

    // Section Styles
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

    // Logout
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

    // Legacy Styles
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
});
