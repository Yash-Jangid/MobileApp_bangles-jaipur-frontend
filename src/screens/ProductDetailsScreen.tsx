import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductBySlug, clearSelectedProduct } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';

const { width } = Dimensions.get('window');

// Bangle sizes in inches
const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8'];

export const ProductDetailsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route
}) => {
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error } = useAppSelector((state) => state.products);
  const { actionLoading } = useAppSelector((state) => state.cart);
  const slug = route?.params?.slug;

  const [selectedSize, setSelectedSize] = useState<string>('2.4');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, slug]);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      await dispatch(addToCart({
        productId: selectedProduct.id,
        quantity,
        size: selectedSize
      })).unwrap();
      Alert.alert('Success', 'Added to cart successfully');
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedProduct) return;

    try {
      await dispatch(addToCart({
        productId: selectedProduct.id,
        quantity,
        size: selectedSize
      })).unwrap();
      navigation.navigate('Cart');
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to add to cart');
    }
  };

  if (loading.productDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error.productDetails || !selectedProduct) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.productDetails || 'Product not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { name, description, mrp, sellingPrice, discount, images, specifications } = selectedProduct;
  const displayImages = images.length > 0 ? images.map(img => img.imageUrl) : ['https://via.placeholder.com/400'];

  return (
    <View style={styles.container}>
      <CustomHeader title="Product Details" showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: displayImages[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imagePaginationContainer}>
            {displayImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  selectedImageIndex === index && styles.paginationDotActive,
                ]}
                onPress={() => setSelectedImageIndex(index)}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {specifications.material && (
            <Text style={styles.productCategory}>{specifications.material} Bangles</Text>
          )}
          <Text style={styles.productName}>{name}</Text>

          {/* Rating - Placeholder as backend doesn't show rating yet */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ 4.8</Text>
            <Text style={styles.reviewsText}>(120 reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            {discount > 0 ? (
              <>
                <Text style={styles.discountPrice}>₹{sellingPrice}</Text>
                <Text style={styles.originalPrice}>₹{mrp}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {discount}% OFF
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.discountPrice}>₹{sellingPrice}</Text>
            )}
          </View>

          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Select Size (inches)</Text>
            <View style={styles.sizesContainer}>
              {BANGLE_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextSelected,
                    ]}
                  >
                    {size}"
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={actionLoading?.add}
        >
          {actionLoading?.add ? (
            <ActivityIndicator size="small" color={colors.primary.main} />
          ) : (
            <Text style={styles.addToCartText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleBuyNow}
          disabled={actionLoading?.add}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.semantic.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.neutral.white,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: colors.neutral.gray100,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePaginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray400,
  },
  paginationDotActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  productInfo: {
    padding: 20,
  },
  productCategory: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.primary.main,
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  discountPrice: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: colors.accent.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: colors.neutral.white,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.neutral.white,
  },
  sizeButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  sizeText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  sizeTextSelected: {
    color: colors.primary.main,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  quantityValue: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.neutral.white,
    borderWidth: 2,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.primary.main,
  },
  buyNowButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
