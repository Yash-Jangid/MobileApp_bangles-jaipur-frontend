import React, { useState } from 'react';
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
import apiService from '../services/ApiService';
import { storageService } from '../utils/storage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { enableGuestMode, registerUser, clearError } from '../store/slices/authSlice';
import socialLoginService from '../services/SocialLoginService';
import { GoogleIcon } from '../components/icons/GoogleIcon';

interface SignUpScreenProps {
  navigation: any;
  onSignUpSuccess?: (user: any) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  navigation,
  onSignUpSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGuestMode = () => {
    dispatch(enableGuestMode());
    navigation.navigate('Main');
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return false;
    }

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

    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your password');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      console.log('🔵 [SignUpScreen] Starting registration process...');

      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use first name as last if only one name

      // Dispatch the register action
      const result = await dispatch(registerUser({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }));

      if (registerUser.fulfilled.match(result)) {
        console.log('✅ [SignUpScreen] Registration successful');
        Alert.alert(
          'Success',
          'Account created successfully! You are now logged in.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onSignUpSuccess && result.payload.user) {
                  onSignUpSuccess(result.payload.user);
                } else {
                  // Navigate to main app
                  navigation.replace('Main');
                }
              },
            },
          ]
        );
      } else if (registerUser.rejected.match(result)) {
        console.error('❌ [SignUpScreen] Registration failed:', result.payload);
        Alert.alert('Registration Failed', result.payload as string || 'Failed to create account');
      }
    } catch (error) {
      console.error('❌ [SignUpScreen] Registration exception:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await socialLoginService.signInWithGoogle();

      if (result.success && result.token) {
        if (result.isNewUser) {
          Alert.alert('Welcome!', 'Your account has been created successfully with Google!', [
            {
              text: 'OK',
              onPress: () => {
                if (onSignUpSuccess && result.user) {
                  onSignUpSuccess(result.user);
                } else {
                  navigation.navigate('Main');
                }
              },
            },
          ]);
        } else {
          Alert.alert('Welcome Back!', 'You have been logged in successfully!', [
            {
              text: 'OK',
              onPress: () => {
                if (onSignUpSuccess && result.user) {
                  onSignUpSuccess(result.user);
                } else {
                  navigation.navigate('Main');
                }
              },
            },
          ]);
        }
      } else {
        Alert.alert('Google Sign Up Failed', result.error || 'Failed to sign up with Google');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await socialLoginService.signInWithFacebook();

      if (result.success && result.token) {
        if (result.isNewUser) {
          Alert.alert('Welcome!', 'Your account has been created successfully with Facebook!', [
            {
              text: 'OK',
              onPress: () => {
                if (onSignUpSuccess && result.user) {
                  onSignUpSuccess(result.user);
                } else {
                  navigation.navigate('Main');
                }
              },
            },
          ]);
        } else {
          Alert.alert('Welcome Back!', 'You have been logged in successfully!', [
            {
              text: 'OK',
              onPress: () => {
                if (onSignUpSuccess && result.user) {
                  onSignUpSuccess(result.user);
                } else {
                  navigation.navigate('Main');
                }
              },
            },
          ]);
        }
      } else {
        Alert.alert('Facebook Sign Up Failed', result.error || 'Failed to sign up with Facebook');
      }
    } catch (error) {
      console.error('Facebook sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Facebook. Please try again.');
    }
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
            {/* Guest Mode Button - Top Right */}
            <TouchableOpacity
              style={styles.headerGuestButton}
              onPress={handleGuestMode}
              disabled={loading}
            >
              <Text style={styles.headerGuestButtonText}>Guest</Text>
            </TouchableOpacity>

            {/* Main Header Content */}
            <View style={styles.headerContent}>
              <Text style={styles.logoText}>Edurise</Text>
              <Text style={styles.taglineText}>Learn. Grow. Succeed.</Text>
            </View>
          </LinearGradient>

          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Join us and start your learning journey today</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading}
              />
            </View>

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
                  autoComplete="password-new"
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Confirm your password"
                  placeholderTextColor={Colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeButtonText}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textLight} size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}
                disabled={loading}
              >
                <GoogleIcon size={20} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
              style={styles.socialButton}
              onPress={handleFacebookSignUp}
              disabled={loading}
            >
              <Text style={styles.socialButtonIcon}>📘</Text>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity> */}
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 24,
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
  headerGuestButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 70,
    right: 20,
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
  signUpButton: {
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
  signUpButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  loginText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
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
});
