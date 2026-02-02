import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { HeroBannerProps } from '../../types/sdui';

const { width } = Dimensions.get('window');

export const HeroBanner: React.FC<HeroBannerProps> = ({ slides, variant = 'Slider' }) => {
    if (variant === 'Static' && slides.length > 0) {
        const slide = slides[0];
        return (
            <View style={styles.container}>
                <Image source={{ uri: slide.image }} style={styles.image} />
                <View style={styles.overlay}>
                    <Text style={styles.title}>{slide.title}</Text>
                    {slide.subtitle ? <Text style={styles.subtitle}>{slide.subtitle}</Text> : null}
                    {slide.ctaText ? (
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>{slide.ctaText}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.sliderContainer}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Image source={{ uri: slide.image }} style={styles.image} />
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{slide.title}</Text>
                            {slide.subtitle ? <Text style={styles.subtitle}>{slide.subtitle}</Text> : null}
                            {slide.ctaText ? (
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>{slide.ctaText}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 300, width: '100%' },
    sliderContainer: { height: 300 },
    slide: { width, height: 300 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    subtitle: { color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center' },
    button: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
    buttonText: { color: 'black', fontWeight: 'bold' },
});
