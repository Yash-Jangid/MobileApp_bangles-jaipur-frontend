import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeHeader } from '../components/ThemeHeader';
import { ProductCard } from '../components/ProductCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProducts, fetchCategories } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems, fetchWishlist } from '../store/slices/wishlistSlice';
import { useTheme } from '../theme/ThemeContext';
import { fetchBanners } from '../store/slices/bannersSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getPageConfig } from '../api/pagesApi';
import { CustomToast, ToastType } from '../components/CustomToast';
import { Product } from '../types/product';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export const HomeScreen: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {
  const { theme, setThemeId, themeId } = useTheme();
  const dispatch = useAppDispatch();
  const { featuredProducts, categories, loading } = useAppSelector((state) => state.products);
  const { banners, loading: bannersLoading } = useAppSelector((state) => state.banners);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pageConfig, setPageConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    loadHomeData();
    loadPageConfig();
  }, [dispatch]);

  const loadPageConfig = async () => {
    const config = await getPageConfig('home');
    if (config) {
      setPageConfig(config);
    }
  };

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const loadHomeData = async () => {
    // Sequential loading for better UX - top to bottom flow
    await dispatch(fetchBanners());
    await dispatch(fetchCategories());

    // Load products and wishlist in parallel (wishlist doesn't affect visible UI)
    await Promise.all([
      dispatch(fetchFeaturedProducts(10)),
      dispatch(fetchWishlist({})),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    await loadPageConfig();
    setRefreshing(false);
  };

  // Wishlist Logic
  const wishlistItems = useAppSelector(selectWishlistItems);
  const wishlistSet = React.useMemo(() => new Set(wishlistItems.map(item => item.productId)), [wishlistItems]);

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

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({
        productId: product.id,
        quantity: 1,
        size: product.specifications?.size || 'Free Size'
      })).unwrap();

      showToast('Added to bag', 'success', {
        label: 'VIEW BAG',
        onPress: () => navigation.navigate('Cart')
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add to bag', 'error');
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    const isWishlisted = wishlistSet.has(product.id);
    if (isWishlisted) {
      await dispatch(removeFromWishlist(product.id));
      showToast('Removed from wishlist', 'info');
    } else {
      await dispatch(addToWishlist(product.id));
      showToast('Added to wishlist', 'success', {
        label: 'VIEW',
        onPress: () => navigation.navigate('Wishlist' as any) // Assuming Wishlist route exists or reuse Collections
      });
    }
  };

  const renderHeader = () => (
    <ThemeHeader
      title={pageConfig.headerTitle || (themeId === 'white-shine-jewelry' ? 'ZERAKI' : 'Jaipur Bangles')}
      onSearchPress={() => { }}
      onCartPress={() => navigation.navigate('Cart')}
      onMenuPress={() => navigation.navigate('Collections', {})}
      onProfilePress={() => navigation.navigate('Profile')}
    />
  );

  // Shimmer loading states
  const renderBannerShimmer = () => (
    <View style={styles.bannerContainer}>
      <SkeletonLoader width={width} height={200} borderRadius={0} />
      <View style={styles.paginationContainer}>
        {[1, 2, 3].map((i) => (
          <SkeletonLoader key={i} width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
        ))}
      </View>
    </View>
  );

  const renderWelcomeSection = () => {
    if (bannersLoading) return renderBannerShimmer();
    if (banners.length === 0) return null;

    return (
      <View style={styles.bannerContainer}>
        {banners[currentBannerIndex].adText && <View style={styles.adContainer}>
          <Text style={styles.adText}>{banners[currentBannerIndex].adText}</Text>
        </View>}
        <FlatList
          ref={flatListRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentBannerIndex(index);
          }}

          renderItem={({ item }) => (
            <View style={styles.welcomeSection}>
              <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
            </View>
          )}
        />
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: currentBannerIndex === index ? theme.colors.primary : 'rgba(255,255,255,0.5)' }
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderCategories = () => (
    <View style={[styles.categoriesContainer, { backgroundColor: theme.colors.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryCircle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
              onPress={() => navigation.navigate('Collections', { categoryId: category.id })}
            >
              <Image
                source={{ uri: category.imageUrl }}
                style={styles.categoryImage}
              />
            </TouchableOpacity>
            <Text style={[styles.categoryTitle, { color: theme.colors.textPrimary }]}>{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderShopByPrice = () => {
    if (!theme.layout.showLegacySections) return null;

    const priceRanges = [
      { id: '1', label: 'Under ₹100', maxPrice: 100 },
      { id: '2', label: 'Under ₹500', maxPrice: 500 },
      { id: '3', label: 'Under ₹1000', maxPrice: 1000 },
      { id: '4', label: 'Under ₹2000', maxPrice: 2000 },
      { id: '5', label: 'Under ₹5000', maxPrice: 5000 },
    ];

    return (
      <View style={styles.shopByPriceContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Shop by Price</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll}>
          {priceRanges.map((range) => (
            <View key={range.id} style={styles.priceContainer}>
              <TouchableOpacity
                style={[styles.priceCircle, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('Collections', { maxPrice: range.maxPrice })}
              >
                <Text style={[styles.priceLabel, { color: theme.colors.primary }]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAdvertisement = () => {
    if (!theme.layout.showLegacySections) return null;

    return (
      <View style={styles.advertisementContainer}>
        <TouchableOpacity
          style={[styles.adBanner, { backgroundColor: theme.colors.surface }]}
          onPress={() => { }}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.secondary]}
            style={styles.adGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.adTitle, { color: '#FFF' }]}>MEGA SALE</Text>
            <Text style={[styles.adSubtitle, { color: '#FFF' }]}>Up to 70% OFF on all bangles</Text>
            <Text style={[styles.adCTA, { color: '#FFF' }]}>Shop Now →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductGridShimmer = () => (
    <View style={[styles.featuredCoursesContainer, { backgroundColor: theme.colors.background }]}>
      <SkeletonLoader width="40%" height={24} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ width: '48%', marginBottom: 16 }}>
            <SkeletonLoader width="100%" height={200} borderRadius={8} />
            <SkeletonLoader width="80%" height={16} style={{ marginTop: 8 }} />
            <SkeletonLoader width="60%" height={14} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );

  const renderFeaturedProducts = () => {
    if (loading.featuredProducts) return renderProductGridShimmer();

    return (
      <View style={[styles.featuredCoursesContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {pageConfig.featuredSectionTitle || 'Collection'}
          </Text>
        </View>

        <FlatList
          data={featuredProducts}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 4 }}
          renderItem={({ item }: { item: any }) => {
            const discount = parseFloat(item.discountPercentage || '0');
            const dynamicBadge = item.offerBadge
              || (discount > 0 ? `${Math.round(discount)}% OFF` : undefined);

            const isWishlisted = wishlistSet.has(item.id);

            const productData: Product = {
              id: item.id,
              name: item.name || item.title || '',
              slug: item.slug || '',
              description: item.description || '',
              categoryId: item.categoryId || '',
              mrp: (item.mrp || item.originalPrice || '0').toString(),
              sellingPrice: (item.sellingPrice || item.price || '0').toString(),
              discountPercentage: (item.discountPercentage || '0').toString(),
              stockQuantity: item.stockQuantity || item.stock || 0,
              lowStockThreshold: item.lowStockThreshold || 0,
              sku: item.sku || '',
              specifications: item.specifications || {},
              isFeatured: item.isFeatured || false,
              isActive: item.isActive || true,
              images: (item.images && Array.isArray(item.images) ? item.images : (item.image ? [{ imageUrl: item.image, isPrimary: true }] : [])).map((img: any, idx: number) => ({
                id: img.id || Math.random().toString(),
                imageUrl: img.imageUrl || img,
                thumbnailUrl: img.thumbnailUrl || img.imageUrl || img,
                altText: img.altText || item.name || '',
                isPrimary: img.isPrimary || (idx === 0),
                sortOrder: img.sortOrder || idx,
              })),
              offerBadge: dynamicBadge,
              isOutofStock: item.isOutofStock || (item.stockQuantity !== undefined && item.stockQuantity <= 0),
            };

            return (
              <ProductCard
                product={productData}
                onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                onAddToCart={() => handleAddToCart(productData)}
                onToggleWishlist={() => handleToggleWishlist(productData)}
                isWishlisted={isWishlisted}
              />
            );
          }}
        />
      </View>
    );
  };

  // ... (existing renders)

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}

      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderWelcomeSection()}
        {renderCategories()}
        {renderShopByPrice()}
        {renderAdvertisement()}
        {renderFeaturedProducts()}
      </ScrollView>

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
  bannerContainer: {
    width: width,
    height: 460,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    paddingTop: 10,
  },
  adContainer: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  adText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  welcomeSection: {
    width: width,
    paddingHorizontal: 10,
    // height: 220,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
  },
  categoryContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70, // Smaller circles
  },
  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 6,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  featuredCoursesContainer: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    alignItems: 'center', // Centered title for Zeraki
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Zeraki style
    letterSpacing: 1,
  },
  shopByPriceContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  priceScroll: {
    marginHorizontal: -4,
  },
  priceContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  priceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  advertisementContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  adBanner: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  adGradient: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  adTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  adSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  adCTA: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
