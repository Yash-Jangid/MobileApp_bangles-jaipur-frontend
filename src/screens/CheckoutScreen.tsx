import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';

type PaymentMethod = 'COD' | 'PhonePe' | 'GPay';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { totalAmount, items } = useAppSelector((state) => state.cart);
  const { loading } = useAppSelector((state) => state.orders);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('COD');

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.fullName || !address.phone || !address.addressLine1 ||
      !address.city || !address.state || !address.pincode) {
      Alert.alert('Missing Information', 'Please fill in all required address fields');
      return;
    }

    // Validate phone
    if (address.phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    const payload = {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size
      })),
      shippingAddress: {
        street: address.addressLine1 + (address.addressLine2 ? ', ' + address.addressLine2 : ''),
        city: address.city,
        state: address.state,
        zipCode: address.pincode,
        country: 'India', // Hardcoded for now
        phone: address.phone
      },
      paymentMethod: selectedPayment
    };

    try {
      await dispatch(createOrder(payload)).unwrap();
      // Clear cart after successful order
      dispatch(clearCart());

      Alert.alert(
        'Order Placed!',
        `Your order of ₹${totalAmount} has been placed successfully with ${selectedPayment}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert('Order Failed', typeof error === 'string' ? error : 'Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Checkout" showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={colors.text.tertiary}
            value={address.fullName}
            onChangeText={(text) => setAddress({ ...address, fullName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            placeholderTextColor={colors.text.tertiary}
            value={address.phone}
            onChangeText={(text) => setAddress({ ...address, phone: text })}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <TextInput
            style={styles.input}
            placeholder="Address Line 1 *"
            placeholderTextColor={colors.text.tertiary}
            value={address.addressLine1}
            onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address Line 2 (Optional)"
            placeholderTextColor={colors.text.tertiary}
            value={address.addressLine2}
            onChangeText={(text) => setAddress({ ...address, addressLine2: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City *"
              placeholderTextColor={colors.text.tertiary}
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State *"
              placeholderTextColor={colors.text.tertiary}
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Pincode *"
            placeholderTextColor={colors.text.tertiary}
            value={address.pincode}
            onChangeText={(text) => setAddress({ ...address, pincode: text })}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'COD' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment('COD')}
          >
            <View style={styles.radioButton}>
              {selectedPayment === 'COD' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Cash on Delivery</Text>
              <Text style={styles.paymentDescription}>Pay when you receive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'PhonePe' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment('PhonePe')}
          >
            <View style={styles.radioButton}>
              {selectedPayment === 'PhonePe' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>PhonePe</Text>
              <Text style={styles.paymentDescription}>Pay via PhonePe UPI</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'GPay' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment('GPay')}
          >
            <View style={styles.radioButton}>
              {selectedPayment === 'GPay' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Google Pay</Text>
              <Text style={styles.paymentDescription}>Pay via Google Pay UPI</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{totalAmount}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValueFree}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading.create}
        >
          {loading.create ? (
            <ActivityIndicator size="small" color={colors.neutral.white} />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order (₹{totalAmount})
            </Text>
          )}
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.neutral.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: colors.text.primary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border.light,
    marginBottom: 12,
    backgroundColor: colors.neutral.white,
  },
  paymentOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
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
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
