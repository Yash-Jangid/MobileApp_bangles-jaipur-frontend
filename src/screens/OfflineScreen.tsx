import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAppSelector } from '../store/hooks';

const { width } = Dimensions.get('window');

interface OfflineScreenProps {
    onRetry?: () => void;
    errorType?: 'offline' | 'service_unavailable';
    errorMessage?: string;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({
    onRetry,
    errorType = 'offline',
    errorMessage
}) => {
    const { theme } = useTheme();
    const { isOffline, isServiceUnavailable } = useAppSelector((state) => state.appSettings);

    const type = errorType || (isOffline ? 'offline' : 'service_unavailable');

    const content = {
        offline: {
            title: 'No Connection',
            subtitle: 'Please check your internet connectivity and try again.',
            icon: <WifiOff size={40} color={theme.colors.primary} />,
        },
        service_unavailable: {
            title: 'Service Unavailable',
            subtitle: 'Our servers are currently unreachable. We are working to restore service.',
            icon: <AlertTriangle size={40} color={theme.colors.error} />,
        },
    };

    const currentContent = content[type] || content.offline;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.headerDecoration}>
                <View style={[styles.circle, { backgroundColor: theme.colors.primary + '10' }]} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {currentContent.icon}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.brandName, { color: theme.colors.primary }]}>Jaipur Bangles</Text>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{currentContent.title}</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {errorMessage || currentContent.subtitle}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={onRetry}
                >
                    <RefreshCw size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerDecoration: {
        position: 'absolute',
        top: -50,
        right: -50,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 40,
        padding: 30,
        borderRadius: 100,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    brandName: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    retryButton: {
        height: 56,
        width: '100%',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonIcon: {
        marginRight: 10,
    },
    footer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});
