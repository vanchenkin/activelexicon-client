import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import TextSelectionScreen from '../components/TextSelectionScreen';
import { useGenerateText } from '../hooks/useApi';
import { ThemedView } from '../components/ThemedView';

export default function GeneratedTextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topicId: string;
    customTopic: string;
    complexity: string;
  }>();

  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Use the mutation for text generation
  const generateTextMutation = useGenerateText();

  // Generate text when the component mounts
  React.useEffect(() => {
    if (!generateTextMutation.isSuccess && !generateTextMutation.isPending) {
      generateTextMutation.mutate({
        topicId: params.topicId || null,
        customTopic: params.customTopic || null,
        complexity: (params.complexity || 'medium') as
          | 'easy'
          | 'medium'
          | 'hard',
      });
    }
  }, [params.topicId, params.customTopic, params.complexity]);

  const handleRegenerateText = () => {
    generateTextMutation.mutate({
      topicId: params.topicId || null,
      customTopic: params.customTopic || null,
      complexity: (params.complexity || 'medium') as 'easy' | 'medium' | 'hard',
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
      <ActivityIndicator size="large" color="#0099FF" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
