import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { LayoutRenderer } from '../components/sdui/LayoutRenderer';
import { PageConfigService } from '../api/pageConfig';
import { PageResponse } from '../types/sdui';

export const DynamicPageScreen: React.FC = () => {
    const [pageConfig, setPageConfig] = useState<PageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPage();
    }, []);

    const loadPage = async () => {
        try {
            setLoading(true);
            // Hardcoded 'home' slug for now, would be dynamic based on navigation
            const data = await PageConfigService.fetchPageBySlug('home');
            setPageConfig(data);
        } catch (err) {
            setError('Failed to load page content.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!pageConfig) {
        return (
            <View style={styles.center}>
                <Text>No content available.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <LayoutRenderer layout={pageConfig.layout} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
});
