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
import { AppHeader } from '../components/AppHeader';
import { Colors } from '../common/colors';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProducts, fetchCategories } from '../store/slices/productsSlice';
import { fetchBanners } from '../store/slices/bannersSlice';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { featuredProducts, categories, loading } = useAppSelector((state) => state.products);
  const { banners, loading: bannersLoading } = useAppSelector((state) => state.banners);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, [dispatch]);

  // Auto-scroll carousel
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
    try {
      await Promise.all([
        dispatch(fetchBanners()),
        dispatch(fetchFeaturedProducts(10)),
        dispatch(fetchCategories()),
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const navigateToCategory = (categoryId: string) => {
    navigation.navigate('Collections', { categoryId });
  };

  const navigateToProductDetail = (productSlug: string) => {
    navigation.navigate('ProductDetails', { slug: productSlug });
  };

  const renderWelcomeSection = () => {
    if (bannersLoading) {
      return (
        <View style={[styles.bannerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (banners.length === 0) {
      return null;
    }

    return (
      <View style={styles.bannerContainer}>
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
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.welcomeSection}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              </View>
            </LinearGradient>
          )}
        />
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentBannerIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const priceRanges = [
    { id: '1', label: 'Under ₹100', maxPrice: 100 },
    { id: '2', label: 'Under ₹500', maxPrice: 500 },
    { id: '3', label: 'Under ₹1000', maxPrice: 1000 },
    { id: '4', label: 'Under ₹2000', maxPrice: 2000 },
    { id: '5', label: 'Under ₹5000', maxPrice: 5000 },
  ];

  const renderShopByPrice = () => (
    <View style={styles.shopByPriceContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shop by Price</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll}>
        {priceRanges.map((range) => (
          <View key={range.id} style={styles.priceContainer}>
            <TouchableOpacity
              style={[styles.priceCircle, { backgroundColor: theme.colors.card }]}
              onPress={() => navigation.navigate('Collections', { maxPrice: range.maxPrice })}
            >
              <Text style={[styles.priceLabel, { color: theme.colors.primary }]}>{range.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAdvertisement = () => (
    <View style={styles.advertisementContainer}>
      <TouchableOpacity
        style={[styles.adBanner, { backgroundColor: theme.colors.card }]}
        onPress={() => { }}
      >
        <LinearGradient
          colors={['#FF3E6C', '#FF63A5']}
          style={styles.adGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.adTitle}>MEGA SALE</Text>
          <Text style={styles.adSubtitle}>Up to 70% OFF on all bangles</Text>
          <Text style={styles.adCTA}>Shop Now →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );


  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      {/* <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shop by Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View> */}

      {loading.categories ? (
        <ActivityIndicator size="small" color={colors.primary.main} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryCircle}
                onPress={() => navigateToCategory(category.id)}
              >
                <Image
                  source={{ uri: category.imageUrl || 'https://via.placeholder.com/80/D4AF37/FFFFFF?text=Category' }}
                  style={styles.categoryImage}
                />
              </TouchableOpacity>
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderFeaturedProducts = () => (
    <View style={styles.featuredCoursesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Bangles</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading.featuredProducts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : !featuredProducts || featuredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💍</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No bangles available</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Check back later for new collections
          </Text>
        </View>
      ) : (
        <FlatList
          data={featuredProducts.slice(0, 6)}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.productRow}
          renderItem={({ item: product }) => (
            <TouchableOpacity
              style={[styles.courseCard, { backgroundColor: theme.colors.card }]}
              onPress={() => navigateToProductDetail(product.slug)}
            >
              <Image
                source={{ uri: product.images[0]?.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.courseImage}
              />
              <View style={styles.courseContent}>
                <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]} numberOfLines={1}>{product.specifications?.material || 'Premium Material'}</Text>
                <View style={styles.courseStats}>
                  <Text style={[styles.courseRating, { color: theme.colors.textSecondary }]}>⭐ 4.8</Text>
                  <Text style={[styles.coursePrice, { color: theme.colors.primary }]}>₹{product.sellingPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        showWishlist={true}
        showProfile={true}
        onWishlistPress={() => navigation.navigate('Wishlist')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D4AF37']}
          />
        }
      >
        {renderCategories()}
        {renderWelcomeSection()}
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    width: width,
    height: 250,
  },
  welcomeSection: {
    width: width,
    height: 250,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.3,
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bannerTitle: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
  },
  paginationContainer: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: Colors.textLight,
    width: 24,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Fonts.size.xl,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 60) / 2,
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  categoriesScroll: {
    marginHorizontal: -4,
  },
  categoryContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: Colors.card,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryTitle: {
    fontSize: Fonts.size.xs,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 80,
  },
  featuredCoursesContainer: {
    padding: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    maxWidth: '48%',
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseRating: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  coursePrice: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Shop by Price Styles
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
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: Fonts.size.xs,
    fontFamily: Fonts.bold,
  },
  // Advertisement Styles
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
    fontFamily: Fonts.bold,
    color: Colors.textLight,
    marginBottom: 8,
    letterSpacing: 1,
  },
  adSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  adCTA: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
});