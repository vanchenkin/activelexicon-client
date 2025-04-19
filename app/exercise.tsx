import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  useNextExercise,
  useSubmitAnswer,
  useProfileStats,
} from '@/hooks/useApi';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import Input from '../components/Input';
import Typography from '@/components/Typography';
import ExerciseContent from '../components/ExerciseContent';
import ProgressBar from '../components/ProgressBar';
import Button from '@/components/Button';
import { ExerciseType, Exercise } from '../services/api';
import { StatsData } from '@/services/api/profileService';

const REQUIRED_EXERCISES = 2;

export default function ExerciseScreen() {
  const queryClient = useQueryClient();
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [initialXP, setInitialXP] = useState(0);
  const { data: profileStats } = useProfileStats();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const nextExerciseMutation = useNextExercise();
  const submitAnswerMutation = useSubmitAnswer();

  const initialFetchRef = useRef(false);

  const fetchNextExercise = useCallback(() => {
    setIsLoading(true);
    setIsError(false);

    nextExerciseMutation.mutate(undefined, {
      onSuccess: (newExercise) => {
        setIsCorrect(null);
        setUserAnswer('');
        setExercise(newExercise);
        setIsLoading(false);
      },
      onError: () => {
        setIsError(true);
        setIsLoading(false);
      },
    });
  }, [nextExerciseMutation]);

  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchNextExercise();
    }
  }, [fetchNextExercise]);

  useEffect(() => {
    if (completedExercises === 0 && profileStats) {
      setInitialXP(profileStats.general.points);
    }
  }, [completedExercises, profileStats]);

  const handleCheckAnswer = () => {
    if (!userAnswer.trim() || isChecking || !exercise) return;

    setIsChecking(true);

    submitAnswerMutation.mutate(
      {
        exerciseId: exercise.id,
        answer: userAnswer.trim(),
      },
      {
        onSuccess: (isAnswerCorrect) => {
          setIsCorrect(isAnswerCorrect);

          if (isAnswerCorrect) {
            const newCompletedCount = completedExercises + 1;
            setCompletedExercises(newCompletedCount);

            queryClient.invalidateQueries({ queryKey: ['profileStats'] });

            setTimeout(() => {
              if (newCompletedCount >= REQUIRED_EXERCISES) {
                queryClient
                  .fetchQuery<StatsData>({ queryKey: ['profileStats'] })
                  .then((stats) => {
                    const currentXP = stats.general.points;
                    const gainedXP = currentXP - initialXP;

                    router.push({
                      pathname: '/exercise-complete',
                      params: {
                        gainedXP: gainedXP.toString(),
                        initialXP: initialXP.toString(),
                      },
                    });
                  });
              } else {
                fetchNextExercise();
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
    router.replace('/');
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
          onPress={fetchNextExercise}
        >
          <Typography style={styles.retryButtonText}>
            Попробовать снова
          </Typography>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!exercise) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Ionicons name="book-outline" size={48} color="#999" />
        <Typography style={styles.loadingText}>
          На сегодня упражнения закончились
        </Typography>
        <Button
          title="Вернуться назад"
          onPress={handleBack}
          variant="primary"
          size="small"
          style={{ marginTop: 20 }}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Упражнение" onBackPress={handleBack} />

      <ProgressBar current={completedExercises} total={REQUIRED_EXERCISES} />

      <ScrollView style={styles.exerciseContainer}>
        <Typography weight="medium" style={styles.instructionText}>
          {exercise.type === ExerciseType.FillWord
            ? 'Вставьте слово, которое лучше всего подходит:'
            : exercise.type === ExerciseType.AnswerQuestion
              ? 'Ответьте на вопрос используя 1-2 предложения:'
              : 'Составьте текст с данным словом:'}
        </Typography>

        <ExerciseContent
          exercise={exercise}
          isCorrect={isCorrect}
          userAnswer={userAnswer}
        />
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
          multiline={true}
          textAlignVertical="top"
          numberOfLines={4}
          style={styles.multilineInput}
        />

        <Button
          title="Проверить"
          onPress={handleCheckAnswer}
          disabled={!userAnswer.trim() || isChecking || isCorrect === true}
          isLoading={isChecking}
          fullWidth
        />
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
  multilineInput: {
    minHeight: 100,
    maxHeight: 200,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
});
