import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWords } from '@/hooks/useApi';
import { ThemedView } from '../../components/ThemedView';
import Button from '../../components/Button';
import Typography from '../../components/Typography';

export default function HomeScreen() {
  const router = useRouter();
  const { data: words, isLoading } = useWords();

  const hasWords = words && words.length > 0;

  const handleStartExercises = () => {
    router.push('/exercise');
  };

  const handleAddWords = () => {
    router.push('/(tabs)/explore');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Typography>Загрузка...</Typography>
      </ThemedView>
    );
  }

  if (!hasWords) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.emptyContainer}>
          <ThemedView style={styles.emptyIconContainer}>
            <Ionicons name="library-outline" size={40} color="#666" />
          </ThemedView>

          <Typography style={styles.emptyText}>
            У вас еще нет слов для изучения.{'\n'}
            Добавьте их!
          </Typography>
        </ThemedView>

        <Button title="Добавить слова" onPress={handleAddWords} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Typography style={styles.title} size="2xl">
        Лента заданий
      </Typography>

      <Typography style={styles.description}>
        Вам предстоит выполнять упражнения. Они будут подбираться в случайном
        порядке на основе вашего словаря и уровня английского языка
      </Typography>

      <Typography style={styles.sectionTitle}>Типы заданий:</Typography>

      <ScrollView style={styles.exerciseList}>
        <ThemedView style={styles.exerciseCard}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={32} color="#666" />
          </ThemedView>
          <ThemedView style={styles.exerciseContent}>
            <Typography style={styles.exerciseTitle}>
              Составить текст
            </Typography>
            <Typography style={styles.exerciseDescription}>
              Составьте небольшой текст с данным словом
            </Typography>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.exerciseCard}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons name="help-circle-outline" size={32} color="#666" />
          </ThemedView>
          <ThemedView style={styles.exerciseContent}>
            <Typography style={styles.exerciseTitle}>
              Ответьте на вопрос
            </Typography>
            <Typography style={styles.exerciseDescription}>
              Дайте развернутый ответ на вопрос
            </Typography>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.exerciseCard}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons name="pencil-outline" size={32} color="#666" />
          </ThemedView>
          <ThemedView style={styles.exerciseContent}>
            <Typography style={styles.exerciseTitle}>Вставить слово</Typography>
            <Typography style={styles.exerciseDescription}>
              Вставьте наиболее подходящее слово в предложение
            </Typography>
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
