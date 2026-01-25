/**
 * WishlistScreen - Theme-Aware Component
 * 
 * Dynamically adapts styling based on active theme.
 * No separate variants needed - uses theme tokens for all styling.
 */

import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectWishlistLoading,
    selectWishlistError,
} from '../store/slices/wishlistSlice';
import { WishlistItem } from '../api/wishlistApi';
import { ThemeHeader } from '../components/ThemeHeader';

const WishlistScreen: React.FC = () => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    const wishlistItems = useAppSelector(selectWishlistItems);
    const isLoading = useAppSelector(selectWishlistLoading);
    const error = useAppSelector(selectWishlistError);

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        dispatch(fetchWishlist({}));
    }, [dispatch]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchWishlist({}));
        setRefreshing(false);
    }, [dispatch]);

    const handleRemove = useCallback(async (productId: string) => {
        await dispatch(removeFromWishlist(productId));
    }, [dispatch]);

    const handleAddToCart = (productId: string) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', productId);
    };

    const renderEmpty = () => (
        <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
            <Heart
                size={80}
                color={theme.colors.textSecondary}
                strokeWidth={1}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                Your Wishlist is Empty
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Save your favorite items here
            </Text>
        </View>
    );

    const renderItem = ({ item }: { item: WishlistItem }) => {
        const product = item.product;
        const imageUrl = product.images?.[0]?.url || '';

        return (
            <View
                style={[
                    styles.productCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }
                ]}
            >
                {/* Product Image */}
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Product Details */}
                <View style={styles.productInfo}>
                    <Text
                        style={[styles.productName, { color: theme.colors.textPrimary }]}
                        numberOfLines={2}
                    >
                        {product.name}
                    </Text>

                    <Text
                        style={[styles.productCategory, { color: theme.colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {product.category?.name}
                    </Text>

                    {/* Price Section */}
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: theme.colors.primary }]}>
                            ₹{product.sellingPrice.toLocaleString()}
                        </Text>
                        {product.discount > 0 && (
                            <>
                                <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                                    ₹{product.originalPrice.toLocaleString()}
                                </Text>
                                <Text style={[styles.discount, { color: theme.colors.success }]}>
                                    {product.discount}% OFF
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Stock Status */}
                    {product.stock > 0 ? (
                        <Text style={[styles.inStock, { color: theme.colors.success }]}>
                            In Stock
                        </Text>
                    ) : (
                        <Text style={[styles.outOfStock, { color: theme.colors.error }]}>
                            Out of Stock
                        </Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: theme.colors.primary }
                        ]}
                        onPress={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart size={18} color={theme.colors.buttonText} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: theme.colors.error }
                        ]}
                        onPress={() => handleRemove(product.id)}
                    >
                        <Trash2 size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (isLoading && wishlistItems.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ThemeHeader />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ThemeHeader />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
                    My Wishlist
                </Text>
                <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </Text>
            </View>

            {/* Error Message */}
            {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                </View>
            )}

            {/* Wishlist Items */}
            <FlatList
                data={wishlistItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={wishlistItems.length === 0 ? styles.emptyList : styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemCount: {
        fontSize: 14,
    },
    errorContainer: {
        padding: 12,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
    },
    list: {
        padding: 16,
    },
    emptyList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
    },
    emptySubtitle: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    productCard: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 12,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
    },
    productCategory: {
        fontSize: 12,
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
    discount: {
        fontSize: 12,
        fontWeight: '600',
    },
    inStock: {
        fontSize: 12,
        marginTop: 4,
    },
    outOfStock: {
        fontSize: 12,
        marginTop: 4,
    },
    actions: {
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
});

export default WishlistScreen;
