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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { forgotPassword } from '../api/authApi';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSendOTP = async () => {
        if (!isEmailValid) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await forgotPassword({ email });
            // Navigate to OTP verification screen
            navigation.navigate('VerifyOTP', { email });
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
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
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                            Forgot Password?
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Enter your email address and we'll send you a code to reset your password
                        </Text>
                    </View>

                    {/* Email Input */}
                    <View style={styles.formContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
                            <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.colors.textPrimary }]}
                                placeholder="Email address"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        {/* Send OTP Button */}
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { backgroundColor: isEmailValid ? theme.colors.primary : theme.colors.primary }
                            ]}
                            onPress={handleSendOTP}
                            disabled={loading || !isEmailValid}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.sendButtonText}>Send OTP</Text>
                            )}
                        </TouchableOpacity>

                        {/* Back to Login */}
                        <TouchableOpacity
                            style={styles.backToLoginButton}
                            onPress={() => navigation.navigate('LoginNew')}
                        >
                            <Text style={[styles.backToLoginText, { color: theme.colors.textSecondary }]}>
                                Remember your password?{' '}
                                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                                    Sign In
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 20,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.7,
    },
    formContainer: {
        gap: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
    },
    errorText: {
        fontSize: 13,
        marginTop: -8,
        marginLeft: 4,
    },
    sendButton: {
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
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    backToLoginButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    backToLoginText: {
        fontSize: 14,
    },
});

export default ForgotPasswordScreen;
