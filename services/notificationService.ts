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
  async requestPermissions() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus;
  }

  async createDefaultChannel() {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  }

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

  async scheduleDailyNotification(
    title: string,
    body: string,
    hour: number,
    minute: number,
    data?: Record<string, string>
  ) {
    await this.createDefaultChannel();

    await this.cancelAllScheduledNotifications();

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);

    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

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

  async cancelAllScheduledNotifications() {
    const triggers = await notifee.getTriggerNotifications();

    for (const trigger of triggers) {
      if (trigger.notification.id) {
        await notifee.cancelTriggerNotification(trigger.notification.id);
      }
    }

    await AsyncStorage.removeItem(NOTIFICATION_SCHEDULED_KEY);
  }

  async getNotificationSettings() {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
    return settings ? JSON.parse(settings) : null;
  }

  async initialize() {
    await this.createDefaultChannel();

    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    await this.requestPermissions();

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
