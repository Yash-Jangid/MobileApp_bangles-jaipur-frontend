import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { resetPasswordWithOtp } from '../api/authApi';
import { CustomToast, ToastType } from '../components/CustomToast';

type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
    const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
    const route = useRoute<ResetPasswordScreenRouteProp>();
    const { theme } = useTheme();
    const { email, otp } = route.params;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('default');

    const showToast = (message: string, type: ToastType = 'default') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    // Password strength validation
    const passwordStrength = {
        minLength: newPassword.length >= 6,
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
    };

    const isPasswordValid = passwordStrength.minLength;
    const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    const isFormValid = isPasswordValid && doPasswordsMatch;

    const handleResetPassword = async () => {
        if (!isFormValid) {
            setError('Please ensure passwords match and meet requirements');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await resetPasswordWithOtp({ email, otp, newPassword });

            // Show success toast
            showToast('Password reset successfully!', 'success');

            // Show success message and navigate to login
            setTimeout(() => {
                Alert.alert(
                    'Success',
                    'Your password has been reset successfully. Please sign in with your new password.',
                    [
                        {
                            text: 'Sign In',
                            onPress: () => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'LoginNew' }],
                                });
                            },
                        },
                    ]
                );
            }, 500);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.lockIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                            <Lock size={32} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                            Create New Password
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Your new password must be different from previously used passwords
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* New Password */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>NEW PASSWORD</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    placeholder="Enter new password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                    {showNewPassword ? (
                                        <EyeOff size={20} color={theme.colors.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={theme.colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Password Requirements */}
                        {newPassword.length > 0 && (
                            <View style={styles.requirementsContainer}>
                                <View style={styles.requirementItem}>
                                    <CheckCircle
                                        size={16}
                                        color={passwordStrength.minLength ? '#22C55E' : theme.colors.textSecondary}
                                    />
                                    <Text style={[
                                        styles.requirementText,
                                        {
                                            color: passwordStrength.minLength ? '#22C55E' : theme.colors.textSecondary
                                        }
                                    ]}>
                                        At least 6 characters
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CONFIRM PASSWORD</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color={theme.colors.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={theme.colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Password Match Indicator */}
                        {confirmPassword.length > 0 && (
                            <View style={styles.matchIndicator}>
                                {doPasswordsMatch ? (
                                    <View style={styles.matchItem}>
                                        <CheckCircle size={16} color="#22C55E" />
                                        <Text style={[styles.matchText, { color: '#22C55E' }]}>
                                            Passwords match
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={[styles.matchText, { color: theme.colors.error }]}>
                                        Passwords don't match
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* Error Message */}
                        {error ? (
                            <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        {/* Reset Button */}
                        <TouchableOpacity
                            style={[
                                styles.resetButton,
                                {
                                    backgroundColor: isFormValid ? theme.colors.primary : theme.colors.primary,
                                    opacity: isFormValid ? 1 : 0.5,
                                }
                            ]}
                            onPress={handleResetPassword}
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.resetButtonText}>Reset Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <CustomToast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onDismiss={() => {
                    setToastVisible(false);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: 0.7,
        paddingHorizontal: 20,
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
    },
    eyeIcon: {
        padding: 8,
    },
    requirementsContainer: {
        gap: 8,
        marginTop: -12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    requirementText: {
        fontSize: 13,
        fontWeight: '500',
    },
    matchIndicator: {
        marginTop: -12,
    },
    matchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    matchText: {
        fontSize: 13,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 13,
        textAlign: 'center',
    },
    resetButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 2,
        shadowRadius: 4,
        elevation: 10,
        marginTop: 8,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default ResetPasswordScreen;
