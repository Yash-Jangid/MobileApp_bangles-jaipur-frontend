import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ProductGridProps } from '../../types/sdui';

export const ProductGrid: React.FC<ProductGridProps> = ({ title, products = [], limit = 4 }) => {
    const displayProducts = products.slice(0, limit);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}><Text>No Img</Text></View>
                )}
            </View>
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.name || 'Product Name'}</Text>
                <Text style={styles.category}>{item.category || 'Category'}</Text>
                <Text style={styles.price}>${item.price || '99.00'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

            {/* 
        Note: Using explicit columns for grid layout basics. 
        For a true Masonry or robust grid, we might use libraries, 
        but 2-column FlatList is standard.
      */}
            <FlatList
                data={displayProducts}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false} // Assuming this is nested in a ScrollView
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
    row: { justifyContent: 'space-between' },
    card: { width: '48%', marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
    imageContainer: { height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden', backgroundColor: '#eee' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    details: { padding: 12 },
    name: { fontSize: 14, fontWeight: '600', color: '#333' },
    category: { fontSize: 12, color: '#888', marginTop: 4 },
    price: { fontSize: 14, fontWeight: 'bold', color: '#000', marginTop: 8 },
});
