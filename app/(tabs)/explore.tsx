import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTopics, useSearchTopics, useGenerateText } from '@/hooks/useApi';
import { Topic } from '@/services/mockTopicsApi';
import TextComplexityModal from '@/components/TextComplexityModal';
import TextSelectionScreen from '@/components/TextSelectionScreen';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';

type TextComplexity = 'easy' | 'medium' | 'hard';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayedTopics, setDisplayedTopics] = useState<Topic[]>([]);
  const [textComplexity, setTextComplexity] =
    useState<TextComplexity>('medium');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Fetch all topics
  const { data: allTopics, isLoading: isLoadingTopics } = useTopics();

  // Search topics when query changes
  const { data: searchResults, isLoading: isSearching } =
    useSearchTopics(debouncedQuery);

  // Text generation mutation
  const generateTextMutation = useGenerateText();

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
    setSelectedWords([]);
    generateTextMutation.mutate({
      topicId: selectedTopic,
      customTopic: searchQuery && !selectedTopic ? searchQuery : null,
      complexity: textComplexity,
    });
  };

  const handleWordSelected = (word: string) => {
    // Here you would implement logic to save the word or show a definition
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleComplexityChange = (complexity: TextComplexity) => {
    setTextComplexity(complexity);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalVisible(!isSettingsModalVisible);
  };

  const handleDone = () => {
    // Close the generated text view
    generateTextMutation.reset();
    setSelectedWords([]);
  };

  const renderTopicItem = (topic: Topic, index: number) => {
    const isSelected = topic.id === selectedTopic;
    const isLastInRow = index % 2 === 1;
    const isLastRow = index >= displayedTopics.length - 2;

    return (
      <TouchableOpacity
        key={topic.id}
        style={[
          styles.topicButton,
          isSelected && styles.selectedTopicButton,
          isLastInRow && { marginRight: 0 },
          isLastRow && { marginBottom: 0 },
        ]}
        onPress={() => handleTopicSelect(topic.id)}
      >
        <Ionicons
          name={topic.icon as any}
          size={16}
          color="#0066CC"
          style={styles.topicIcon}
        />
        <Typography style={styles.topicText}>{topic.name}</Typography>
      </TouchableOpacity>
    );
  };

  if (generateTextMutation.isSuccess) {
    return (
      <TextSelectionScreen
        generatedText={generateTextMutation.data}
        onRegenerateText={handleGenerate}
        onDone={handleDone}
        onWordSelected={handleWordSelected}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <Typography weight="bold" size="2xl" style={styles.title}>
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
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск темы или введите свою тему..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      {isLoadingTopics || isSearching ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : (
        <ScrollView style={styles.topicsContainer}>
          <ThemedView style={styles.topicsGrid}>
            {displayedTopics.map((topic, index) =>
              renderTopicItem(topic, index)
            )}
          </ThemedView>
        </ScrollView>
      )}

      <ThemedView style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            generateTextMutation.isPending && styles.disabledButton,
          ]}
          onPress={handleGenerate}
          disabled={generateTextMutation.isPending}
        >
          {generateTextMutation.isPending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Typography
              color="white"
              weight="bold"
              size="md"
              style={styles.generateButtonText}
            >
              Сгенерировать
            </Typography>
          )}
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
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
  topicButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTopicButton: {
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  topicIcon: {
    marginRight: 8,
  },
  topicText: {
    fontSize: 16,
    color: '#333',
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
  disabledButton: {
    backgroundColor: '#99CCFF',
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
