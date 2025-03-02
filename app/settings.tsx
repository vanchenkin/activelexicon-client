import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/BackButton';

type LanguageLevel = 'beginner' | 'intermediate' | 'advanced';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logOut } = useAuth();

  // Sample settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);
  const [selectedLanguageLevel, setSelectedLanguageLevel] =
    useState<LanguageLevel>('intermediate');

  const handleBackPress = () => {
    router.back();
  };

  const handleLanguageLevelPress = (level: LanguageLevel) => {
    setSelectedLanguageLevel(level);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const appVersion = '1.0.0'; // This should be fetched from your app config

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <Typography size="lg" style={styles.headerTitle}>
          Настройки
        </Typography>
        <ThemedView style={{ width: 40 }} />
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Аккаунт
          </Typography>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Typography style={styles.settingText}>Email</Typography>
              <Typography color="#666" style={styles.settingValue}>
                {user?.email || 'Не указан'}
              </Typography>
            </ThemedView>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil-outline" size={18} color="#0099FF" />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Typography style={styles.settingText}>Пароль</Typography>
              <Typography color="#666" style={styles.settingValue}>
                ••••••••
              </Typography>
            </ThemedView>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil-outline" size={18} color="#0099FF" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Preferences Section */}
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
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : notificationsEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>

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
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : darkModeEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
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
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : soundEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>
                Автоисправление
              </Typography>
            </ThemedView>
            <Switch
              value={autoCorrectEnabled}
              onValueChange={setAutoCorrectEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : autoCorrectEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>
        </ThemedView>

        {/* Language Level Section */}
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Уровень языка
          </Typography>

          <ThemedView style={styles.languageLevelContainer}>
            <TouchableOpacity
              style={[
                styles.levelButton,
                selectedLanguageLevel === 'beginner' &&
                  styles.selectedLevelButton,
              ]}
              onPress={() => handleLanguageLevelPress('beginner')}
            >
              <Typography
                color={
                  selectedLanguageLevel === 'beginner' ? '#0099FF' : '#333'
                }
                weight={
                  selectedLanguageLevel === 'beginner' ? 'medium' : 'regular'
                }
              >
                Начинающий
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                selectedLanguageLevel === 'intermediate' &&
                  styles.selectedLevelButton,
              ]}
              onPress={() => handleLanguageLevelPress('intermediate')}
            >
              <Typography
                color={
                  selectedLanguageLevel === 'intermediate' ? '#0099FF' : '#333'
                }
                weight={
                  selectedLanguageLevel === 'intermediate'
                    ? 'medium'
                    : 'regular'
                }
              >
                Средний
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                selectedLanguageLevel === 'advanced' &&
                  styles.selectedLevelButton,
              ]}
              onPress={() => handleLanguageLevelPress('advanced')}
            >
              <Typography
                color={
                  selectedLanguageLevel === 'advanced' ? '#0099FF' : '#333'
                }
                weight={
                  selectedLanguageLevel === 'advanced' ? 'medium' : 'regular'
                }
              >
                Продвинутый
              </Typography>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* App Info Section */}
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Typography color="#FF3B30" weight="medium" size="md">
            Выйти из аккаунта
          </Typography>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
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
  logoutButton: {
    marginTop: 24,
    marginBottom: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,

    elevation: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});
