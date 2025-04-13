import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDeleteWord, useSearchWords, useWords } from '../hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import Typography from '@/components/Typography';
import Input from '@/components/Input';
import WordItem from '@/components/WordItem';
import AnimatedFlatList from '@/components/AnimatedFlatList';
import FadeIn from '@/components/FadeIn';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '@/components/Header';

export default function WordsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: paginatedWords,
    isLoading: isWordsLoading,
    isError: isWordsError,
    pagination,
  } = useWords(1, 10);

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchWords(searchQuery);

  const displayWords = searchQuery.trim()
    ? searchResults
    : paginatedWords?.items || [];
  const isLoading = searchQuery.trim() ? isSearchLoading : isWordsLoading;
  const isError = searchQuery.trim() ? isSearchError : isWordsError;

  const deleteWordMutation = useDeleteWord();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddWord = () => {
    router.push('/add-word');
  };

  const handleDeleteWord = (wordId: string) => {
    deleteWordMutation.mutate(wordId);
  };

  const handleNextPage = () => {
    pagination.nextPage();
  };

  const handlePrevPage = () => {
    pagination.prevPage();
  };

  const EmptyListComponent = () => (
    <FadeIn delay={100}>
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
      <Header title="Словарь" onBackPress={() => router.back()} />

      <FadeIn style={styles.searchInputBox}>
        <Input
          placeholder="Поиск слов..."
          value={searchQuery}
          onChangeText={handleSearch}
          containerStyle={styles.searchInputContainer}
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
        <FadeIn delay={100}>
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0099FF" />
          </ThemedView>
        </FadeIn>
      ) : isError ? (
        <FadeIn delay={100}>
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
        <GestureHandlerRootView style={styles.listContainer}>
          <AnimatedFlatList
            data={displayWords}
            renderItem={({ item }) => (
              <WordItem item={item} onDelete={handleDeleteWord} />
            )}
            keyExtractor={(item) => item.word}
            contentContainerStyle={styles.wordsList}
            ListEmptyComponent={EmptyListComponent}
            itemAnimationDelay={20}
          />

          {!searchQuery && paginatedWords && (
            <ThemedView style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  !pagination.hasPrevPage && styles.paginationButtonDisabled,
                ]}
                onPress={handlePrevPage}
                disabled={!pagination.hasPrevPage}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={pagination.hasPrevPage ? '#0099FF' : '#CCCCCC'}
                />
              </TouchableOpacity>
              <Typography style={styles.paginationText}>
                {pagination.page} / {pagination.totalPages || 1}
              </Typography>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  !pagination.hasNextPage && styles.paginationButtonDisabled,
                ]}
                onPress={handleNextPage}
                disabled={!pagination.hasNextPage}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={pagination.hasNextPage ? '#0099FF' : '#CCCCCC'}
                />
              </TouchableOpacity>
            </ThemedView>
          )}
        </GestureHandlerRootView>
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
  searchInput: {
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  searchInputBox: {
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
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
  listContainer: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  paginationButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    marginHorizontal: 12,
    color: '#666666',
  },
  addButton: {
    backgroundColor: '#0099FF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    right: 32,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
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
