import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  useExercises,
  useSubmitAnswer,
  useAddExperience,
} from '@/hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/BackButton';
import Input from '../components/Input';

export default function ExerciseScreen() {
  const queryClient = useQueryClient();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Use React Query to fetch exercises
  const { data: exercises = [], isLoading, isError } = useExercises();

  // Use React Query mutation to submit answers
  const submitAnswerMutation = useSubmitAnswer();

  // Use React Query mutation to add experience points on completion
  const addExperienceMutation = useAddExperience();

  const currentExercise = exercises[currentExerciseIndex];

  const handleCheckAnswer = () => {
    if (!userAnswer.trim() || isChecking || !currentExercise) return;

    setIsChecking(true);

    submitAnswerMutation.mutate(
      {
        exerciseId: currentExercise.id,
        answer: userAnswer.trim(),
      },
      {
        onSuccess: (isAnswerCorrect) => {
          setIsCorrect(isAnswerCorrect);

          if (isAnswerCorrect) {
            // If correct, wait a moment and then move to next exercise
            setTimeout(() => {
              if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setUserAnswer('');
                setIsCorrect(null);
              } else {
                // All exercises completed - add experience and navigate to completion screen
                addExperienceMutation.mutate(100); // Award 100 XP for completion
                router.push('/exercise-complete');
              }
            }, 1500);
          }

          setIsChecking(false);
        },
        onError: () => {
          setIsChecking(false);
        },
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={styles.loadingText}>Загрузка упражнений...</Text>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Ошибка загрузки упражнений</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ['exercises'] })
          }
        >
          <Text style={styles.retryButtonText}>Попробовать снова</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Ionicons name="book-outline" size={48} color="#999" />
        <Text style={styles.loadingText}>Нет доступных упражнений</Text>
        <ThemedView style={styles.backButtonWrapper}>
          <BackButton onPress={() => router.back()} />
          <Text style={styles.retryButtonText}>Вернуться назад</Text>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Упражнение</Text>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      <ThemedView style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Выполнено {currentExerciseIndex + 1} из {exercises.length} заданий до
          получения опыта
        </Text>
        <ThemedView style={styles.progressBar}>
          <ThemedView
            style={[
              styles.progressFill,
              {
                width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%`,
              },
            ]}
          />
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.exerciseContainer}>
        <Text style={styles.instructionText}>
          {currentExercise.type === 'fill-blank'
            ? 'Вставьте слово, которое лучше всего подходит:'
            : 'Переведите предложение:'}
        </Text>

        {currentExercise && (
          <ThemedView style={styles.textContainer}>
            <Text style={styles.exerciseText}>
              {currentExercise.text.includes('_____')
                ? currentExercise.text.split('_____')[0]
                : currentExercise.text}
              {currentExercise.text.includes('_____') && (
                <>
                  <Text style={styles.blankLine}></Text>
                  {currentExercise.text.split('_____')[1]}
                </>
              )}
            </Text>
            {currentExercise.hint && isCorrect === false && (
              <Text style={styles.hintText}>
                Подсказка: {currentExercise.hint}
              </Text>
            )}
          </ThemedView>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <Input
          variant={
            isCorrect === true
              ? 'success'
              : isCorrect === false
                ? 'error'
                : 'default'
          }
          placeholder="Введите текст..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          fullWidth
          editable={isChecking === false && isCorrect !== true}
        />

        <TouchableOpacity
          style={[
            styles.checkButton,
            !userAnswer.trim() || isChecking ? styles.disabledButton : null,
          ]}
          onPress={handleCheckAnswer}
          disabled={!userAnswer.trim() || isChecking || isCorrect === true}
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Проверить</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0099FF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099FF',
    borderRadius: 4,
  },
  exerciseContainer: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  textContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  exerciseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  blankLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingHorizontal: 8,
  },
  hintText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0099FF',
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  correctInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectInput: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  checkButton: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0D4F7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
