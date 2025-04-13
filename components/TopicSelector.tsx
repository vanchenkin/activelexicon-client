import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import Typography from './Typography';
import Input from './Input';
import TopicItem, { Topic } from './TopicItem';
import { useTopics, useSearchTopics } from '@/hooks/useApi';

interface TopicSelectorProps {
  selectedTopic: string | null;
  onTopicSelect: (topicName: string) => void;
  containerStyle?: ViewStyle;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  onTopicSelect,
  containerStyle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayedTopics, setDisplayedTopics] = useState<Topic[]>([]);
  const [customTopic, setCustomTopic] = useState<string | null>(null);

  const { data: allTopics, isLoading: isLoadingTopics } = useTopics();
  const { data: searchResults } = useSearchTopics(debouncedQuery);

  const onSearchChange = (text: string) => {
    setSearchQuery(text);
  };

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

  const clearSearch = () => {
    onSearchChange('');
  };

  const handleCreateCustomTopic = (topicName: string) => {
    setCustomTopic(topicName);
    onTopicSelect(topicName);
  };

  const isCustomTopicSelected =
    customTopic === selectedTopic && customTopic !== null;

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <Input
        variant="default"
        placeholder="Поиск темы или введите свою тему..."
        value={searchQuery}
        onChangeText={onSearchChange}
        containerStyle={styles.searchInputContainer}
        leadingIcon={<Ionicons name="search" size={20} color="#999" />}
        trailingIcon={
          searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null
        }
      />

      {isCustomTopicSelected && (
        <ThemedView style={styles.selectedCustomTopicContainer}>
          <Typography size="md" weight="medium" color="#0099FF">
            Выбрана пользовательская тема: "{selectedTopic}"
          </Typography>
          <TouchableOpacity
            onPress={() => {
              setCustomTopic(null);
              onTopicSelect('');
            }}
            style={styles.removeCustomTopicButton}
          >
            <Ionicons name="close-circle" size={20} color="#0099FF" />
          </TouchableOpacity>
        </ThemedView>
      )}

      {isLoadingTopics ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : displayedTopics.length > 0 ? (
        <ThemedView style={styles.topicsGrid}>
          {displayedTopics.map((topic, index) => (
            <TopicItem
              key={topic.name}
              topic={topic}
              index={index}
              isSelected={
                topic.name === selectedTopic && !isCustomTopicSelected
              }
              totalItems={displayedTopics.length}
              onPress={(topicName) => {
                setCustomTopic(null);
                onTopicSelect(topicName);
              }}
            />
          ))}
        </ThemedView>
      ) : (
        <ThemedView style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={48} color="#999" />
          <Typography color="#666" size="md" style={styles.noResultsText}>
            Не найдено тем по запросу. Вы можете использовать этот запрос как
            свою тему.
          </Typography>
          {searchQuery.trim() !== '' && (
            <TouchableOpacity
              style={styles.createTopicButton}
              onPress={() => handleCreateCustomTopic(searchQuery)}
            >
              <Typography color="#0099FF" size="md" weight="medium">
                Создать тему "{searchQuery}"
              </Typography>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchInputContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  noResultsContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 16,
  },
  selectedTopicContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
  },
  selectedCustomTopicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E6F4FF',
    borderWidth: 1,
    borderColor: '#0099FF',
  },
  removeCustomTopicButton: {
    marginLeft: 8,
    padding: 4,
  },
  selectedTopicInfo: {
    fontSize: 15,
    color: '#555',
  },
  createTopicButton: {
    marginTop: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0099FF',
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
  },
});

export default TopicSelector;
