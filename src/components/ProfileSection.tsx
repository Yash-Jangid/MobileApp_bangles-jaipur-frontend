import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';

interface ProfileSectionProps {
  title: string;
  icon?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showEmptyState?: boolean;
}

export const ProfileSection = memo<ProfileSectionProps>(({
  title,
  icon,
  onViewAll,
  viewAllText = 'View All',
  children,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  showEmptyState = false,
}) => {
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          {onViewAll && (
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </View>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  if (showEmptyState) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          {onViewAll && (
            <TouchableOpacity onPress={onViewAll}>
              <Text style={styles.seeAllText}>{viewAllText}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.seeAllText}>{viewAllText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
  loadingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.border,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
  },
  loadingContent: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorContent: {
    backgroundColor: Colors.error + '10',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '20',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  emptyContent: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});
