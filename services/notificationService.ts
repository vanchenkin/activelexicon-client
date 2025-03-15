import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  EventType,
  RepeatFrequency,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_CHANNEL_ID = 'default';
const NOTIFICATION_SCHEDULED_KEY = 'notifications_scheduled';

class NotificationService {
  /**
   * Request notification permissions from the user
   */
  async requestPermissions() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus;
  }

  /**
   * Create default notification channel for Android
   */
  async createDefaultChannel() {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  }

  /**
   * Display an immediate notification
   */
  async displayNotification(
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    await this.createDefaultChannel();

    return notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  }

  /**
   * Schedule a daily notification at the specified hour and minute
   */
  async scheduleDailyNotification(
    title: string,
    body: string,
    hour: number,
    minute: number,
    data?: Record<string, string>
  ) {
    await this.createDefaultChannel();

    // Cancel any existing scheduled notifications
    await this.cancelAllScheduledNotifications();

    // Create a date for the next trigger
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);

    // If the time has already passed today, schedule for tomorrow
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    // Create the notification
    const notificationId = await notifee.createTriggerNotification(
      {
        title,
        body,
        data,
        android: {
          channelId: NOTIFICATION_CHANNEL_ID,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      },
      trigger
    );

    // Store notification settings to AsyncStorage
    await AsyncStorage.setItem(
      NOTIFICATION_SCHEDULED_KEY,
      JSON.stringify({
        notificationId,
        title,
        body,
        hour,
        minute,
        isEnabled: true,
      })
    );

    return notificationId;
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllScheduledNotifications() {
    // Get all scheduled notifications
    const triggers = await notifee.getTriggerNotifications();

    // Cancel each notification
    for (const trigger of triggers) {
      if (trigger.notification.id) {
        await notifee.cancelTriggerNotification(trigger.notification.id);
      }
    }

    // Clear storage
    await AsyncStorage.removeItem(NOTIFICATION_SCHEDULED_KEY);
  }

  /**
   * Get the current notification settings
   */
  async getNotificationSettings() {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
    return settings ? JSON.parse(settings) : null;
  }

  /**
   * Initialize the notification service
   */
  async initialize() {
    await this.createDefaultChannel();

    // Setup foreground event handler
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    // Request permissions
    await this.requestPermissions();

    // Re-schedule previously scheduled notifications (if app restarts)
    const settings = await this.getNotificationSettings();
    if (settings && settings.isEnabled) {
      await this.scheduleDailyNotification(
        settings.title || 'Reminder',
        settings.body || 'Time to practice your vocabulary!',
        settings.hour,
        settings.minute
      );
    }
  }
}

export const notificationService = new NotificationService();
