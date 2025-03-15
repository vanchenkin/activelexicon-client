import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDeleteWord, useSearchWords, useWords } from '../hooks/useApi';
import { ThemedView } from '../components/ThemedView';
import Typography from '../components/Typography';
import Input from '../components/Input';
import WordItem from '../components/WordItem';
import AnimatedFlatList from '../components/AnimatedFlatList';
import FadeIn from '../components/FadeIn';
import BackButton from '../components/BackButton';

export default function WordsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: words = [],
    isLoading: isWordsLoading,
    isError: isWordsError,
  } = useWords();

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchWords(searchQuery);

  const displayWords = searchQuery.trim() ? searchResults : words;
  const isLoading = searchQuery.trim() ? isSearchLoading : isWordsLoading;
  const isError = searchQuery.trim() ? isSearchError : isWordsError;

  const deleteWordMutation = useDeleteWord();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddWord = () => {
    router.push('/add-word' as any);
  };

  const handleDeleteWord = (wordId: string) => {
    deleteWordMutation.mutate(wordId);
  };

  const EmptyListComponent = () => (
    <FadeIn delay={300}>
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={50} color="#CCC" />
        <Typography color="#666" style={styles.emptyText}>
          {searchQuery
            ? 'По вашему запросу ничего не найдено'
            : 'У вас пока нет добавленных слов'}
        </Typography>
      </ThemedView>
    </FadeIn>
  );

  return (
    <ThemedView style={styles.container}>
      <FadeIn>
        <ThemedView style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Typography size="lg" style={styles.headerTitle}>
            Словарь
          </Typography>
        </ThemedView>
      </FadeIn>

      <FadeIn delay={100} style={styles.searchInputContainer}>
        <Input
          placeholder="Поиск слов..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          leadingIcon={
            <Ionicons name="search-outline" size={20} color="#999" />
          }
          trailingIcon={
            searchQuery.length > 0 ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleSearch('')}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            ) : null
          }
        />
      </FadeIn>

      {isLoading ? (
        <FadeIn delay={200}>
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0099FF" />
          </ThemedView>
        </FadeIn>
      ) : isError ? (
        <FadeIn delay={200}>
          <ThemedView style={styles.errorContainer}>
            <Typography color="#FF3B30" size="md" style={styles.errorText}>
              Не удалось загрузить слова
            </Typography>
            <TouchableOpacity style={styles.retryButton}>
              <Typography
                color="white"
                weight="medium"
                style={styles.retryText}
              >
                Повторить
              </Typography>
            </TouchableOpacity>
          </ThemedView>
        </FadeIn>
      ) : (
        <AnimatedFlatList
          data={displayWords}
          renderItem={({ item }) => (
            <WordItem item={item} onDelete={handleDeleteWord} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.wordsList}
          ListEmptyComponent={EmptyListComponent}
          itemAnimationDelay={80}
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  searchInputContainer: {
    paddingHorizontal: 16,
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
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
