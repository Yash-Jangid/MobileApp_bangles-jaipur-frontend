import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../common/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft } from 'lucide-react-native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView
        style={[styles.container, {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={28} color={theme.colors.text} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 32,
    fontFamily: Fonts.regular,
    lineHeight: 32,
  },
  title: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
