import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import TextSelectionScreen from '@/components/TextSelectionScreen';
import { useGenerateText } from '@/hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import Typography from '@/components/Typography';

// Define the type for the complexity parameter
type TextComplexity = 'easy' | 'medium' | 'hard';

export default function GeneratedTextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topicId: string;
    customTopic: string;
    complexity: string;
  }>();

  // TextSelectionScreen manages its own selected words state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Use the mutation for text generation
  const generateTextMutation = useGenerateText();

  // Generate text when the component mounts
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
    // Navigate back to the explore screen
    router.back();
  };

  const handleWordSelected = (word: string) => {
    // Add word to selected words if not already selected
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Show loading state
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

  // Show the generated text once available
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

  // Fallback for errors or unexpected states
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
