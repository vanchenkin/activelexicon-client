import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import Typography from './Typography';

type ExerciseContentProps = {
  exercise: {
    text: string;
    hint?: string;
    type?: string;
  };
  isCorrect: boolean | null;
};

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercise,
  isCorrect,
}) => {
  return (
    <ThemedView style={styles.textContainer}>
      <Typography style={styles.exerciseText}>
        {exercise.text.includes('_____')
          ? exercise.text.split('_____')[0]
          : exercise.text}
        {exercise.text.includes('_____') && (
          <>
            <View style={styles.blankLine} />
            {exercise.text.split('_____')[1]}
          </>
        )}
      </Typography>
      {exercise.hint && isCorrect === false && (
        <Typography style={styles.hintText}>
          Подсказка: {exercise.hint}
        </Typography>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
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
});

export default ExerciseContent;
