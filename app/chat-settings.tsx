import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import { chatServiceInstance } from '../services';

export default function ChatSettingsScreen() {
  const router = useRouter();

  // Chat-specific settings
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);
  const [sentimentAnalysisEnabled, setSentimentAnalysisEnabled] =
    useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    'medium'
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите очистить всю историю чата?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await chatServiceInstance.clearHistory();
              Alert.alert('Успешно', 'История чата успешно очищена');
            } catch (error) {
              console.error('Failed to clear chat history:', error);
              Alert.alert('Ошибка', 'Не удалось очистить историю чата');
            }
          },
        },
      ]
    );
  };

  // Fix for the font size selector typography styles
  const getFontSizeTextStyle = (isSelected: boolean) => {
    return {
      color: isSelected ? 'white' : '#333',
    };
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <Typography size="lg" style={styles.headerTitle}>
          Настройки чата
        </Typography>
        <ThemedView style={{ width: 40 }} />
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Chat Settings Section */}
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Общие настройки
          </Typography>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="text-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Автодополнение</Typography>
            </ThemedView>
            <Switch
              value={autocompleteEnabled}
              onValueChange={setAutocompleteEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : autocompleteEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="happy-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Анализ эмоций</Typography>
            </ThemedView>
            <Switch
              value={sentimentAnalysisEnabled}
              onValueChange={setSentimentAnalysisEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : sentimentAnalysisEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="bulb-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>Предложения</Typography>
            </ThemedView>
            <Switch
              value={suggestionsEnabled}
              onValueChange={setSuggestionsEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : suggestionsEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfoRow}>
              <Ionicons
                name="volume-high-outline"
                size={20}
                color="#555"
                style={styles.settingIcon}
              />
              <Typography style={styles.settingText}>
                Озвучка сообщений
              </Typography>
            </ThemedView>
            <Switch
              value={textToSpeechEnabled}
              onValueChange={setTextToSpeechEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : textToSpeechEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
              }
              ios_backgroundColor="#D1D1D6"
            />
          </ThemedView>
        </ThemedView>

        {/* Text Display Section */}
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Отображение текста
          </Typography>

          <ThemedView style={styles.settingItem}>
            <Typography style={styles.settingText}>Размер шрифта</Typography>
            <ThemedView style={styles.fontSizeSelector}>
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  fontSize === 'small' && styles.selectedFontSize,
                ]}
                onPress={() => setFontSize('small')}
              >
                <Typography
                  style={getFontSizeTextStyle(fontSize === 'small')}
                  size="sm"
                >
                  A
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  fontSize === 'medium' && styles.selectedFontSize,
                ]}
                onPress={() => setFontSize('medium')}
              >
                <Typography
                  style={getFontSizeTextStyle(fontSize === 'medium')}
                  size="md"
                >
                  A
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  fontSize === 'large' && styles.selectedFontSize,
                ]}
                onPress={() => setFontSize('large')}
              >
                <Typography
                  style={getFontSizeTextStyle(fontSize === 'large')}
                  size="lg"
                >
                  A
                </Typography>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Data Section */}
        <ThemedView style={styles.section}>
          <Typography weight="medium" style={styles.sectionTitle}>
            Данные
          </Typography>

          <ThemedView style={styles.buttonContainer}>
            <Button
              title="Очистить историю чата"
              onPress={handleClearHistory}
              variant="outline"
              size="medium"
              fullWidth={true}
            />
          </ThemedView>
        </ThemedView>
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
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedFontSize: {
    backgroundColor: '#0099FF',
  },
  fontSizeText: {
    color: '#333',
  },
  selectedFontSizeText: {
    color: 'white',
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
