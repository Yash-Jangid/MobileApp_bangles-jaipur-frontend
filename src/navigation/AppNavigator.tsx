import { Text, Image, Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
import { useAppSelector } from '../store/hooks';
import { Home, Grid, ShoppingCart, User, Heart } from 'lucide-react-native';

// Enable screens for better performance
enableScreens();

import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { LoginNewScreen } from '../screens/LoginNewScreen';
import { SignUpNewScreen } from '../screens/SignUpNewScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CollectionsScreen } from '../screens/CollectionsScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { WebViewScreen } from '../components/WebViewScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import WishlistScreen from '../screens/WishlistScreen';
import { OfflineScreen } from '../screens/OfflineScreen';
import { ConnectivityManager } from '../components/ConnectivityManager';
import { useAppDispatch } from '../store/hooks';
import NetInfo from '@react-native-community/netinfo';
import { setOffline, setServiceUnavailable } from '../store/slices/appSettingsSlice';

// Types
import { RootStackParamList, TabParamList } from '../types/navigation';
import { Colors } from '../common/colors';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator = () => {
  const { theme, themeId } = useTheme();

  // Check if white-shine-jewelry theme for custom tabs
  const isWhiteShine = themeId === 'white-shine-jewelry';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: theme.typography.caption.fontFamily,
          fontSize: 10,
        },
        tabBarStyle: {
          display: theme.layout.showBottomTabs ? 'flex' : 'none',
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.layout.showBottomTabs ? (Platform.OS === 'android' ? 60 : 80) : 0,
          paddingBottom: theme.layout.showBottomTabs ? (Platform.OS === 'android' ? 8 : 20) : 0,
          borderTopWidth: theme.layout.showBottomTabs ? 1 : 0, // Ensure border is hidden too
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Home size={24} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{
          tabBarLabel: isWhiteShine ? 'Categories' : 'Collections',
          tabBarIcon: ({ focused, color }) => (
            <Grid size={24} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />

      {/* Show Wishlist for white-shine-jewelry, Cart for others */}
      {
        isWhiteShine ? (
          <Tab.Screen
            name="Wishlist"
            component={WishlistScreen}
            options={{
              tabBarLabel: 'Wishlist',
              tabBarIcon: ({ focused, color }) => (
                <Heart size={24} color={color} fill={focused ? color : 'none'} />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarLabel: 'Cart',
              tabBarIcon: ({ focused, color }) => (
                <ShoppingCart size={24} color={color} fill={focused ? color : 'none'} />
              ),
            }}
          />
        )
      }

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <User size={24} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />
    </Tab.Navigator >
  );
};

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, accessToken, isGuestMode } = useAppSelector((state) => state.auth);
  const { isOffline, isServiceUnavailable } = useAppSelector((state) => state.appSettings);

  const handleRetry = async () => {
    // 1. Check network again
    const state = await NetInfo.fetch();
    const stillOffline = state.isConnected === false || state.isInternetReachable === false;
    dispatch(setOffline(stillOffline));

    // 2. Reset service unavailability (circuit breaker)
    // This allows the next request to attempt closure if the circuit timeout expired
    dispatch(setServiceUnavailable(false));
  };

  return (
    <NavigationContainer
      fallback={<Text>Loading...</Text>}
    >
      <ConnectivityManager />

      {isOffline || isServiceUnavailable ? (
        <OfflineScreen
          errorType={isOffline ? 'offline' : 'service_unavailable'}
          onRetry={handleRetry}
        />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
          initialRouteName={(isAuthenticated && (token || accessToken)) || isGuestMode ? "Main" : "LoginNew"}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={LoginNewScreen} />
          <Stack.Screen name="SignUp" component={SignUpNewScreen} />
          <Stack.Screen name="LoginNew" component={LoginNewScreen} />
          <Stack.Screen name="SignUpNew" component={SignUpNewScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />

          {/* Main App */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* E-Commerce Screens */}
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />

          {/* Profile & Utility Screens */}
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // iOS Tab Bar Styles
  tabBarIOS: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    paddingTop: 8,
    paddingBottom: 34, // Extra padding for iOS home indicator
    height: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0,
  },

  // Android Tab Bar Styles
  tabBarAndroid: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 64,
    elevation: 8,
  },

  // iOS Tab Label Styles
  tabLabelIOS: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  // Android Tab Label Styles
  tabLabelAndroid: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // iOS Tab Icon Styles
  tabIconIOS: {
    marginBottom: 2,
  },

  // Android Tab Icon Styles
  tabIconAndroid: {
    marginBottom: 0,
  },

  // iOS Tab Item Styles
  tabItemIOS: {
    paddingTop: 8,
    paddingBottom: 4,
  },

  // Android Tab Item Styles
  tabItemAndroid: {
    paddingTop: 6,
    paddingBottom: 6,
  },

  // Icon Container Styles
  iconContainerIOS: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    position: 'relative',
  },

  iconContainerAndroid: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },

  // Tab Icon Styles
  tabIcon: {
    width: 24,
    height: 24,
  },

  // Profile Tab Icon Specific Styles
  profileTabIcon: {
    width: 26,
    height: 26,
  },

  // Profile Tab Icon Active State
  profileTabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }], // Slightly larger when active
  },

  // Profile Tab Icon Inactive State
  profileTabIconInactive: {
    opacity: 0.6,
    transform: [{ scale: 1 }],
  },

  // iOS Active Indicator
  activeIndicatorIOS: {
    position: 'absolute',
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
  },
});
