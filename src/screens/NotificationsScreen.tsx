import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../common/colors';
import apiService from '../services/ApiService';
import { ArrowBackIcon, NotificationIcon } from '../components/icons/VideoControlIcons';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'course' | 'message' | 'system';
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('user_token');

      if (token) {
        const response = await apiService.getNotifications(token);

        if (response.success) {
          setNotifications((response as any).notifications || []);
        } else {
          console.log('Failed to load notifications:', response.message);
          // Fallback to mock data
          setNotifications([
            {
              id: '1',
              title: 'New Course Available',
              message: 'Check out our new course on React Native development!',
              timestamp: '2024-01-15T10:30:00Z',
              read: false,
              type: 'course',
            },
            {
              id: '2',
              title: 'Welcome to Edurise',
              message: 'Thank you for joining our platform. Start learning today!',
              timestamp: '2024-01-14T15:45:00Z',
              read: true,
              type: 'system',
            },
          ]);
        }
      } else {
        // No token, show mock data
        setNotifications([
          {
            id: '1',
            title: 'New Course Available',
            message: 'Check out our new course on React Native development!',
            timestamp: '2024-01-15T10:30:00Z',
            read: false,
            type: 'course',
          },
          {
            id: '2',
            title: 'Welcome to Edurise',
            message: 'Thank you for joining our platform. Start learning today!',
            timestamp: '2024-01-14T15:45:00Z',
            read: true,
            type: 'system',
          },
        ]);
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
      // Mock data for demo
      setNotifications([
        {
          id: '1',
          title: 'New Course Available',
          message: 'Check out our new course on React Native development!',
          timestamp: '2024-01-15T10:30:00Z',
          read: false,
          type: 'course',
        },
        {
          id: '2',
          title: 'Welcome to Edurise',
          message: 'Thank you for joining our platform. Start learning today!',
          timestamp: '2024-01-14T15:45:00Z',
          read: true,
          type: 'system',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem('user_token');

      if (token) {
        const response = await apiService.markNotificationAsRead(notificationId, token);

        if (response.success) {
          // Update UI
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === notificationId ? { ...notif, read: true } : notif
            )
          );
        } else {
          console.log('Failed to mark notification as read:', response.message);
        }
      } else {
        // No token, just update UI
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <NotificationIcon
          size={24}
          color={Colors.primary}
        />
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <ArrowBackIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            {/* <Icon name="more-vert" size={24} color="#fff" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          style={styles.notificationsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NotificationIcon size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>
                We'll notify you when there's something new
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#fff',
  },
  unreadNotification: {
    backgroundColor: Colors.background,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
