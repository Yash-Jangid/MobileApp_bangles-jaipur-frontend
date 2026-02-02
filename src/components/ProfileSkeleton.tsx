import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../common/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: Colors.border,
          borderRadius: 4,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Profile Header Skeleton */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Skeleton width={80} height={80} style={styles.avatarSkeleton} />
          <Skeleton width={24} height={24} style={styles.editButtonSkeleton} />
        </View>
        <Skeleton width={150} height={24} style={styles.nameSkeleton} />
        <Skeleton width={200} height={16} style={styles.emailSkeleton} />
        <Skeleton width={100} height={16} style={styles.roleSkeleton} />
        <Skeleton width={120} height={40} style={styles.editProfileSkeleton} />
      </View>

      {/* Account Balance Skeleton */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Skeleton width={40} height={40} style={styles.balanceIconSkeleton} />
          <View style={styles.balanceTextContainer}>
            <Skeleton width={120} height={16} style={styles.balanceTitleSkeleton} />
            <Skeleton width={80} height={24} style={styles.balanceAmountSkeleton} />
          </View>
        </View>
        <Skeleton width={140} height={32} style={styles.chargeButtonSkeleton} />
      </View>

      {/* Stats Skeleton */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Skeleton width={40} height={40} style={styles.statIconSkeleton} />
            <Skeleton width={30} height={20} style={styles.statNumberSkeleton} />
            <Skeleton width={80} height={14} style={styles.statLabelSkeleton} />
          </View>
          <View style={styles.statCard}>
            <Skeleton width={40} height={40} style={styles.statIconSkeleton} />
            <Skeleton width={30} height={20} style={styles.statNumberSkeleton} />
            <Skeleton width={80} height={14} style={styles.statLabelSkeleton} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Skeleton width={40} height={40} style={styles.statIconSkeleton} />
            <Skeleton width={30} height={20} style={styles.statNumberSkeleton} />
            <Skeleton width={80} height={14} style={styles.statLabelSkeleton} />
          </View>
          <View style={styles.statCard}>
            <Skeleton width={40} height={40} style={styles.statIconSkeleton} />
            <Skeleton width={30} height={20} style={styles.statNumberSkeleton} />
            <Skeleton width={80} height={14} style={styles.statLabelSkeleton} />
          </View>
        </View>
      </View>

      {/* Section Skeletons */}
      {[1, 2, 3, 4].map((index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Skeleton width={120} height={18} style={styles.sectionTitleSkeleton} />
            <Skeleton width={60} height={16} style={styles.seeAllSkeleton} />
          </View>
          <View style={styles.sectionContent}>
            <Skeleton width="100%" height={60} style={styles.sectionItemSkeleton} />
            <Skeleton width="100%" height={60} style={styles.sectionItemSkeleton} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarSkeleton: {
    borderRadius: 40,
  },
  editButtonSkeleton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
  },
  nameSkeleton: {
    marginBottom: 8,
    borderRadius: 12,
  },
  emailSkeleton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  roleSkeleton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  editProfileSkeleton: {
    borderRadius: 20,
  },
  balanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceIconSkeleton: {
    borderRadius: 20,
    marginRight: 12,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceTitleSkeleton: {
    marginBottom: 4,
    borderRadius: 8,
  },
  balanceAmountSkeleton: {
    borderRadius: 12,
  },
  chargeButtonSkeleton: {
    borderRadius: 16,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIconSkeleton: {
    borderRadius: 20,
    marginBottom: 8,
  },
  statNumberSkeleton: {
    marginBottom: 4,
    borderRadius: 10,
  },
  statLabelSkeleton: {
    borderRadius: 7,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleSkeleton: {
    borderRadius: 9,
  },
  seeAllSkeleton: {
    borderRadius: 8,
  },
  sectionContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionItemSkeleton: {
    marginBottom: 12,
    borderRadius: 8,
  },
});
