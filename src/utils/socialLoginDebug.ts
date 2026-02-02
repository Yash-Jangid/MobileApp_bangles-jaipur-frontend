import { GoogleSignin } from '@react-native-google-signin/google-signin';
import apiService from '../services/ApiService';

/**
 * Debug utility for social login troubleshooting
 */
export const socialLoginDebug = {
  /**
   * Test Google Sign-In configuration
   */
  async testGoogleConfiguration() {
    console.log('=== Google Sign-In Configuration Test ===');
    
    try {
      // Test 1: Check if GoogleSignin is available
      console.log('1. GoogleSignin available:', !!GoogleSignin);
      
      // Test 2: Check current configuration
      const currentUser = await GoogleSignin.getCurrentUser();
      const isSignedIn = !!currentUser;
      console.log('2. Currently signed in:', isSignedIn);
      
      // Test 3: Log current user details (if signed in)
      if (isSignedIn) {
        console.log('3. Current user:', currentUser?.user?.email || 'No user data');
      } else {
        console.log('3. No current user (not signed in)');
      }
      
      // Test 4: Test social config API
      console.log('4. Testing social config API...');
      const configResponse = await apiService.getSocialConfig();
      console.log('4a. Config API response:', configResponse);
      
      if (configResponse.success) {
        console.log('4b. Google enabled:', configResponse.data?.google?.enabled);
        console.log('4c. Google client ID available:', !!configResponse.data?.google?.client_id);
        console.log('4d. Facebook enabled:', configResponse.data?.facebook?.enabled);
        console.log('4e. Facebook app ID available:', !!configResponse.data?.facebook?.app_id);
      }
      
      console.log('=== Google Sign-In Configuration Test Complete ===');
      return true;
    } catch (error) {
      console.error('=== Google Sign-In Configuration Test Failed ===');
      console.error('Error:', error);
      return false;
    }
  },

  /**
   * Test API endpoints accessibility
   */
  async testApiEndpoints() {
    console.log('=== API Endpoints Test ===');
    
    const endpoints = [
      '/mobile/social-config',
      '/mobile/google-login',
      '/mobile/facebook-login',
      '/config'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint}...`);
        const response = await apiService.request(endpoint, { method: 'GET' });
        console.log(`${endpoint} - Success:`, response.success);
        if (!response.success) {
          console.log(`${endpoint} - Error:`, response.error || response.message);
        }
      } catch (error) {
        console.error(`${endpoint} - Exception:`, error);
      }
    }
    
    console.log('=== API Endpoints Test Complete ===');
  },

  /**
   * Run all debug tests
   */
  async runAllTests() {
    console.log('🔍 Starting Social Login Debug Tests...');
    
    await this.testGoogleConfiguration();
    await this.testApiEndpoints();
    
    console.log('🔍 Social Login Debug Tests Complete');
  }
};

export default socialLoginDebug;
