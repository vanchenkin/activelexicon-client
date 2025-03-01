import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { mockWordsService, UserWord } from '@/services/mockWordsService';

export default function WordsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<UserWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setIsLoading(true);
      const userWords = await mockWordsService.getUserWords();
      setWords(userWords);
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      loadWords();
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await mockWordsService.searchUserWords(query);
      setWords(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddWord = () => {
    // Navigate to add word screen or show a modal
    console.log('Add word');
  };

  const handleDeleteWord = async (wordId: string) => {
    try {
      const success = await mockWordsService.deleteWord(wordId);
      if (success) {
        setWords(words.filter(word => word.id !== wordId));
      }
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderWordItem = ({ item }: { item: UserWord }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordInfo}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={styles.wordDivider} />
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteWord(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="information-circle-outline" size={48} color="#999" style={styles.emptyIcon} />
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'Не найдено слов по вашему запросу'
          : 'У вас еще нет слов. Добавьте их!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={[styles.screenTitle, {position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center'}]}>
        СПИСОК МОИХ СЛОВ
      </Text>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Изучаемые слова</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddWord}
        >
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Введите слово..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.plusButton}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.wordsList,
            words.length === 0 && styles.emptyListContent
          ]}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
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
  wordDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
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
    color: '#666',
    textAlign: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  plusButton: {
    padding: 8,
  }
}); 