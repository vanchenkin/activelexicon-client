import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TextComplexityModal from '@/components/TextComplexityModal';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Button from '../../components/Button';
import TopicSelector from '@/components/TopicSelector';

type TextComplexity = 'easy' | 'medium' | 'hard';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [textComplexity, setTextComplexity] =
    useState<TextComplexity>('medium');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName === selectedTopic ? null : topicName);
  };

  const handleGenerate = () => {
    if (!selectedTopic) return;

    router.push({
      pathname: '/generated-text',
      params: {
        topic: selectedTopic,
        complexity: textComplexity,
      },
    });
  };

  const handleComplexityChange = (complexity: TextComplexity) => {
    setTextComplexity(complexity);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalVisible(!isSettingsModalVisible);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <Typography size="xl" style={styles.title}>
          Генерация текста
        </Typography>
        <Button
          title="Мой список слов"
          onPress={() => router.push('/words')}
          variant="outline"
          size="small"
        />
      </ThemedView>

      <ThemedView style={styles.infoCard}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color="#666"
          style={styles.infoIcon}
        />
        <Typography color="#666" size="md" style={styles.infoText}>
          Для добавления новых слов нужно сгенерировать текст
        </Typography>
      </ThemedView>

      <TopicSelector
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
        containerStyle={styles.topicSelectorContainer}
      />

      <ThemedView style={styles.bottomContainerFullWidth}>
        <ThemedView style={styles.bottomContainer}>
          <Button
            title="Сгенерировать"
            onPress={handleGenerate}
            variant="primary"
            size="medium"
            fullWidth={true}
          />

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={toggleSettingsModal}
          >
            <Ionicons name="options-outline" size={24} color="#000" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <TextComplexityModal
        visible={isSettingsModalVisible}
        onClose={toggleSettingsModal}
        initialComplexity={textComplexity}
        onComplexityChange={handleComplexityChange}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'left',
  },
  infoCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    textAlign: 'center',
  },
  topicSelectorContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomContainerFullWidth: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
