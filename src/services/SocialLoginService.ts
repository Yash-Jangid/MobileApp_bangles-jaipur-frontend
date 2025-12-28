import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import apiService from './ApiService';
import { storageService } from '../utils/storage';
import socialLoginDebug from '../utils/socialLoginDebug';

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  avatar?: string;
}

export interface SocialLoginResult {
  success: boolean;
  user?: any;
  token?: string;
  isNewUser?: boolean;
  error?: string;
}

class SocialLoginService {
  private googleConfigured = false;

  /**
   * Initialize Google Sign-In
   */
  async initializeGoogleSignIn() {
    try {
      // DISABLED: Old backend API call that doesn't exist in new bangles backend
      // let configResponse;
      // try {
      //   configResponse = await apiService.getSocialConfig();
      // } catch {
      //   configResponse = await apiService.getTestSocialConfig();
      // }
      //
      // if (configResponse.success && configResponse.data?.google?.enabled) {
      //   const clientId = configResponse.data.google.client_id;
      //   if (clientId) {
      //     GoogleSignin.configure({
      //       webClientId: clientId,
      //       iosClientId: clientId,
      //       offlineAccess: true,
      //       hostedDomain: '',
      //       forceCodeForRefreshToken: true,
      //     });
      //     this.googleConfigured = true;
      //     return;
      //   }
      // }

      // Use static configuration for Google Sign-In
      const staticClientId = '847613477366-r1p21q2peft35ibp8sv3rse5mimau56k.apps.googleusercontent.com';
      GoogleSignin.configure({
        webClientId: staticClientId,
        iosClientId: staticClientId,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
      });
      this.googleConfigured = true;
    } catch (error: any) {
      try {
        const emergencyClientId = '847613477366-p6dc3f3v03p008e2o74imemjvfumq9em.apps.googleusercontent.com';
        GoogleSignin.configure({
          webClientId: emergencyClientId,
          offlineAccess: true,
          hostedDomain: '',
          forceCodeForRefreshToken: true,
          scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ],
        });
        this.googleConfigured = true;
      } catch {
        this.googleConfigured = false;
        setTimeout(() => {
          socialLoginDebug.runAllTests();
        }, 1000);
      }
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<SocialLoginResult> {
    try {
      if (!this.googleConfigured) {
        await this.initializeGoogleSignIn();
      }

      if (!this.googleConfigured) {
        throw new Error('Google Sign-In configuration failed');
      }

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      let userInfo;
      try {
        userInfo = await GoogleSignin.signIn();
      } catch (signInError: any) {
        throw signInError;
      }

      let user, tokens;
      if (userInfo.data?.user) {
        user = userInfo.data.user;
        tokens = userInfo.data;
      } else if ((userInfo as any).user) {
        user = (userInfo as any).user;
        tokens = userInfo;
      } else {
        throw new Error('No user data received from Google');
      }

      const tokenToSend = (tokens as any)?.idToken || (tokens as any)?.accessToken || '';
      if (!tokenToSend) {
        throw new Error('No valid token received from Google');
      }

      const socialUser: SocialUser = {
        id: user.id,
        email: user.email,
        name: user.name || '',
        accessToken: tokenToSend,
        avatar: user.photo || undefined,
      };

      const response = await apiService.googleLogin({
        email: socialUser.email,
        name: socialUser.name,
        id: socialUser.id,
        access_token: socialUser.accessToken,
      });

      if (response.success && response.data) {
        if (response.data.user) {
          await storageService.setUserData(response.data.user);
        }
        if (response.data.token) {
          await storageService.setAuthToken(response.data.token);
        }
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          isNewUser: response.data.is_new_user,
        };
      } else {
        const errorMsg = response.message || response.error || 'Google login failed';
        return {
          success: false,
          error: errorMsg,
        };
      }
    } catch (error: any) {
      let errorMessage = 'Google login failed';

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Google login was cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Google login is already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available';
      } else if (error.code === '10' || error.message?.includes('DEVELOPER_ERROR')) {
        errorMessage =
          `Google Sign-In configuration error. Please check:\n1. SHA-1 fingerprint: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25\n2. Package name: com.eduriseapp\n3. Client ID: 847613477366-p6dc3f3v03p008e2o74imemjvfumq9em.apps.googleusercontent.com\n\nGo to Google Console → APIs & Services → Credentials → Your OAuth 2.0 Client ID → Add SHA-1 fingerprint`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        setTimeout(() => {
          socialLoginDebug.runAllTests();
        }, 1000);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Sign out from Google
   */
  async signOutFromGoogle() {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Optionally handle sign-out error silently
    }
  }

  /**
   * Check if user is signed in with Google
   */
  async isGoogleSignedIn(): Promise<boolean> {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get current Google user
   */
  async getCurrentGoogleUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch {
      return null;
    }
  }

  /**
   * Initialize all social login services
   * Call this method in App.tsx or main component
   */
  async initializeAll() {
    try {
      await this.initializeGoogleSignIn();
    } catch {
      await socialLoginDebug.runAllTests();
    }
  }
}

export const socialLoginService = new SocialLoginService();
export default socialLoginService;
