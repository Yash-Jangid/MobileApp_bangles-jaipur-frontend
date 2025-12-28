import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrderDetails, clearCurrentOrder } from '../store/slices/ordersSlice';

export const OrderDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
    const { currentOrder, loading, error } = useAppSelector((state) => state.orders);
    const { orderId } = route.params;

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        }
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch, orderId]);

    if (loading.details) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary.main} />
            </View>
        );
    }

    if (error.details || !currentOrder) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {typeof error.details === 'string' ? error.details : 'Order not found'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={`Order #${currentOrder.orderNumber}`} showBackButton onBackPress={() => navigation.goBack()} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Status Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Status</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Current Status</Text>
                        <Text style={[styles.statusValue, { color: colors.primary.main }]}>
                            {currentOrder.status}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>
                        Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {currentOrder.items.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.productImage || 'https://via.placeholder.com/80' }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.productName}</Text>
                                <Text style={styles.itemMeta}>Size: {item.size} • Qty: {item.quantity}</Text>
                                <Text style={styles.itemPrice}>₹{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    <Text style={styles.addressText}>{currentOrder.shippingAddress.street}</Text>
                    <Text style={styles.addressText}>
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.zipCode}
                    </Text>
                    <Text style={styles.addressText}>Phone: {currentOrder.shippingAddress.phone}</Text>
                </View>

                {/* Price Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount</Text>
                        <Text style={styles.value}>₹{currentOrder.totalAmount}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Method</Text>
                        <Text style={styles.value}>{currentOrder.paymentMethod}</Text>
                    </View>
                </View>
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.semantic.error,
        fontSize: 16,
    },
    content: {
        padding: 16,
    },
    section: {
        backgroundColor: colors.neutral.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: colors.text.primary,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
    },
    statusValue: {
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    dateText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.text.tertiary,
    },
    itemCard: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        paddingBottom: 12,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: colors.neutral.gray100,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: colors.text.primary,
        marginBottom: 4,
    },
    itemMeta: {
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: colors.primary.main,
    },
    addressText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: colors.text.secondary,
        marginBottom: 4,
        lineHeight: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    value: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: colors.text.primary,
    },
});
