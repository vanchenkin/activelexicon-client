import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import LanguageLevelSelect from '@/components/LanguageLevelSelect';
import Header from '@/components/Header';
import { Alert } from '../context/crossPlatformAlert';
import { useUpdateUserProfile } from '@/hooks/useApi';

export default function ChangeLanguageLevelScreen() {
  const router = useRouter();
  const [languageLevel, setLanguageLevel] = useState('');

  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  const handleSubmit = async () => {
    if (!languageLevel) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите уровень языка');
      return;
    }

    try {
      updateProfile(
        { languageLevel },
        {
          onSuccess: () => {
            Alert.alert('Успех', 'Уровень языка обновлен', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: () => {
            Alert.alert('Ошибка', 'Не удалось обновить уровень языка');
          },
        }
      );
    } catch (error) {
      console.error('Error updating language level:', error);
      Alert.alert('Ошибка', 'Не удалось обновить уровень языка');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title="Изменить уровень языка"
        onBackPress={() => router.back()}
      />

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
          isLoading={isPending}
          disabled={isPending || !languageLevel}
          style={styles.button}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    marginTop: 16,
  },
});
