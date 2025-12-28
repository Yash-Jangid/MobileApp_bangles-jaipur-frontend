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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { enableGuestMode, loginUser, clearError } from '../store/slices/authSlice';
import socialLoginService from '../services/SocialLoginService';
import { GoogleIcon } from '../components/icons/GoogleIcon';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, token, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);


  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      console.log('🔵 [LoginScreen] Starting login process...');

      // Dispatch the login action
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        console.log('✅ [LoginScreen] Login successful, user authenticated');
        // Explicitly navigate to Main and reset stack to prevent going back to Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else if (loginUser.rejected.match(result)) {
        console.error('❌ [LoginScreen] Login failed:', result.payload);
        // Error is already handled by Redux and will be shown to user
      }
    } catch (error) {
      console.error('❌ [LoginScreen] Login exception:', error);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('WebView', { route: 'forgot-password' });
  };

  const handleRegister = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = async () => {
    console.log('🔵 [LoginScreen] Google login initiated');
    setGoogleLoading(true);
    setGoogleError(null);

    try {
      const result = await socialLoginService.signInWithGoogle();

      if (result.success && result.user) {
        console.log('✅ [LoginScreen] Google login successful:', {
          email: result.user.email,
          name: result.user.name
        });

        // Navigate to main app or handle success
        navigation.navigate('Main');
      } else {
        const errorMsg = result.error || 'Google login failed. Please try again.';
        console.error('❌ [LoginScreen] Google login failed:', errorMsg);
        setGoogleError(errorMsg);

        // Show user-friendly error
        Alert.alert(
          'Login Failed',
          errorMsg,
          [
            { text: 'Try Again', onPress: () => setGoogleError(null) }
          ]
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred during Google login';
      console.error('❌ [LoginScreen] Google login exception:', error);
      setGoogleError(errorMessage);

      // Show user-friendly error
      Alert.alert('Login Error', 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };



  const handleGuestMode = () => {
    dispatch(enableGuestMode());
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={Platform.OS === 'ios' ? styles.headerSectionIOS : styles.headerSectionAndroid}
          >
            <View style={styles.headerGuestButtonContainer}>
              <TouchableOpacity
                style={styles.headerGuestButton}
                onPress={handleGuestMode}
                disabled={loading}
              >
                <Text style={styles.headerGuestButtonText}>Guest</Text>
              </TouchableOpacity>
            </View>



            <View style={styles.headerContent}>
              <Text style={styles.logoText}>Edurise</Text>
              <Text style={styles.taglineText}>Learn. Grow. Succeed.</Text>
            </View>
          </LinearGradient>

          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue your learning journey</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeButtonText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textLight} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Login Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    // Clear error by dispatching clearError action
                    dispatch(clearError());
                  }}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  googleLoading && styles.disabledButton
                ]}
                onPress={handleGoogleLogin}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={[styles.socialButtonText, { marginLeft: 8 }]}>Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <GoogleIcon size={20} />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity
              style={styles.socialButton}
              onPress={handleFacebookLogin}
              disabled={loading}
            >
              <Text style={styles.socialButtonIcon}>📘</Text>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity> */}
            </View>

            {/* Error Display */}
            {googleError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{googleError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    setGoogleError(null);
                    handleGoogleLogin();
                  }}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister} disabled={loading}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gradientStart,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSectionIOS: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    position: 'relative',
  },
  headerSectionAndroid: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGuestButtonContainer: {
    flex: 1,
    width: '90%',
    maxHeight: '50%',
  },
  headerGuestButton: {
    alignSelf: 'flex-end',
    // position: 'absolute',
    // top: Platform.OS === 'ios' ? 70 : 70,
    // right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '20%',
  },
  headerGuestButtonText: {
    color: Colors.textLight,
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  logoText: {
    fontSize: Fonts.size.huge,
    fontFamily: Fonts.bold,
    color: Colors.textLight,
    marginBottom: 8,
  },
  taglineText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    opacity: 0.9,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: Fonts.size.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  socialButtonIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  registerText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  errorContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginHorizontal: 20,
  },

  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },

  retryButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  debugContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },

  debugToggle: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },

  debugText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  diagnosticButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },

  diagnosticButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});