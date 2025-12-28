import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, totalAmount, loading, actionLoading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (id: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ id, payload: { quantity: newQuantity } }));
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        {/* Category not always available in cart item directly, skipping or fetching from product */}
        <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
        <Text style={styles.itemSize}>Size: {item.size}"</Text>
        <Text style={styles.itemPrice}>₹{item.product?.sellingPrice}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
            disabled={actionLoading.update}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
            disabled={actionLoading.update}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
          disabled={actionLoading.remove}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some beautiful bangles to get started
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Shopping Cart" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Shopping Cart" />
        {renderEmptyCart()}
      </View>
    );
  }

  // Use values from backend response
  const subtotal = totalAmount;
  const shipping = 0; // Free shipping logic can be enhanced
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      <CustomHeader title="Shopping Cart" />

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValueFree}>FREE</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        }
      />

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout (₹{total})
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: colors.primary.main,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  quantityValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: colors.semantic.error,
  },
  summarySection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 100,
  },
  summaryTitle: {
    fontSize: 18,
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
  summaryValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
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
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
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
  shopNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
  },
  shopNowButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
