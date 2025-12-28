import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Auth token management
  async setAuthToken(token: string): Promise<void> {
    try {
      if (!token) return;
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // User data management
  async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async getUserData(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }

  // Generic storage methods
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // App settings
  async setAppSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  }

  async getAppSettings(): Promise<any> {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting app settings:', error);
      return {};
    }
  }

  // JWT Token management for backend API
  async setAccessToken(token: string): Promise<void> {
    try {
      if (!token) return;
      await AsyncStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error saving access token:', error);
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('refresh_token', token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'auth_token', 'user_data']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export const storageService = new StorageService();

// Helper exports for JWT tokens (for use in API client)
export const saveAccessToken = (token: string) => storageService.setAccessToken(token);
export const getAccessToken = () => storageService.getAccessToken();
export const saveRefreshToken = (token: string) => storageService.setRefreshToken(token);
export const getRefreshToken = () => storageService.getRefreshToken();
export const clearAuthData = () => storageService.clearAuthData();
