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
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ShoppingBag, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectWishlistLoading,
    selectWishlistError,
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { WishlistItem } from '../api/wishlistApi';
import { ThemeHeader } from '../components/ThemeHeader';
import { CustomToast, ToastType } from '../components/CustomToast';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type WishlistScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WishlistScreen: React.FC = () => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    const wishlistItems = useAppSelector(selectWishlistItems);
    const isLoading = useAppSelector(selectWishlistLoading);
    const error = useAppSelector(selectWishlistError);

    const [refreshing, setRefreshing] = React.useState(false);
    const navigation = useNavigation<WishlistScreenNavigationProp>();

    // Toast State
    const [toastVisible, setToastVisible] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastAction, setToastAction] = React.useState<{ label: string; onPress: () => void } | undefined>(undefined);
    const [toastType, setToastType] = React.useState<ToastType>('default');

    const showToast = (message: string, type: ToastType = 'default', action?: { label: string; onPress: () => void }) => {
        setToastMessage(message);
        setToastType(type);
        setToastAction(action);
        setToastVisible(true);
    };

    useEffect(() => {
        dispatch(fetchWishlist({}));
    }, [dispatch]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchWishlist({}));
        setRefreshing(false);
    }, [dispatch]);

    const handleRemove = useCallback(async (productId: string) => {
        try {
            await dispatch(removeFromWishlist(productId)).unwrap();
            showToast('Removed from wishlist', 'info');
        } catch (error) {
            showToast('Failed to remove from wishlist', 'error');
        }
    }, [dispatch]);

    const handleAddToCart = async (product: any) => {
        try {
            await dispatch(addToCart({
                productId: product.id,
                quantity: 1,
                size: '2.4' // Default size for wishlist items since we don't have a picker here
            })).unwrap();

            showToast('Added to bag', 'success', {
                label: 'VIEW BAG',
                onPress: () => navigation.navigate('Cart')
            });
        } catch (error) {
            showToast('Failed to add to bag', 'error');
        }
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.surface }]}>
                <Heart
                    size={48}
                    color={theme.colors.textSecondary}
                    strokeWidth={1.5}
                />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                Wishlist is empty
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Seems you haven't added anything to your wishlist yet.
            </Text>
            <TouchableOpacity
                style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('Collections', {})}
            >
                <Text style={styles.exploreButtonText}>EXPLORE NOW</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: WishlistItem }) => {
        const product = item.product;
        const imageUrl = product.images?.[0]?.imageUrl || '';

        return (
            <TouchableOpacity
                style={[
                    styles.productCard,
                    {
                        backgroundColor: theme.colors.surface,
                    }
                ]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
            >
                {/* Remove Icon */}
                <TouchableOpacity
                    style={[styles.removeIcon, { backgroundColor: theme.colors.surface + 'CC' }]}
                    onPress={() => handleRemove(product.id)}
                >
                    <X size={16} color={theme.colors.textPrimary} />
                </TouchableOpacity>

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
                        numberOfLines={1}
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
                        <Text style={[styles.price, { color: theme.colors.textPrimary }]}>
                            ₹{product.sellingPrice.toLocaleString()}
                        </Text>
                        {product.discount > 0 && (
                            <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                                ₹{product.originalPrice.toLocaleString()}
                            </Text>
                        )}
                        {product.discount > 0 && (
                            <Text style={[styles.discount, { color: theme.colors.success }]}>
                                ({product.discount}% OFF)
                            </Text>
                        )}
                    </View>
                </View>

                {/* Add to Bag Button */}
                <TouchableOpacity
                    style={[
                        styles.addToBagButton,
                        {
                            borderTopColor: theme.colors.border,
                            opacity: product.stock === 0 ? 0.6 : 1
                        }
                    ]}
                    onPress={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                >
                    <ShoppingBag size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.addToBagText, { color: theme.colors.primary }]}>
                        {product.stock === 0 ? 'OUT OF STOCK' : 'MOVE TO BAG'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (isLoading && Array.isArray(wishlistItems) && wishlistItems.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ThemeHeader
                    title="MY WISHLIST"
                    onCartPress={() => navigation.navigate('Cart')}
                    onSearchPress={() => { }}
                    onProfilePress={() => navigation.navigate('Profile')}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ThemeHeader
                title="MY WISHLIST"
                onCartPress={() => navigation.navigate('Cart')}
                onSearchPress={() => { }}
                onProfilePress={() => navigation.navigate('Profile')}
            />

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
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
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

            <CustomToast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                actionLabel={toastAction?.label}
                onAction={() => {
                    toastAction?.onPress();
                    setToastVisible(false);
                }}
                onDismiss={() => setToastVisible(false)}
            />
        </View>
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
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    exploreButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 4,
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    productCard: {
        width: (Dimensions.get('window').width - 24) / 2,
        marginBottom: 12,
        borderRadius: 4,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    removeIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        aspectRatio: 0.8,
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500',
    },
    productCategory: {
        fontSize: 11,
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 11,
        textDecorationLine: 'line-through',
    },
    discount: {
        fontSize: 10,
        fontWeight: '600',
    },
    addToBagButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        marginTop: 4,
    },
    addToBagText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default WishlistScreen;
