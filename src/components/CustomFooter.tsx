import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';

interface FooterItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface CustomFooterProps {
  items: FooterItem[];
  activeItem?: string;
}

export const CustomFooter: React.FC<CustomFooterProps> = ({
  items,
  activeItem,
}) => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.footer}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.footerItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Text
                  style={[
                    styles.footerIcon,
                    isActive && styles.activeIcon,
                  ]}
                >
                  {item.icon}
                </Text>
              </View>
              <Text
                style={[
                  styles.footerLabel,
                  isActive && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: '#F5F0E8', // Light gold background
  },
  footerIcon: {
    fontSize: 22,
    color: '#666',
  },
  activeIcon: {
    color: '#D4AF37', // Gold color
  },
  footerLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: '#666',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  activeLabel: {
    color: '#D4AF37',
    fontFamily: Fonts.semiBold,
  },
});
