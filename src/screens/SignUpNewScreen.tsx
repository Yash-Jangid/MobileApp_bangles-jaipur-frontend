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
import { registerUser, clearError, enableGuestMode } from '../store/slices/authSlice';
import { User, Mail, Lock, Eye, EyeOff, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const { width } = Dimensions.get('window');

interface SignUpNewScreenProps {
    navigation: any;
}

export const SignUpNewScreen: React.FC<SignUpNewScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { loading, isAuthenticated, accessToken, error } = useAppSelector((state) => state.auth);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleSignUp = async () => {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Required', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        Keyboard.dismiss();
        setLocalLoading(true);
        try {
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || firstName;

            const result = await dispatch(registerUser({
                firstName,
                lastName,
                email: email.trim().toLowerCase(),
                password: password.trim(),
            }));

            if (registerUser.fulfilled.match(result)) {
                // Success handled by useEffect redirection
            }
        } catch (err) {
            console.error('Signup Error:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const isFormValid = fullName.trim().length >= 2 && email.includes('@') && password.length >= 6 && password === confirmPassword;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={28} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <Text style={[styles.brandName, { color: theme.colors.primary }]}>Jaipur Bangles</Text>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Join our exclusive club for timeless handcrafted elegance
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>FULL NAME</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor={theme.colors.textSecondary + '70'}
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

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
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PASSWORD</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Minimum 6 characters"
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

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CONFIRM PASSWORD</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Re-enter password"
                                    placeholderTextColor={theme.colors.textSecondary + '70'}
                                    style={[styles.input, { color: theme.colors.textPrimary }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={true}
                                />
                            </View>
                        </View>

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.signUpButton,
                                { backgroundColor: isFormValid ? theme.colors.primary : theme.colors.primary }
                            ]}
                            onPress={handleSignUp}
                            disabled={localLoading || !isFormValid}
                        >
                            {localLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.signUpButtonText}>Create Account</Text>
                                    <ArrowRight size={20} color="#fff" style={styles.buttonIcon} />
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>OR SIGN UP WITH</Text>
                            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                        </View>

                        <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border }]}>
                            <GoogleIcon size={20} />
                            <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>Google Account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginNew')}>
                            <Text style={[styles.signInLink, { color: theme.colors.primary }]}>Sign In</Text>
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
    topBar: {
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    backButton: {
        padding: 8,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
        flexGrow: 1,
    },
    header: {
        marginBottom: 32,
    },
    brandName: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 16,
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
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
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
    signUpButton: {
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
    signUpButtonText: {
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
    signInLink: {
        fontSize: 14,
        fontWeight: '700',
    },
});
