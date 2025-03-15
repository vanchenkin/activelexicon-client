import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  useExercises,
  useSubmitAnswer,
  useAddExperience,
} from '@/hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import Input from '../components/Input';
import Typography from '@/components/Typography';
import ExerciseContent from '../components/ExerciseContent';
import ProgressBar from '../components/ProgressBar';
import BackButton from '@/components/BackButton';

export default function ExerciseScreen() {
  const queryClient = useQueryClient();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: exercises = [], isLoading, isError } = useExercises();

  const submitAnswerMutation = useSubmitAnswer();

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
            setTimeout(() => {
              if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setUserAnswer('');
                setIsCorrect(null);
              } else {
                addExperienceMutation.mutate(100);
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
        <Typography style={styles.loadingText}>
          Загрузка упражнений...
        </Typography>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Typography style={styles.errorText}>
          Ошибка загрузки упражнений
        </Typography>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ['exercises'] })
          }
        >
          <Typography style={styles.retryButtonText}>
            Попробовать снова
          </Typography>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Ionicons name="book-outline" size={48} color="#999" />
        <Typography style={styles.loadingText}>
          Нет доступных упражнений
        </Typography>
        <ThemedView style={styles.backButtonWrapper}>
          <BackButton onPress={() => router.back()} />
          <Typography style={styles.retryButtonText}>
            Вернуться назад
          </Typography>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Упражнение" onBackPress={handleBack} />

      <ProgressBar current={currentExerciseIndex} total={exercises.length} />

      <ScrollView style={styles.exerciseContainer}>
        <Typography weight="medium" style={styles.instructionText}>
          {currentExercise.type === 'fill-blank'
            ? 'Вставьте слово, которое лучше всего подходит:'
            : 'Переведите предложение:'}
        </Typography>

        {currentExercise && (
          <ExerciseContent exercise={currentExercise} isCorrect={isCorrect} />
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
            <Typography style={styles.buttonText}>Проверить</Typography>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ThemedView>
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
  exerciseContainer: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
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
