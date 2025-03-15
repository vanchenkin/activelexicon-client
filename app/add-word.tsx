import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAddWord } from '@/hooks/useApi';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import Button from '../components/Button';
import Input from '../components/Input';
import BackButton from '../components/BackButton';
import Header from '../components/Header';

export default function AddWordScreen() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [wordError, setWordError] = useState('');
  const [translationError, setTranslationError] = useState('');

  const addWordMutation = useAddWord();

  const handleAddWord = async () => {
    setWordError('');
    setTranslationError('');

    let isValid = true;

    if (!word.trim()) {
      setWordError('Пожалуйста, введите слово');
      isValid = false;
    }

    if (!translation.trim()) {
      setTranslationError('Пожалуйста, введите перевод');
      isValid = false;
    }

    if (!isValid) return;

    try {
      await addWordMutation.mutateAsync({
        word: word.trim(),
        translation: translation.trim(),
      });

      router.back();
    } catch (error) {
      console.error('Failed to add word:', error);
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

            <Input
              label="Перевод"
              placeholder="Введите перевод на русском"
              value={translation}
              onChangeText={setTranslation}
              autoCapitalize="none"
              fullWidth
              error={translationError}
            />

            <Input
              label="Пример использования (необязательно)"
              placeholder="Введите пример предложения с этим словом"
              value={example}
              onChangeText={setExample}
              multiline
              numberOfLines={3}
              fullWidth
            />

            <ThemedView style={styles.buttonContainer}>
              <Button
                title="Добавить"
                onPress={handleAddWord}
                variant="primary"
                fullWidth
                isLoading={addWordMutation.isPending}
                disabled={addWordMutation.isPending}
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
