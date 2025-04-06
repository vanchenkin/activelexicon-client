import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWordFrequency } from '../hooks/useApi';
import { ThemedView } from '../components/ThemedView';
import Typography from '../components/Typography';
import BackButton from '../components/BackButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WordFrequency } from '../services/api/dictionaryService';

export default function FrequencyWordsScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: frequencyData,
    isLoading,
    isError,
    isFetching,
  } = useWordFrequency(page, pageSize);

  const handleNextPage = () => {
    if (frequencyData && !isFetching && page < frequencyData.totalPages) {
      setPage((old) => old + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const renderItem = ({ item }: { item: WordFrequency }) => (
    <ThemedView style={styles.wordItem}>
      <ThemedView style={styles.wordInfoContainer}>
        <Typography weight="medium" size="md">
          {item.word}
        </Typography>
        <Typography color="#666" style={styles.translation}>
          {item.translation}
        </Typography>
      </ThemedView>

      <ThemedView style={styles.frequencyContainer}>
        <Typography weight="medium" size="md" style={styles.frequencyNumber}>
          {item.frequency}
        </Typography>
        <Typography color="#666" size="xs">
          раз
        </Typography>
        <Typography color="#666" size="xs" style={styles.lastUsed}>
          {item.lastUsed
            ? `Последний раз: ${new Date(item.lastUsed).toLocaleDateString()}`
            : ''}
        </Typography>
      </ThemedView>
    </ThemedView>
  );

  const EmptyListComponent = () => (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={50} color="#CCC" />
      <Typography color="#666" style={styles.emptyText}>
        Нет данных о частоте использования слов
      </Typography>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Typography size="lg" style={styles.headerTitle}>
          Частотный словарь
        </Typography>
      </ThemedView>

      <Typography size="sm" style={styles.description}>
        Слова, которые вы использовали в своих текстах, отсортированные по
        частоте использования
      </Typography>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : isError ? (
        <ThemedView style={styles.errorContainer}>
          <Typography color="#FF3B30" size="md" style={styles.errorText}>
            Не удалось загрузить данные
          </Typography>
          <TouchableOpacity style={styles.retryButton}>
            <Typography color="white" weight="medium" style={styles.retryText}>
              Повторить
            </Typography>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <GestureHandlerRootView style={styles.flex1}>
          <FlatList
            data={frequencyData?.items || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.wordsList}
            ListEmptyComponent={EmptyListComponent}
          />

          {frequencyData && frequencyData.total > 0 && (
            <ThemedView style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={handlePrevPage}
                disabled={page === 1}
                style={[
                  styles.paginationButton,
                  page === 1 && styles.paginationButtonDisabled,
                ]}
              >
                <Ionicons name="chevron-back" size={18} color="#333" />
              </TouchableOpacity>

              <Typography style={styles.paginationInfo}>
                {page} из {frequencyData.totalPages}
              </Typography>

              <TouchableOpacity
                onPress={handleNextPage}
                disabled={page >= frequencyData.totalPages}
                style={[
                  styles.paginationButton,
                  page >= frequencyData.totalPages &&
                    styles.paginationButtonDisabled,
                ]}
              >
                <Ionicons name="chevron-forward" size={18} color="#333" />
              </TouchableOpacity>
            </ThemedView>
          )}
        </GestureHandlerRootView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex1: {
    flex: 1,
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
  description: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: '#666',
    textAlign: 'center',
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordInfoContainer: {
    flex: 1,
    marginRight: 8,
  },
  translation: {
    marginTop: 4,
  },
  frequencyContainer: {
    alignItems: 'center',
  },
  frequencyNumber: {
    color: '#0099FF',
  },
  lastUsed: {
    marginTop: 4,
    fontSize: 10,
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationInfo: {
    marginHorizontal: 16,
  },
});
