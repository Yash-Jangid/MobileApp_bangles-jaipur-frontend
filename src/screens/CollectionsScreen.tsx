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
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';

const { width } = Dimensions.get('window');

export const CollectionsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { products, categories, loading } = useAppSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(route.params?.categoryId || null);

  useEffect(() => {
    // Fetch categories if not loaded
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    // Fetch products when selected category changes or initially
    loadProducts();
  }, [dispatch, selectedCategory]);

  const loadProducts = () => {
    dispatch(fetchProducts({
      categoryId: selectedCategory || undefined,
      limit: 20
    }));
  };

  const handleCategoryPress = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const navigateToProduct = (slug: string) => {
    navigation.navigate('ProductDetails', { slug });
  };

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === null && styles.filterChipSelected,
          ]}
          onPress={() => handleCategoryPress(null)}
        >
          <Text style={[
            styles.filterText,
            selectedCategory === null && styles.filterTextSelected,
          ]}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              selectedCategory === category.id && styles.filterChipSelected,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={[
              styles.filterText,
              selectedCategory === category.id && styles.filterTextSelected,
            ]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProduct(item.slug)}
    >
      <Image
        source={{ uri: item.images[0]?.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.sellingPrice}</Text>
        {item.discount > 0 && (
          <Text style={styles.productOriginalPrice}>₹{item.mrp}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Collections" showBackButton onBackPress={() => navigation.goBack()} />

      {renderCategoryFilter()}

      {loading.products ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>No products found in this category.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray100,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  filterChipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.secondary,
  },
  filterTextSelected: {
    color: colors.neutral.white,
  },
  productList: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 40) / 2,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  productOriginalPrice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
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
    marginTop: 50,
  },
});
