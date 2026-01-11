import { Text, Image, Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
import { useAppSelector } from '../store/hooks';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable screens for better performance
enableScreens();

import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
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

// Types
import { RootStackParamList, TabParamList } from '../types/navigation';
import { Colors } from '../common/colors';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{
          tabBarLabel: 'Collections',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>💎</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>🛒</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, token, accessToken, isGuestMode } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer
      fallback={<Text>Loading...</Text>}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
        initialRouteName={(isAuthenticated && (token || accessToken)) || isGuestMode ? "Main" : "Login"}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

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
