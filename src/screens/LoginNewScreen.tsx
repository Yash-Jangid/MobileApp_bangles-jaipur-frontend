import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    StatusBar,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError, enableGuestMode } from '../store/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, ChevronRight, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const { width } = Dimensions.get('window');

interface LoginNewScreenProps {
    navigation: any;
}

export const LoginNewScreen: React.FC<LoginNewScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { loading, isAuthenticated, accessToken, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, accessToken, navigation, dispatch]);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Required', 'Please enter your credentials');
            return;
        }

        Keyboard.dismiss();
        setLocalLoading(true);
        try {
            const result = await dispatch(loginUser({ email, password }));
            if (loginUser.rejected.match(result)) {
                // Error is handled by Redux state, but we stop local loading
            }
        } catch (err) {
            console.error('Login Error:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const isFormValid = email.includes('@') && password.length >= 6;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Top Decorative Element */}
                    <View style={styles.headerDecoration}>
                        <View style={[styles.circle, { backgroundColor: theme.colors.primary + '10' }]} />
                    </View>

                    <View style={styles.header}>
                        <Text style={[styles.brandName, { color: theme.colors.primary }]}>Jaipur Bangles</Text>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Welcome back</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Sign in to continue your premium shopping experience
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>EMAIL ADDRESS</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="name@example.com"
                                    placeholderTextColor={theme.colors.textSecondary + '70'}
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.labelRow}>
                                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PASSWORD</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={[styles.forgotToken, { color: theme.colors.primary }]}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.textSecondary + '70'}
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    {showPassword ? <EyeOff size={20} color={theme.colors.textSecondary} /> : <Eye size={20} color={theme.colors.textSecondary} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                { backgroundColor: isFormValid ? theme.colors.primary : theme.colors.primary }
                            ]}
                            onPress={handleLogin}
                            disabled={localLoading || !isFormValid}
                        >
                            {localLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>Sign In</Text>
                                    <ArrowRight size={20} color="#fff" style={styles.buttonIcon} />
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>OR CONTINUE WITH</Text>
                            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                        </View>

                        <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border }]}>
                            <GoogleIcon size={20} />
                            <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>Google Account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                            New to Jaipur Bangles?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpNew')}>
                            <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <TouchableOpacity
                        style={styles.guestButton}
                        onPress={() => {
                            dispatch(enableGuestMode());
                            navigation.replace('Main');
                        }}
                    >
                        <Text style={[styles.guestText, { color: theme.colors.textSecondary }]}>Browse as Guest</Text>
                        <ChevronRight size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity> */}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        flexGrow: 1,
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
    header: {
        marginBottom: 40,
    },
    brandName: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    forgotToken: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 16,
        textAlign: 'center',
    },
    loginButton: {
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 2,
        shadowRadius: 4,
        elevation: 10,
        marginTop: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 11,
        fontWeight: '700',
        marginHorizontal: 16,
        letterSpacing: 0.5,
    },
    socialButton: {
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    signUpLink: {
        fontSize: 14,
        fontWeight: '700',
    },
    guestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    guestText: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 4,
    },
});
