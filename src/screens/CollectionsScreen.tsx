import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import { useTheme } from '../theme/ThemeContext';
import { Heart, Search, ShoppingBag } from 'lucide-react-native';
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
  fetchWishlist
} from '../store/slices/wishlistSlice';
import { CustomToast, ToastType } from '../components/CustomToast';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const CARD_WIDTH = (width - ((COLUMN_COUNT + 1) * SPACING)) / COLUMN_COUNT;

export const CollectionsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { products, categories, loading } = useAppSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(route.params?.categoryId || null);

  // Wishlist State
  const wishlistItems = useAppSelector(selectWishlistItems);
  const wishlistSet = React.useMemo(() => new Set(wishlistItems.map(item => item.productId)), [wishlistItems]);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('default');

  const showToast = (message: string, type: ToastType = 'default') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    dispatch(fetchWishlist({}));
  }, [dispatch, categories.length]);

  useEffect(() => {
    loadProducts();
  }, [dispatch, selectedCategory]);

  const loadProducts = () => {
    dispatch(fetchProducts({
      categoryId: selectedCategory || undefined,
      limit: 20
    }));
  };

  const handleCategoryPress = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      if (wishlistSet.has(productId)) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        showToast('Removed from wishlist', 'info');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        showToast('Added to wishlist', 'success');
      }
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const navigateToProduct = (id: string) => {
    navigation.navigate('ProductDetails', { productId: id });
  };

  const renderCategoryFilter = () => (
    <View style={[styles.filterContainer, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === null && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            selectedCategory !== null && { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
          ]}
          onPress={() => handleCategoryPress(null)}
        >
          <Text style={[
            styles.filterText,
            { color: selectedCategory === null ? theme.colors.background : theme.colors.textPrimary }
          ]}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              selectedCategory === category.id && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              selectedCategory !== category.id && { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedCategory === category.id ? theme.colors.background : theme.colors.textPrimary }
            ]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigateToProduct(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images?.[0]?.imageUrl || 'https://via.placeholder.com/300x400' }}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => handleToggleWishlist(item.id)}
        >
          <Heart
            size={18}
            color={wishlistSet.has(item.id) ? theme.colors.error : theme.colors.textPrimary}
            fill={wishlistSet.has(item.id) ? theme.colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {item.specifications?.material || 'Premium Bangle'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.productPrice, { color: theme.colors.textPrimary }]}>
            ₹{item.sellingPrice}
          </Text>
          {parseFloat(item.discountPercentage) > 0 && (
            <>
              <Text style={[styles.productMRP, { color: theme.colors.textSecondary }]}>
                ₹{item.mrp}
              </Text>
              <Text style={styles.discountText}>
                {Math.round(parseFloat(item.discountPercentage))}% OFF
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader
        title="Collections"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {renderCategoryFilter()}

      {loading.products ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                No products foundsss
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Try selecting a different category
              </Text>
            </View>
          }
        />
      )}

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  productList: {
    padding: SPACING,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: SPACING,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 8,
    marginBottom: SPACING,
    overflow: 'hidden',
    // Removed contrast elevation for a cleaner modern look, typical of fashion apps
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4, // Professional Fashion Aspect Ratio
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 6,
    zIndex: 1,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  productMRP: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#FF9100', // Myntra-like Orange
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
});
