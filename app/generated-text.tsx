import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import TextSelectionScreen from '@/components/TextSelectionScreen';
import { useGenerateText } from '@/hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import Typography from '@/components/Typography';

type TextComplexity = 'easy' | 'medium' | 'hard';

export default function GeneratedTextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topicId: string;
    customTopic: string;
    complexity: string;
  }>();

  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const generateTextMutation = useGenerateText();

  useEffect(() => {
    if (!generateTextMutation.isSuccess && !generateTextMutation.isPending) {
      generateTextMutation.mutate({
        topicId: params.topicId || null,
        customTopic: params.customTopic || null,
        complexity: (params.complexity || 'medium') as TextComplexity,
      });
    }
  }, [
    params.topicId,
    params.customTopic,
    params.complexity,
    generateTextMutation,
  ]);

  const handleRegenerateText = () => {
    generateTextMutation.mutate({
      topicId: params.topicId || null,
      customTopic: params.customTopic || null,
      complexity: (params.complexity || 'medium') as TextComplexity,
    });
  };

  const handleDone = () => {
    router.replace('/explore');
  };

  const handleWordSelected = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  if (generateTextMutation.isPending) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Typography style={styles.loadingText}>Генерируем текст...</Typography>
        <Button
          title="Отмена"
          onPress={() => router.back()}
          variant="outline"
          size="medium"
          style={styles.cancelButton}
        />
      </ThemedView>
    );
  }

  if (generateTextMutation.isSuccess) {
    return (
      <TextSelectionScreen
        generatedText={generateTextMutation.data}
        onRegenerateText={handleRegenerateText}
        onDone={handleDone}
        onWordSelected={handleWordSelected}
      />
    );
  }

  return (
    <ThemedView style={styles.loadingContainer}>
      <Typography style={styles.errorText}>
        Произошла ошибка при генерации текста
      </Typography>
      <Button
        title="Попробовать снова"
        onPress={handleRegenerateText}
        variant="primary"
        size="medium"
        style={styles.retryButton}
      />
      <Button
        title="Назад"
        onPress={() => router.back()}
        variant="outline"
        size="medium"
        style={styles.backButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  cancelButton: {
    marginTop: 16,
    minWidth: 120,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 24,
  },
  retryButton: {
    marginBottom: 16,
    minWidth: 200,
  },
  backButton: {
    minWidth: 200,
  },
});
