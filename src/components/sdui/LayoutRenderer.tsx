import React from 'react';
import { View, Text } from 'react-native';
import { ComponentSection } from '../../types/sdui';
import { HeroBanner } from './HeroBanner';
import { ProductGrid } from './ProductGrid';
import { Header } from './Header';
import { CategoryCarousel } from './CategoryCarousel';

const ComponentRegistry: Record<string, React.ComponentType<any>> = {
    'HeroBanner': HeroBanner,
    'ProductGrid': ProductGrid,
    'Header': Header,
    'CategoryCarousel': CategoryCarousel,
};

export const LayoutRenderer: React.FC<{ layout: ComponentSection[] }> = ({ layout }) => {
    if (!layout || layout.length === 0) {
        return <View style={{ padding: 20 }}><Text>Empty Layout</Text></View>;
    }

    return (
        <View>
            {layout.map((section) => {
                const Component = ComponentRegistry[section.component];
                if (!Component) {
                    return (
                        <View key={section.id} style={{ padding: 20, backgroundColor: '#ffebee' }}>
                            <Text style={{ color: 'red' }}>Unknown Component: {section.component}</Text>
                        </View>
                    );
                }
                return <Component key={section.id} {...section.props} variant={section.variant} />;
            })}
        </View>
    );
};
