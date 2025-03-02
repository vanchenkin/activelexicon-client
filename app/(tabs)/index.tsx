import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWords } from '@/hooks/useApi';
import { ThemedView } from '../../components/ThemedView';
import Button from '../../components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { data: words, isLoading } = useWords();
  const [hasWords, setHasWords] = useState(false);

  useEffect(() => {
    if (words && words.length > 0) {
      setHasWords(true);
    } else {
      setHasWords(false);
    }
  }, [words]);

  const handleStartExercises = () => {
    // Navigate to exercise screen
    router.push('/exercise');
  };

  const handleAddWords = () => {
    // Navigate to add words screen
    router.push('/(tabs)/explore');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Text>Загрузка...</Text>
      </ThemedView>
    );
  }

  if (!hasWords) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.emptyContainer}>
          <ThemedView style={styles.emptyIconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={40}
              color="#666"
            />
          </ThemedView>

          <Text style={styles.emptyText}>
            У вас еще нет слов для изучения.{'\n'}
            Добавьте их!
          </Text>
        </ThemedView>

        <Button title="Добавить слова" onPress={handleAddWords} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Лента заданий</Text>

      <Text style={styles.description}>
        Вам предстоит выполнять упражнения. Они будут подбираться в случайном
        порядке на основе вашего словаря и уровня английского языка
      </Text>

      <Text style={styles.sectionTitle}>Типы заданий:</Text>

      <ScrollView style={styles.exerciseList}>
        <ThemedView style={styles.exerciseCard}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={32}
              color="#666"
            />
          </ThemedView>
          <ThemedView style={styles.exerciseContent}>
            <Text style={styles.exerciseTitle}>Составить предложение</Text>
            <Text style={styles.exerciseDescription}>
              Составьте предложение с данным словом
            </Text>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.exerciseCard}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons name="text-outline" size={32} color="#666" />
          </ThemedView>
          <ThemedView style={styles.exerciseContent}>
            <Text style={styles.exerciseTitle}>Вставить слово</Text>
            <Text style={styles.exerciseDescription}>
              Вставьте наиболее подходящее слово в предложение
            </Text>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <Button title="Начать упражнения" onPress={handleStartExercises} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exerciseList: {
    flex: 1,
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0099FF',
    borderRadius: 5,
    margin: 20,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
