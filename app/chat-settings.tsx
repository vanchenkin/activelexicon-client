import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import { useClearChatHistory } from '../hooks/useApi';
import { Alert } from '../context/crossPlatformAlert';

export default function ChatSettingsScreen() {
  const router = useRouter();
  const clearChatHistory = useClearChatHistory();

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
              await clearChatHistory.mutateAsync();
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

  const getFontSizeTextStyle = (isSelected: boolean) => {
    return {
      color: isSelected ? 'white' : '#333',
    };
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton onPress={handleBackPress} />
      <ThemedView style={styles.header}>
        <Typography size="lg" style={styles.headerTitle}>
          Настройки чата
        </Typography>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
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
