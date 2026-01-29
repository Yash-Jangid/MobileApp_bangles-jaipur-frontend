import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { verifyOtp, forgotPassword } from '../api/authApi';
import { CustomToast, ToastType } from '../components/CustomToast';

type VerifyOTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyOTP'>;
type VerifyOTPScreenRouteProp = RouteProp<RootStackParamList, 'VerifyOTP'>;

const VerifyOTPScreen = () => {
    const navigation = useNavigation<VerifyOTPScreenNavigationProp>();
    const route = useRoute<VerifyOTPScreenRouteProp>();
    const { theme } = useTheme();
    const { email } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<Array<TextInput | null>>([]);
    const hasSubmitted = useRef(false); // Track if OTP has been auto-submitted

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('default');

    const showToast = (message: string, type: ToastType = 'default') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Auto-submit when all digits are entered (only once)
    useEffect(() => {
        const otpString = otp.join('');
        // Only auto-submit if: 6 digits entered, not loading, and hasn't been submitted yet
        if (otpString.length === 6 && !loading && !hasSubmitted.current) {
            hasSubmitted.current = true; // Mark as submitted to prevent multiple calls
            handleVerifyOTP();
        }
        // Reset submission flag when OTP is cleared (e.g., after error)
        if (otpString.length === 0) {
            hasSubmitted.current = false;
        }
    }, [otp, loading]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyOtp({ email, otp: otpString });
            showToast('OTP verified successfully', 'success');
            // Navigate to reset password screen with a small delay
            setTimeout(() => {
                navigation.navigate('ResetPassword', { email, otp: otpString });
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
            showToast('Verification failed', 'error');
            // Clear OTP inputs on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            hasSubmitted.current = false; // Reset on error so user can re-submit
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');

        try {
            await forgotPassword({ email });
            showToast('New OTP sent to your email', 'info');
            setTimer(600);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP. Please try again.');
            showToast('Failed to resend OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const maskEmail = (email: string) => {
        const [username, domain] = email.split('@');
        if (username.length <= 2) return email;
        const masked = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
        return `${masked}@${domain}`;
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
                        <View style={[styles.emailIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                            <Mail size={32} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                            Verify Your Email
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            We've sent a 6-digit code to{'\n'}
                            <Text style={{ fontWeight: '600' }}>{maskEmail(email)}</Text>
                        </Text>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[
                                    styles.otpInput,
                                    {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.textPrimary,
                                        borderColor: digit ? theme.colors.primary : theme.colors.border,
                                        borderWidth: digit ? 2 : 1,
                                    }
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                editable={!loading}
                            />
                        ))}
                    </View>

                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <Text style={[styles.timerText, { color: timer <= 60 ? theme.colors.error : theme.colors.textSecondary }]}>
                            {timer > 0 ? `Code expires in ${formatTime(timer)}` : 'Code expired'}
                        </Text>
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>
                            {error}
                        </Text>
                    ) : null}

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            {
                                backgroundColor: otp.join('').length === 6 ? theme.colors.primary : theme.colors.primary,
                                opacity: otp.join('').length === 6 ? 1 : 0.5,
                            }
                        ]}
                        onPress={handleVerifyOTP}
                        disabled={loading || otp.join('').length !== 6}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.verifyButtonText}>Verify Code</Text>
                        )}
                    </TouchableOpacity>

                    {/* Resend OTP */}
                    <View style={styles.resendContainer}>
                        <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                            Didn't receive the code?{' '}
                        </Text>
                        <TouchableOpacity onPress={handleResendOTP} disabled={!canResend || loading}>
                            <Text style={[
                                styles.resendLink,
                                {
                                    color: canResend ? theme.colors.primary : theme.colors.textSecondary,
                                    opacity: canResend ? 1 : 0.5,
                                }
                            ]}>
                                Resend
                            </Text>
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
        alignItems: 'center',
        marginBottom: 40,
    },
    emailIconContainer: {
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
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        opacity: 0.7,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    otpInput: {
        width: 50,
        height: 60,
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        borderWidth: 1,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 13,
        marginBottom: 16,
        textAlign: 'center',
    },
    verifyButton: {
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
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default VerifyOTPScreen;
