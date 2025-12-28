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
import { CustomHeader } from '../components/CustomHeader';
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
    }, 3000); // Change slide every 3 seconds

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

  const navigateToCategory = (categoryId: number) => {
    // Navigate to collections screen with category filter
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
      return null; // Don't show banner section if no banners
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

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Links</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Collections')}
        >
          <Text style={styles.quickActionIcon}>🛍️</Text>
          <Text style={styles.quickActionText}>Shop by Category</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.quickActionIcon}>🛒</Text>
          <Text style={styles.quickActionText}>View Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.quickActionIcon}>📦</Text>
          <Text style={styles.quickActionText}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shop by Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading.categories ? (
        <ActivityIndicator size="small" color={colors.primary.main} />
      ) : categories.length === 0 ? (
        <Text style={styles.emptySubtitle}>No categories found</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigateToCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>
                {/* Use a default icon if image is missing, or map category names to icons */}
                {category.imageUrl ? '🖼️' : '✨'}
              </Text>
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>{category.name}</Text>
            </TouchableOpacity>
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
        featuredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
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
              <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]}>{product.specifications?.material || 'Premium Material'}</Text>
              <View style={styles.courseStats}>
                {/* Rating is not in product type yet, using static or removing */}
                <Text style={[styles.courseRating, { color: theme.colors.textSecondary }]}>⭐ 4.8</Text>
                <Text style={[styles.coursePrice, { color: theme.colors.primary }]}>₹{product.sellingPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title="Jaipur Bangles" />

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
      >  {renderWelcomeSection()}
        {renderQuickActions()}
        {renderCategories()}
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
    marginBottom: 16,
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
  categoryCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    minWidth: 100,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  featuredCoursesContainer: {
    padding: 20,
  },
  courseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
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
});