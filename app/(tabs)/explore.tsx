import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTopics, useSearchTopics } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import TextComplexityModal from '@/components/TextComplexityModal';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Input from '../../components/Input';
import TopicItem, { Topic } from '@/components/TopicItem';
import Button from '@/components/Button';

type TextComplexity = 'easy' | 'medium' | 'hard';

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayedTopics, setDisplayedTopics] = useState<Topic[]>([]);
  const [textComplexity, setTextComplexity] =
    useState<TextComplexity>('medium');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const { data: allTopics, isLoading: isLoadingTopics } = useTopics();
  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchTopics(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery) {
      if (allTopics) {
        setDisplayedTopics(allTopics);
      }
      return;
    }

    if (searchResults) {
      setDisplayedTopics(searchResults);
    }
  }, [debouncedQuery, allTopics, searchResults]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId);
  };

  const handleGenerate = () => {
    router.push({
      pathname: '/generated-text',
      params: {
        topicId: selectedTopic || '',
        customTopic: searchQuery && !selectedTopic ? searchQuery : '',
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

  const isLoading = isLoadingTopics || isSearchLoading;

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

      <Input
        variant="search"
        placeholder="Поиск темы или введите свою тему..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        leadingIcon={<Ionicons name="search" size={20} color="#999" />}
      />

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : (
        <ScrollView style={styles.topicsContainer}>
          <ThemedView style={styles.topicsGrid}>
            {displayedTopics.map((topic, index) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                index={index}
                isSelected={topic.id === selectedTopic}
                totalItems={displayedTopics.length}
                onPress={handleTopicSelect}
              />
            ))}
          </ThemedView>
        </ScrollView>
      )}

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
  wordsButton: {
    padding: 8,
  },
  infoCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  generatedTextInfoCard: {
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
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
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsContainer: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: 'transparent',
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
  regenerateButton: {
    backgroundColor: '#0099FF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  regenerateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedTextScrollView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
});
