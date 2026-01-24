import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeHeader } from '../components/ThemeHeader';
import { ProductCard } from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProducts, fetchCategories } from '../store/slices/productsSlice';
import { fetchBanners } from '../store/slices/bannersSlice';
import { useTheme } from '../theme/ThemeContext';
import { Product } from '../types/product';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getPageConfig } from '../api/pagesApi';

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
    await Promise.all([
      dispatch(fetchBanners()),
      dispatch(fetchFeaturedProducts(10)), // Load more for grid
      dispatch(fetchCategories()),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    await loadPageConfig();
    setRefreshing(false);
  };

  // --- Render Sections ---

  const renderHeader = () => (
    <ThemeHeader
      title={pageConfig.headerTitle || (themeId === 'white-shine-jewelry' ? 'ZERAKI' : 'Jaipur Bangles')}
      onSearchPress={() => { }}
      onCartPress={() => navigation.navigate('Cart')}
      onMenuPress={() => navigation.navigate('Collections', {})}
      onProfilePress={() => navigation.navigate('Profile')}
    />
  );

  // Temp Debug Control to switch themes
  const renderThemeSwitcher = () => (
    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
      <TouchableOpacity
        onPress={() => setThemeId('midnight-shine')}
        style={{ padding: 8, backgroundColor: themeId === 'midnight-shine' ? theme.colors.primary : '#ccc', borderRadius: 4 }}
      >
        <Text style={{ color: '#fff' }}>Old Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setThemeId('white-shine-jewelry')}
        style={{ padding: 8, backgroundColor: themeId === 'white-shine-jewelry' ? theme.colors.primary : '#ccc', borderRadius: 4 }}
      >
        <Text style={{ color: '#fff' }}>Zeraki Theme</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWelcomeSection = () => {
    if (bannersLoading) return <ActivityIndicator size="large" color={theme.colors.primary} />;
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
                source={{ uri: category.imageUrl || 'https://via.placeholder.com/80?text=Cat' }}
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


  const renderFeaturedProducts = () => {
    if (loading.featuredProducts) return <ActivityIndicator color={theme.colors.primary} />;

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

            const productData: Product = {
              id: item.id,
              name: item.name || item.title,
              slug: item.slug,
              description: item.description || '',
              categoryId: item.categoryId || '',
              mrp: item.mrp || (item.originalPrice ? item.originalPrice.toString() : '0'),
              sellingPrice: item.sellingPrice ? item.sellingPrice.toString() : (item.price ? item.price.toString() : '0'),
              discountPercentage: item.discountPercentage ? item.discountPercentage.toString() : '0',
              stockQuantity: item.stockQuantity || item.stock || 0,
              lowStockThreshold: item.lowStockThreshold || 0,
              sku: item.sku || '',
              isFeatured: item.isFeatured || false,
              isActive: item.isActive || true,
              images: item.images && Array.isArray(item.images) ? item.images : (item.image ? [{ imageUrl: item.image, isPrimary: true }] : []),
              offerBadge: dynamicBadge,
              isOutofStock: item.isOutofStock || (item.stockQuantity !== undefined && item.stockQuantity <= 0),
              ...item
            };

            return (
              <ProductCard
                product={productData}
                onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                onAddToCart={() => { }} // TODO: Add to cart
                onToggleWishlist={() => { }} // TODO: Toggle wishlist
              />
            );
          }}
        />
      </View>
    );
  };

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    width: width,
    height: 460, // Total height including ad
    position: 'relative',
  },
  adContainer: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#FFE5E5', // Light red background for visibility
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure it sits on top if using absolute, but here we stack
  },
  adText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  welcomeSection: {
    width: width,
    // height: 220,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
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
