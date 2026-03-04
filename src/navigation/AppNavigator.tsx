import { Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
import { useAppSelector } from '../store/hooks';
import { Home, Grid, User, Heart } from 'lucide-react-native';

// Enable screens for better performance
enableScreens();

import { LoginNewScreen } from '../screens/LoginNewScreen';
import { SignUpNewScreen } from '../screens/SignUpNewScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CollectionsScreen } from '../screens/CollectionsScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../components/profiles/ProfileScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';

// import { WebViewScreen } from '../components/WebViewScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import VerifyEmailOTPScreen from '../screens/VerifyEmailOTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import WishlistScreen from '../screens/WishlistScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { OfflineScreen } from '../screens/OfflineScreen';
import { ConnectivityManager } from '../components/ConnectivityManager';
import { useAppDispatch } from '../store/hooks';
import NetInfo from '@react-native-community/netinfo';
import { setOffline, setServiceUnavailable } from '../store/slices/appSettingsSlice';

// Types
import { RootStackParamList, TabParamList } from '../types/navigation';
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
            name="Wishlist"
            component={WishlistScreen}
            options={{
              tabBarLabel: 'Wishlist',
              tabBarIcon: ({ focused, color }) => (
                <Heart size={24} color={color} fill={focused ? color : 'none'} />
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
  const { isAuthenticated, accessToken, isGuestMode } = useAppSelector((state) => state.auth);
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
      fallback={null}
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
        >
          {((isAuthenticated && (accessToken || accessToken)) || isGuestMode) ? (
            <Stack.Group>
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Orders" component={OrdersScreen} />
              <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Wishlist" component={WishlistScreen} />
            </Stack.Group>
          ) : (
            <Stack.Group screenOptions={{ animationTypeForReplace: 'pop' }}>
              <Stack.Screen name="LoginNew" component={LoginNewScreen} />
              <Stack.Screen name="SignUpNew" component={SignUpNewScreen} />
              <Stack.Screen name="Login" component={LoginNewScreen} />
              <Stack.Screen name="SignUp" component={SignUpNewScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
              <Stack.Screen name="VerifyEmailOTP" component={VerifyEmailOTPScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};


