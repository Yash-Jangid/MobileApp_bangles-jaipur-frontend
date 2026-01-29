import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { CustomHeader } from '../components/CustomHeader';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById, clearSelectedProduct } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems, fetchWishlist } from '../store/slices/wishlistSlice';
import { useTheme } from '../theme/ThemeContext';
import { Heart, Share2, Star, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react-native';
import { CustomToast, ToastType } from '../components/CustomToast';

const { width } = Dimensions.get('window');
const ASPECT_RATIO = 1.25; // 4:5 or 3:4 for premium look
const IMAGE_HEIGHT = width * ASPECT_RATIO;

// Bangle sizes
const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8'];

export const ProductDetailsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error } = useAppSelector((state) => state.products);
  const { actionLoading } = useAppSelector((state) => state.cart);
  const productId = route?.params?.productId;

  const [selectedSize, setSelectedSize] = useState<string>('2.4');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Wishlist Logic
  const wishlistItems = useAppSelector(selectWishlistItems);
  const isWishlisted = wishlistItems.some(item => item.productId === productId);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastAction, setToastAction] = useState<{ label: string; onPress: () => void } | undefined>(undefined);
  const [toastType, setToastType] = useState<ToastType>('default');

  const showToast = (message: string, type: ToastType = 'default', action?: { label: string; onPress: () => void }) => {
    setToastMessage(message);
    setToastType(type);
    setToastAction(action);
    setToastVisible(true);
  };

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      dispatch(fetchWishlist({}));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId]);

  const handleToggleWishlist = async () => {
    if (!productId) return;

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        showToast('Removed from wishlist', 'info');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        showToast('Added to wishlist', 'success', {
          label: 'VIEW',
          onPress: () => navigation.navigate('Wishlist')
        });
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleShare = async () => {
    if (!selectedProduct) return;
    try {
      await Share.share({
        message: `Check out this amazing ${selectedProduct.name} at Bangles Jaipur! \n\nPrice: ₹${selectedProduct.sellingPrice}`,
        title: selectedProduct.name,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      await dispatch(addToCart({
        productId: selectedProduct.id,
        quantity,
        size: selectedSize
      })).unwrap();

      showToast('Added to bag', 'success', {
        label: 'VIEW BAG',
        onPress: () => navigation.navigate('Cart')
      });
    } catch (err) {
      showToast('Failed to add to bag', 'error');
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
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error.productDetails || !selectedProduct) {
    console.log(error.productDetails);
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>{error.productDetails || 'Product not found'}</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { name, description, mrp, sellingPrice, discountPercentage, images, specifications } = selectedProduct;
  const displayImages = images.length > 0 ? images.map(img => img.imageUrl) : ['https://via.placeholder.com/400'];
  const discount = Math.round(parseFloat(discountPercentage || '0'));

  const renderProductImage = ({ item }: { item: string }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item }}
        style={styles.mainImage}
        resizeMode="cover"
      />
    </View>
  );



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader
        title={name}
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Share2 size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.carouselContainer}>
          <FlatList
            data={displayImages}
            renderItem={renderProductImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
          />

          <TouchableOpacity
            style={styles.wishlistFloat}
            onPress={handleToggleWishlist}
          >
            <Heart
              size={24}
              color={isWishlisted ? "#FF3E6C" : "#555"}
              fill={isWishlisted ? "#FF3E6C" : "transparent"}
            />
          </TouchableOpacity>

          <View style={styles.paginationContainer}>
            {displayImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: selectedImageIndex === index ? theme.colors.primary : 'rgba(0,0,0,0.2)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View style={[styles.detailsContainer, { backgroundColor: theme.colors.background }]}>
          {/* Title & Brand */}
          <View style={styles.headerInfo}>
            <Text style={[styles.brandName, { color: theme.colors.textSecondary }]}>
              {specifications?.material || 'Premium Brand'}
            </Text>
            <Text style={[styles.productTitle, { color: theme.colors.textPrimary }]}>{name}</Text>
          </View>

          {/* Pricing */}
          <View style={[styles.priceBlock, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.priceRow}>
              <Text style={[styles.sellingPrice, { color: theme.colors.textPrimary }]}>₹{sellingPrice}</Text>
              {discount > 0 && (
                <>
                  <Text style={[styles.mrp, { color: theme.colors.textSecondary }]}>MRP ₹{mrp}</Text>
                  <Text style={styles.discountText}>({discount}% OFF)</Text>
                </>
              )}
            </View>
            <Text style={styles.taxText}>inclusive of all taxes</Text>
          </View>

          {/* Size Selection */}
          <View style={[styles.selectionBlock, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>SELECT SIZE</Text>
              <TouchableOpacity>
                <Text style={[styles.sizeGuideText, { color: theme.colors.primary }]}>Size Chart</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sizeOptions}>
              {BANGLE_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeCircle,
                    selectedSize === size
                      ? { borderColor: theme.colors.primary, backgroundColor: theme.colors.background }
                      : { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size ? { color: theme.colors.primary } : { color: theme.colors.textSecondary }
                  ]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Delivery & Services */}
          <View style={[styles.serviceBlock, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.serviceItem}>
              <Truck size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.serviceText, { color: theme.colors.textPrimary }]}>Free Delivery</Text>
            </View>
            <View style={styles.serviceItem}>
              <RotateCcw size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.serviceText, { color: theme.colors.textPrimary }]}>30 Days Return</Text>
            </View>
            <View style={styles.serviceItem}>
              <ShieldCheck size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.serviceText, { color: theme.colors.textPrimary }]}>100% Original</Text>
            </View>
          </View>

          {/* Product Description */}
          <View style={styles.descBlock}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>PRODUCT DETAILS</Text>
            <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
              {description}
            </Text>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.cartButton, { borderColor: theme.colors.border }]}
          onPress={handleAddToCart}
          disabled={actionLoading?.add}
        >
          <ShoppingBag size={20} color={theme.colors.textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.cartButtonText, { color: theme.colors.textPrimary }]}>Add to Bag</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleBuyNow}
          disabled={actionLoading?.add}
        >
          {actionLoading?.add ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>Buy Now</Text>
          )}
        </TouchableOpacity>
      </View>

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
    height: IMAGE_HEIGHT,
    width: width,
    overflow: 'hidden',
  },
  carousel: {
    width: width,
    height: IMAGE_HEIGHT,
  },
  imageWrapper: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f9f9f9',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  wishlistFloat: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  headerInfo: {
    marginBottom: 16,
  },
  brandName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  priceBlock: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sellingPrice: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  mrp: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    fontFamily: Fonts.regular,
  },
  discountText: {
    fontSize: 16,
    color: '#FF9100',
    fontFamily: Fonts.bold,
  },
  taxText: {
    fontSize: 12,
    color: '#03A685', // Myntra green for inclusive tax
    fontFamily: Fonts.medium,
  },
  selectionBlock: {
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  sizeGuideText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    textTransform: 'uppercase',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  serviceBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 20,
  },
  serviceItem: {
    alignItems: 'center',
    gap: 4,
  },
  serviceText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  descBlock: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  buyButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 8,
  },
  cartButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
  },
  buyButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#fff',
    textTransform: 'uppercase',
  },
});
