import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/slices/ordersSlice';
import { Order } from '../api/ordersApi';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, limit: 20 }));
    }, [dispatch]);

    const navigateToDetails = (orderId: string) => {
        navigation.navigate('OrderDetails', { orderId });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return colors.semantic.success;
            case 'SHIPPED': return colors.semantic.info;
            case 'CANCELLED': return colors.semantic.error;
            case 'PENDING': return colors.semantic.warning;
            default: return colors.text.secondary;
        }
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigateToDetails(item.id)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>

            <Text style={styles.orderDate}>
                Placed on {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            <View style={styles.divider} />

            <View style={styles.orderFooter}>
                <Text style={styles.itemCount}>
                    {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
                Start shopping to see your orders here
            </Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading.list && orders.length === 0) {
        return (
            <View style={styles.container}>
                <CustomHeader title="My Orders" showBackButton onBackPress={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.main} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title="My Orders" showBackButton onBackPress={() => navigation.goBack()} />

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyList}
                refreshing={loading.list}
                onRefresh={() => dispatch(fetchOrders({ page: 1, limit: 20 }))}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    orderCard: {
        backgroundColor: colors.neutral.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: colors.text.primary,
    },
    orderStatus: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    orderDate: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.light,
        marginVertical: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
    },
    totalAmount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: colors.primary.main,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 100,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: Fonts.semiBold,
        color: colors.text.primary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    shopButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: colors.primary.main,
    },
    shopButtonText: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: colors.neutral.white,
    },
});
