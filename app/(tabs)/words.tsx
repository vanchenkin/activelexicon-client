import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserWord } from '@/services/mockWordsService';
import { useUserWords, useSearchWords, useDeleteWord } from '@/hooks/useApi';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';

export default function WordsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Always call hooks unconditionally
  const {
    data: userWords = [],
    isLoading: isUserWordsLoading,
    isError: isUserWordsError,
  } = useUserWords();

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchWords(searchQuery);

  // Determine which data to use based on search query
  const words = searchQuery.trim() ? searchResults : userWords;
  const isLoading = searchQuery.trim() ? isSearchLoading : isUserWordsLoading;
  const isError = searchQuery.trim() ? isSearchError : isUserWordsError;

  // Use React Query mutation for deleting words
  const deleteWordMutation = useDeleteWord();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddWord = () => {
    // Navigate to add word screen or show a modal
    router.push('/add-word');
  };

  const handleDeleteWord = (wordId: string) => {
    deleteWordMutation.mutate(wordId);
  };

  const renderWordItem = ({ item }: { item: UserWord }) => (
    <ThemedView style={styles.wordItem}>
      <ThemedView style={styles.wordInfo}>
        <Typography style={styles.wordText}>{item.word}</Typography>
        <Typography color="#666" style={styles.translationText}>
          {item.translation}
        </Typography>
      </ThemedView>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteWord(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </ThemedView>
  );

  const EmptyListComponent = () => (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={50} color="#CCC" />
      <Typography color="#666" style={styles.emptyText}>
        {searchQuery
          ? 'По вашему запросу ничего не найдено'
          : 'У вас пока нет добавленных слов'}
      </Typography>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <ThemedView style={styles.header}>
        <Typography weight="bold" size="lg" style={styles.headerTitle}>
          Мои слова
        </Typography>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск слов..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch('')}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : isError ? (
        <ThemedView style={styles.errorContainer}>
          <Typography color="#FF3B30" size="md" style={styles.errorText}>
            Не удалось загрузить слова
          </Typography>
          <TouchableOpacity style={styles.retryButton}>
            <Typography color="white" weight="medium" style={styles.retryText}>
              Повторить
            </Typography>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.wordsList}
          ListEmptyComponent={EmptyListComponent}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    margin: 16,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsList: {
    paddingHorizontal: 16,
  },
  wordItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    marginBottom: 8,
  },
  translationText: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
  },
});
