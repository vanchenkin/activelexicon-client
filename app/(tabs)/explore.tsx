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

  // Fetch all topics
  const { data: allTopics, isLoading: isLoadingTopics } = useTopics();

  // Search topics when query changes
  const { data: searchResults, isLoading: isSearching } =
    useSearchTopics(debouncedQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update displayed topics based on search results or all topics
  useEffect(() => {
    if (debouncedQuery && searchResults) {
      setDisplayedTopics(searchResults);
    } else if (allTopics) {
      setDisplayedTopics(allTopics);
    }
  }, [debouncedQuery, searchResults, allTopics]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId);
  };

  const handleGenerate = () => {
    // Navigate to the generated text screen with the necessary parameters
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

  return (
    <ThemedView style={styles.container}>
      <Typography size="2xl" style={styles.title}>
        Генерация текста
      </Typography>

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

      <ThemedView style={styles.searchContainer}>
        <Input
          variant="search"
          placeholder="Поиск темы или введите свою тему..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInputContainer}
          leadingIcon={<Ionicons name="search" size={20} color="#999" />}
        />
      </ThemedView>

      {isLoadingTopics || isSearching ? (
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

      <ThemedView style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
        >
          <Typography
            color="white"
            weight="bold"
            size="md"
            style={styles.generateButtonText}
          >
            Сгенерировать
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={toggleSettingsModal}
        >
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
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
  title: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  generatedTextInfoCard: {
    backgroundColor: 'white',
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
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: '#0099FF',
    borderRadius: 10,
    padding: 16,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  generateButtonText: {},
  sortButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
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
