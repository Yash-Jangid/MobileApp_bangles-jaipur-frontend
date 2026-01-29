import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'default';

interface CustomToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss: () => void;
    duration?: number;
}

export const CustomToast: React.FC<CustomToastProps> = ({
    visible,
    message,
    type = 'default',
    actionLabel,
    onAction,
    onDismiss,
    duration = 4000,
}) => {
    const { theme } = useTheme();
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const [show, setShow] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShow(true);
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-hide logic
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShow(false);
            if (visible) {
                onDismiss();
            }
        });
    };

    if (!show) return null;

    const getIcon = () => {
        const iconSize = 20;
        switch (type) {
            case 'success':
                return <CheckCircle2 size={iconSize} color={theme.colors.success} />;
            case 'error':
                return <AlertCircle size={iconSize} color={theme.colors.error} />;
            case 'info':
                return <Info size={iconSize} color={theme.colors.info} />;
            default:
                return null;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return theme.colors.surface;
            case 'error':
                return theme.colors.surface;
            case 'info':
                return theme.colors.surface;
            default:
                return theme.colors.surface;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return theme.colors.success;
            case 'error':
                return theme.colors.error;
            case 'info':
                return theme.colors.info;
            default:
                return theme.colors.border;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderLeftWidth: type !== 'default' ? 4 : 1,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {getIcon()}
                </View>
                <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
                    {message}
                </Text>
            </View>

            <View style={styles.actions}>
                {actionLabel && (
                    <TouchableOpacity onPress={onAction} style={styles.actionButton}>
                        <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                            {actionLabel.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                    <X size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 90 : 70,
        left: 20,
        right: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        // Modern shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 9999,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
});

