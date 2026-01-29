import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Heart, Plus } from 'lucide-react-native';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onToggleWishlist: () => void;
    onAddToCart: () => void;
    isWishlisted?: boolean;
}

const { width } = Dimensions.get('window');
// Two column layout with some spacing
const CARD_WIDTH = (width / 2) - 24;

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    onToggleWishlist,
    onAddToCart,
    isWishlisted = false
}) => {
    const { theme } = useTheme();

    // Determine Logic for Display
    const displayImage = product.images && product.images.length > 0
        ? (product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl)
        : 'https://via.placeholder.com/300';

    // Fallback logic if isOutofStock is undefined (e.g. use stockQuantity)
    const isOutOfStock = product.isOutofStock !== undefined
        ? product.isOutofStock
        : (product.stockQuantity !== undefined && product.stockQuantity <= 0);

    const discountBadge = product.offerBadge || (parseFloat(product.discountPercentage) > 0 ? `${Math.round(parseFloat(product.discountPercentage))}% OFF` : null);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.container,
                {
                    width: CARD_WIDTH,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: theme.isDark ? 1 : 0,
                }
            ]}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: displayImage }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Offer Badge (Top Left) */}
                {discountBadge && (
                    <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.textInverse }]}>
                            {discountBadge}
                        </Text>
                    </View>
                )}

                {/* Wishlist Button (Top Right) */}
                <TouchableOpacity
                    style={[styles.wishlistButton, { backgroundColor: theme.colors.surface }]}
                    onPress={onToggleWishlist}
                >
                    <Heart
                        size={18}
                        color={isWishlisted ? theme.colors.error : theme.colors.textPrimary}
                        fill={isWishlisted ? theme.colors.error : 'transparent'}
                    />
                </TouchableOpacity>

                {/* Add Button (Bottom Right of Image) */}
                {!isOutOfStock && (
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.colors.surface }]}
                        onPress={onAddToCart}
                    >
                        <Plus size={20} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={[styles.outOfStockText, { color: theme.colors.textSecondary }]}>
                            Out Of Stock
                        </Text>
                    </View>
                )}
            </View>

            {/* Details Container */}
            <View style={[styles.details, { padding: theme.spacing.cardPadding }]}>
                {/* Title */}
                <Text
                    numberOfLines={1}
                    style={[
                        styles.title,
                        {
                            color: theme.colors.textPrimary,
                            fontSize: theme.typography.body1.fontSize,
                            fontWeight: theme.typography.body1.fontWeight as any
                        }
                    ]}
                >
                    {product.name}
                </Text>

                {/* Price Row */}
                <View style={styles.priceRow}>
                    <Text style={[
                        styles.price,
                        {
                            color: theme.colors.error, // Red for price/sale
                            fontSize: theme.typography.h3.fontSize,
                            fontWeight: '700'
                        }
                    ]}>
                        ₹{product.sellingPrice}
                    </Text>
                    {product.mrp && product.mrp !== product.sellingPrice && (
                        <Text style={[
                            styles.originalPrice,
                            {
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.body2.fontSize,
                            }
                        ]}>
                            ₹{product.mrp}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.8,
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        zIndex: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockText: {
        fontSize: 16,
        fontWeight: '600',
    },
    details: {
        paddingTop: 8,
        alignItems: 'center',
    },
    title: {
        marginBottom: 4,
        textAlign: 'center',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    price: {
    },
    originalPrice: {
        textDecorationLine: 'line-through',
    },
});
