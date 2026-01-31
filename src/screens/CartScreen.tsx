import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import { useTheme } from '../theme/ThemeContext';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, Tag, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CartItemSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={styles.cartItem}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.itemDetails}>
        <Animated.View style={[styles.skeletonText, { width: '80%', height: 16, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.skeletonText, { width: '40%', height: 12, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.skeletonText, { width: '30%', height: 20, opacity }]} />
      </View>
    </View>
  );
};

// Separated component to handle local state and debounce
const CartItemRow = React.memo(({ item, index, onUpdateQuantity, onRemove }: { item: any, index: number, onUpdateQuantity: (id: string, qty: number) => void, onRemove: (id: string) => void }) => {
  const { theme } = useTheme();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (item.quantity !== localQuantity && !debounceTimer.current) {
      setLocalQuantity(item.quantity);
    }
  }, [item.quantity]);

  const handleQuantityChange = (delta: number) => {
    const newQty = localQuantity + delta;
    if (newQty < 1) return;

    // 1. Update UI Immediately
    setLocalQuantity(newQty);

    // 2. Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 3. Set new timer to trigger API call
    debounceTimer.current = setTimeout(() => {
      onUpdateQuantity(item.id, newQty);
      debounceTimer.current = null;
    }, 800); // 800ms debounce
  };

  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product?.images?.[0]?.imageUrl || item.product?.images?.[0]?.thumbnailUrl || 'https://via.placeholder.com/150' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product?.name || 'Loading Product...'}</Text>
        <View style={styles.attributesRow}>
          <Text style={styles.itemSize}>Size: {item.size}"</Text>
          {item.product?.specifications?.material && (
            <Text style={styles.itemMaterial}> • {item.product.specifications.material}</Text>
          )}
        </View>
        <Text style={styles.itemPrice}>₹{item.product?.sellingPrice || '0'}</Text>
      </View>

      <View style={styles.itemActionsColumn}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={20} color={colors.semantic.error} />
        </TouchableOpacity>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Minus size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{localQuantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Plus size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { items, totalAmount, discountAmount, couponCode, finalAmount, loading, error } = useAppSelector((state) => state.cart);
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Handle global error toast/alert if needed, unrelated to specific interactions
  useEffect(() => {
    if (error && error.includes('coupon')) {
      Alert.alert('Coupon Error', error);
    }
  }, [error]);

  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    dispatch(updateCartItem({ id, payload: { quantity: newQuantity } }));
  }, [dispatch]);

  const handleRemoveItem = useCallback((id: string) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }
    setIsApplyingCoupon(true);
    try {
      await dispatch(applyCoupon(couponInput.trim())).unwrap();
      Alert.alert('Success', 'Coupon applied successfully!');
      setCouponInput('');
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setIsApplyingCoupon(true);
    try {
      await dispatch(removeCoupon()).unwrap();
      Alert.alert('Success', 'Coupon removed');
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to remove coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <ShoppingCart size={100} color={colors.neutral.gray300} />
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet.
      </Text>
      <TouchableOpacity
        style={[styles.shopNowButton, { backgroundColor: colors.primary.main }]}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      >
        <Text style={styles.shopNowButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && (!items || items.length === 0)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <CustomHeader title="Shopping Cart" />
        <View style={styles.listContent}>
          {[1, 2, 3].map((key) => <CartItemSkeleton key={key} />)}
        </View>
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <CustomHeader title="Shopping Cart" />
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title="Shopping Cart" />

      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <CartItemRow
            item={item}
            index={index}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            {/* Coupon Section */}
            <View style={styles.couponSection}>
              <View style={styles.couponHeader}>
                <Tag size={20} color={colors.primary.main} />
                <Text style={styles.couponTitle}>Have a Coupon?</Text>
              </View>

              {couponCode ? (
                <View style={styles.appliedCouponContainer}>
                  <View style={styles.appliedCouponInfo}>
                    <Text style={styles.appliedCouponCode}>{couponCode}</Text>
                    <Text style={styles.appliedCouponSuccess}>Applied successfully!</Text>
                  </View>
                  <TouchableOpacity onPress={handleRemoveCoupon} disabled={isApplyingCoupon}>
                    {isApplyingCoupon ? (
                      <ActivityIndicator size="small" color={colors.semantic.error} />
                    ) : (
                      <X size={20} color={colors.semantic.error} />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.couponInputContainer}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter Code"
                    value={couponInput}
                    onChangeText={setCouponInput}
                    autoCapitalize="characters"
                    placeholderTextColor={colors.text.disabled}
                  />
                  <TouchableOpacity
                    style={[styles.applyButton, !couponInput.trim() && styles.applyButtonDisabled]}
                    onPress={handleApplyCoupon}
                    disabled={!couponInput.trim() || isApplyingCoupon}
                  >
                    {isApplyingCoupon ? (
                      <ActivityIndicator size="small" color={colors.neutral.white} />
                    ) : (
                      <Text style={styles.applyButtonText}>Apply</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Bill Details */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Bill Details</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Total</Text>
                <Text style={styles.summaryValue}>₹{totalAmount}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelDiscount}>Coupon Discount</Text>
                  <Text style={styles.summaryValueDiscount}>- ₹{discountAmount}</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Fee</Text>
                <Text style={styles.summaryValueFree}>FREE</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{finalAmount}</Text>
              </View>
            </View>
          </View>
        }
      />

      <View style={styles.bottomActions}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabelSmall}>Total</Text>
          <Text style={styles.totalValueSmall}>₹{finalAmount}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Checkout
          </Text>
          <ArrowRight size={20} color={colors.neutral.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  // Skeleton
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray200,
    marginRight: 12,
  },
  skeletonText: {
    backgroundColor: colors.neutral.gray200,
    borderRadius: 4,
  },
  // Cart Item
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.neutral.gray50,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    height: 90,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  attributesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSize: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  itemMaterial: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  itemActionsColumn: {
    height: 90,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
  deleteButton: {
    padding: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.neutral.white,
    elevation: 1,
  },
  quantityValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginHorizontal: 10,
    minWidth: 16,
    textAlign: 'center',
  },

  // Coupon Section
  couponSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginLeft: 8,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 12,
    textTransform: 'uppercase',
  },
  applyButton: {
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: colors.neutral.gray300,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.semantic.success + '10', // 10% opacity
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.semantic.success + '40',
  },
  appliedCouponInfo: {
    flex: 1,
  },
  appliedCouponCode: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: colors.semantic.success,
  },
  appliedCouponSuccess: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.semantic.success,
    marginTop: 2,
  },

  // Summary
  summarySection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,  // Increased spacing
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  summaryLabelDiscount: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.semantic.success,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  summaryValueDiscount: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: colors.semantic.success,
  },
  summaryValueFree: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: colors.semantic.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border.light
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
  },

  // Bottom Bar
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 20,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabelSmall: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: colors.text.secondary,
  },
  totalValueSmall: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  checkoutButton: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  shopNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 4,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shopNowButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
