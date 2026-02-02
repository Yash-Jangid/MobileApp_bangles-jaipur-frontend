import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';

interface LiveSessionData {
  id: number;
  title: string;
  description?: string;
  duration: number;
  date?: string;
  session_api: string;
  link?: string;
  join_link?: string;
  is_finished: boolean;
  is_passed: boolean;
  webinar: {
    id: number;
    title: string;
    type: string;
  };
}

interface LiveSessionViewerProps {
  sessionData: LiveSessionData;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const LiveSessionViewer: React.FC<LiveSessionViewerProps> = ({
  sessionData,
  onClose,
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const getPlatformInfo = (sessionApi: string) => {
    switch (sessionApi.toLowerCase()) {
      case 'zoom':
        return {
          name: 'Zoom',
          icon: '📹',
          color: '#2D8CFF',
          description: 'Join this live session on Zoom',
        };
      case 'google_meet':
      case 'google meet':
        return {
          name: 'Google Meet',
          icon: '🎥',
          color: '#00AC47',
          description: 'Join this live session on Google Meet',
        };
      case 'teams':
        return {
          name: 'Microsoft Teams',
          icon: '💼',
          color: '#6264A7',
          description: 'Join this live session on Microsoft Teams',
        };
      case 'skype':
        return {
          name: 'Skype',
          icon: '💬',
          color: '#00AFF0',
          description: 'Join this live session on Skype',
        };
      case 'webex':
        return {
          name: 'Cisco Webex',
          icon: '🌐',
          color: '#049FD9',
          description: 'Join this live session on Cisco Webex',
        };
      case 'big_blue_button':
        return {
          name: 'BigBlueButton',
          icon: '🔵',
          color: '#1F4E79',
          description: 'Join this live session on BigBlueButton',
        };
      case 'agora':
        return {
          name: 'Agora',
          icon: '🎯',
          color: '#FF6B35',
          description: 'Join this live session on Agora',
        };
      case 'jitsi':
        return {
          name: 'Jitsi',
          icon: '🎪',
          color: '#F79A3E',
          description: 'Join this live session on Jitsi',
        };
      default:
        return {
          name: 'Live Session',
          icon: '🎥',
          color: Colors.primary,
          description: 'Join this live session',
        };
    }
  };

  const handleJoinSession = async () => {
    const joinUrl = sessionData.join_link || sessionData.link;
    
    if (!joinUrl) {
      Alert.alert('Error', 'No join link available for this session.');
      return;
    }

    setIsJoining(true);

    try {
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(joinUrl);
      
      if (canOpen) {
        await Linking.openURL(joinUrl);
      } else {
        // If the app can't open the URL directly, show instructions
        Alert.alert(
          'Join Session',
          `Please copy this link and open it in your browser or ${getPlatformInfo(sessionData.session_api).name} app:\n\n${joinUrl}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Copy Link', onPress: () => {
              // You can add clipboard functionality here if needed
              Alert.alert('Link copied to clipboard');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Error opening session link:', error);
      Alert.alert('Error', 'Failed to open session link. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const platformInfo = getPlatformInfo(sessionData.session_api);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Session</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionCard}>
          <View style={styles.platformHeader}>
            <Text style={styles.platformIcon}>{platformInfo.icon}</Text>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{platformInfo.name}</Text>
              <Text style={styles.sessionTitle}>{sessionData.title}</Text>
            </View>
          </View>

          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{formatDuration(sessionData.duration)}</Text>
            </View>
            
            {sessionData.date && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{formatDate(sessionData.date)}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.detailValue,
                { color: sessionData.is_finished ? Colors.error : Colors.success }
              ]}>
                {sessionData.is_finished ? 'Finished' : 'Upcoming'}
              </Text>
            </View>

            {sessionData.is_passed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Completed</Text>
              </View>
            )}
          </View>

          {sessionData.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{sessionData.description}</Text>
            </View>
          )}

          <View style={styles.joinSection}>
            <Text style={styles.joinDescription}>{platformInfo.description}</Text>
            
            <TouchableOpacity
              style={[
                styles.joinButton,
                { backgroundColor: platformInfo.color },
                isJoining && styles.joinButtonDisabled
              ]}
              onPress={handleJoinSession}
              disabled={isJoining || sessionData.is_finished}
            >
              <Text style={styles.joinButtonText}>
                {isJoining ? 'Opening...' : sessionData.is_finished ? 'Session Ended' : 'Join Session'}
              </Text>
            </TouchableOpacity>

            {sessionData.is_finished && (
              <Text style={styles.finishedNote}>
                This session has already ended. You can view the recording if available.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sessionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  platformIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  sessionDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
  },
  completedBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  completedText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.success,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  joinSection: {
    alignItems: 'center',
  },
  joinDescription: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  joinButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  finishedNote: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});
