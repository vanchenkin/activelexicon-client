import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '../components/ThemedView';
import Typography from '../components/Typography';
import Button from '../components/Button';
import LanguageLevelSelect from '../components/LanguageLevelSelect';
import BackButton from '../components/BackButton';
import { profileServiceInstance } from '../services/api';

export default function ChangeLanguageLevelScreen() {
  const router = useRouter();
  const [languageLevel, setLanguageLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!languageLevel) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите уровень языка');
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await profileServiceInstance.changeLanguageLevel(languageLevel);

      if (response.success) {
        Alert.alert('Успех', 'Уровень языка обновлен', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Ошибка', 'Не удалось обновить уровень языка');
      }
    } catch (error) {
      console.error('Error updating language level:', error);
      Alert.alert('Ошибка', 'Не удалось обновить уровень языка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton onPress={() => router.back()} />
      <ThemedView style={styles.header}>
        <Typography size="lg" style={styles.headerTitle}>
          Изменить уровень языка
        </Typography>
      </ThemedView>

      <ThemedView style={styles.content}>
        <Typography style={styles.label}>
          Выберите ваш уровень владения языком:
        </Typography>

        <LanguageLevelSelect
          value={languageLevel}
          onChange={setLanguageLevel}
          style={styles.select}
        />

        <Button
          title="Сохранить"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting || !languageLevel}
          style={styles.button}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  label: {
    marginBottom: 16,
    fontSize: 16,
  },
  select: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
