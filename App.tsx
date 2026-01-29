import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/common/colors';
import { Fonts } from './src/common/fonts';
import { store, persistor } from './src/store';
import socialLoginService from './src/services/SocialLoginService';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthListener } from './src/components/AuthListener';

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize social login services when app starts
    socialLoginService.initializeAll();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ThemeProvider>
          <AuthListener />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
});

export default App;