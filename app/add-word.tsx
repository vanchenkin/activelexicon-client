import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAddWord, useGetWord } from '@/hooks/useApi';
import { ThemedView } from '../components/ThemedView';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import { Alert } from '../context/crossPlatformAlert';

export default function AddWordScreen() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [wordError, setWordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addWordMutation = useAddWord();
  const { data: wordData, isFetching } = useGetWord(word.trim());

  const handleAddWord = async () => {
    setWordError('');
    setIsLoading(true);

    if (!word.trim()) {
      setWordError('Пожалуйста, введите слово');
      setIsLoading(false);
      return;
    }

    try {
      if (!wordData || !wordData.translations) {
        Alert.alert('Ошибка', 'Не удалось получить перевод для этого слова');
        setIsLoading(false);
        return;
      }

      await addWordMutation.mutateAsync({
        word: word.trim(),
      });

      router.back();
    } catch (error) {
      console.error('Failed to add word:', error);
      Alert.alert('Ошибка', 'Не удалось добавить слово');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Добавить слово" onBackPress={handleCancel} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.formContainer}>
            <Input
              label="Слово"
              placeholder="Введите слово на английском"
              value={word}
              onChangeText={setWord}
              autoCapitalize="none"
              fullWidth
              error={wordError}
            />

            <ThemedView style={styles.buttonContainer}>
              <Button
                title="Добавить"
                onPress={handleAddWord}
                variant="primary"
                fullWidth
                isLoading={isLoading || addWordMutation.isPending || isFetching}
                disabled={isLoading || addWordMutation.isPending || isFetching}
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
  },
  placeholderButton: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
