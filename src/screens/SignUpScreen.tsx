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
  ImageBackground,
  Dimensions,
  StatusBar,
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

const { width, height } = Dimensions.get('window');

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
        navigation.navigate('Main');
      } else {
        Alert.alert('Sign Up Failed', result.error || 'Failed to sign up with Google');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1549558549-415fe441b94c?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000000']}
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >

              <View style={styles.headerArea}>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoIcon}>💎</Text>
                </View>
                <Text style={styles.brandTitle}>JAIPUR BANGLES</Text>
                <Text style={styles.brandSubtitle}>Start Your Journey</Text>
              </View>

              <View style={styles.formCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.welcomeText}>Create Account</Text>
                  <TouchableOpacity onPress={handleGuestMode}>
                    <Text style={styles.guestLink}>Skip ›</Text>
                  </TouchableOpacity>
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Create a password"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={{ color: '#fff', opacity: 0.7 }}>{showPassword ? 'Hide' : 'Show'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Confirm password"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Text style={{ color: '#fff', opacity: 0.7 }}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textLight} />
                  ) : (
                    <LinearGradient
                      colors={[Colors.primary, '#D4AF37']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.primaryButtonText}>Sign Up</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerSection}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.line} />
                </View>

                <View style={styles.socialRow}>
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={handleGoogleSignUp}
                  >
                    <GoogleIcon size={22} />
                    <Text style={styles.socialBtnText}>Google</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)', // Goldish border
  },
  logoIcon: {
    fontSize: 28,
  },
  brandTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#D4AF37', // Gold color
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.85)', // Dark translucent card
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: '#fff',
  },
  guestLink: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#D4AF37',
  },
  errorContainer: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.5)',
  },
  errorText: {
    color: '#ffcdd2',
    fontSize: 13,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 16,
  },
  inputWrapper: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#fff',
    padding: 0,
    margin: 0,
    height: 24,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 24,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff', // Dark text on gold button for contrast
    fontFamily: Fonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 12,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 10,
  },
  socialBtnText: {
    color: '#000',
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  footerLink: {
    color: '#D4AF37',
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
});
