import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { CategoryCarouselProps } from '../../types/sdui';

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ title, categories = [] }) => {
    return (
        <View style={styles.container}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.item}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: cat.image }} style={styles.image} />
                        </View>
                        <Text style={styles.name}>{cat.name}</Text>
                        {cat.count !== undefined ? <Text style={styles.count}>{cat.count} items</Text> : null}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 12,
        color: '#333',
    },
    scrollContent: {
        paddingHorizontal: 12,
    },
    item: {
        marginHorizontal: 4,
        width: 80,
        alignItems: 'center',
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#eee',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
    count: {
        fontSize: 10,
        color: '#888',
    },
});
