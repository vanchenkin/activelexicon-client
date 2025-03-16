import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Modal,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import { ThemedSwitch } from '@/components/ThemedSwitch';
import Header from '@/components/Header';
import { notificationService } from '@/services';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SettingsScreen() {
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('Пора учиться!');
  const [notificationBody, setNotificationBody] = useState(
    'Время для изучения новых слов'
  );
  const [showCustomization, setShowCustomization] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const appVersion = '1.0.0';

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const settings = await notificationService.getNotificationSettings();

        if (settings) {
          setNotificationsEnabled(settings.isEnabled);

          if (settings.hour !== undefined && settings.minute !== undefined) {
            const date = new Date();
            date.setHours(settings.hour);
            date.setMinutes(settings.minute);
            setNotificationTime(date);
          }

          if (settings.title) setNotificationTitle(settings.title);
          if (settings.body) setNotificationBody(settings.body);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadNotificationSettings();

    notificationService.initialize();
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);

      if (value) {
        await notificationService.scheduleDailyNotification(
          notificationTitle,
          notificationBody,
          notificationTime.getHours(),
          notificationTime.getMinutes()
        );

        Alert.alert(
          'Уведомления включены',
          `Ежедневные уведомления будут приходить в ${notificationTime.getHours()}:${notificationTime.getMinutes() < 10 ? '0' : ''}${notificationTime.getMinutes()}`
        );
      } else {
        await notificationService.cancelAllScheduledNotifications();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      setNotificationsEnabled(!value);
      Alert.alert('Ошибка', 'Не удалось изменить настройки уведомлений');
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);

    if (selectedDate) {
      setNotificationTime(selectedDate);

      if (notificationsEnabled) {
        try {
          await notificationService.scheduleDailyNotification(
            notificationTitle,
            notificationBody,
            selectedDate.getHours(),
            selectedDate.getMinutes()
          );

          Alert.alert(
            'Время уведомлений обновлено',
            `Уведомления будут приходить в ${selectedDate.getHours()}:${selectedDate.getMinutes() < 10 ? '0' : ''}${selectedDate.getMinutes()}`
          );
        } catch (error) {
          console.error('Error updating notification time:', error);
          Alert.alert('Ошибка', 'Не удалось обновить время уведомлений');
        }
      }
    }
  };

  const handleCustomizationSave = async () => {
    setShowCustomization(false);

    if (notificationsEnabled) {
      try {
        await notificationService.scheduleDailyNotification(
          notificationTitle,
          notificationBody,
          notificationTime.getHours(),
          notificationTime.getMinutes()
        );
      } catch (error) {
        console.error('Error updating notification content:', error);
        Alert.alert('Ошибка', 'Не удалось обновить содержание уведомлений');
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Настройки" onBackPress={handleBackPress} />

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Аккаунт
          </Typography>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Предпочтения
          </Typography>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Уведомления</Typography>
            </ThemedView>
            <ThemedSwitch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
            />
          </ThemedView>

          {notificationsEnabled && (
            <>
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingInfoRow}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#555"
                    style={styles.settingIcon}
                  />
                  <Typography style={styles.settingText}>
                    Время уведомлений
                  </Typography>
                </ThemedView>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Typography style={styles.timeText}>
                    {notificationTime.getHours()}:
                    {notificationTime.getMinutes() < 10 ? '0' : ''}
                    {notificationTime.getMinutes()}
                  </Typography>
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingInfoRow}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color="#555"
                    style={styles.settingIcon}
                  />
                  <Typography style={styles.settingText}>
                    Настроить сообщение
                  </Typography>
                </ThemedView>
                <TouchableOpacity onPress={() => setShowCustomization(true)}>
                  <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
              </ThemedView>
            </>
          )}

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="moon-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Темная тема</Typography>
            </ThemedView>
            <ThemedSwitch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="volume-medium-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Звук</Typography>
            </ThemedView>
            <ThemedSwitch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            О приложении
          </Typography>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Typography style={styles.settingText}>Версия</Typography>
              <Typography color="#666" style={styles.settingValue}>
                {appVersion}
              </Typography>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity style={styles.linkItem}>
            <Typography style={styles.linkText}>
              Условия использования
            </Typography>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Typography style={styles.linkText}>
              Политика конфиденциальности
            </Typography>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Modal
        visible={showCustomization}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomization(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Typography style={styles.modalTitle}>
              Настройка уведомления
            </Typography>

            <Typography style={styles.label}>Заголовок</Typography>
            <TextInput
              style={styles.input}
              value={notificationTitle}
              onChangeText={setNotificationTitle}
              placeholder="Введите заголовок"
            />

            <Typography style={styles.label}>Сообщение</Typography>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={notificationBody}
              onChangeText={setNotificationBody}
              placeholder="Введите текст сообщения"
              multiline
            />

            <View style={styles.modalButtons}>
              <Button
                title="Отмена"
                onPress={() => setShowCustomization(false)}
              />
              <Button title="Сохранить" onPress={handleCustomizationSave} />
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
  },
  settingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  languageLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  selectedLevelButton: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#0099FF',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
  bottomSpacing: {
    height: 40,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A84FF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
