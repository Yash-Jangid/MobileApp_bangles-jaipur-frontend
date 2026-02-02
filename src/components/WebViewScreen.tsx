import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { WEB_APP_URL, DISABLE_HEADER_FOOTER_PARAM } from '../common/constants';
import { Colors } from '../common/colors';

interface WebViewScreenProps {
  route?: string;
  hideHeaderFooter?: boolean;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({
  route = '',
  hideHeaderFooter = true,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  // Construct URL with parameters to hide header/footer
  const webUrl = `${WEB_APP_URL}${route}${
    hideHeaderFooter ? DISABLE_HEADER_FOOTER_PARAM : ''
  }`;

  // Handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [canGoBack])
  );

  // JavaScript to inject for hiding header/footer and other customizations
  const injectedJavaScript = `
    (function() {
      // Hide header and footer elements
      const header = document.querySelector('header, .header, #header, .navbar');
      const footer = document.querySelector('footer, .footer, #footer');
      
      if (header) {
        header.style.display = 'none';
      }
      
      if (footer) {
        footer.style.display = 'none';
      }
      
      // Add mobile-specific styles
      const style = document.createElement('style');
      style.textContent = \`
        body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        .container, .main-content {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        /* Hide any fixed positioned headers/footers */
        .fixed-header, .fixed-footer, .sticky-header, .sticky-footer {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);
      
      // Send message to React Native when page is ready
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PAGE_LOADED',
        url: window.location.href
      }));
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      switch (data.type) {
        case 'PAGE_LOADED':
          setLoading(false);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    
    Alert.alert(
      'Connection Error',
      'Unable to load the page. Please check your internet connection.',
      [
        { text: 'Retry', onPress: () => webViewRef.current?.reload() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: webUrl }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={handleMessage}
        onError={handleError}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
