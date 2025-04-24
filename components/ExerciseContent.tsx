import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Typography from './Typography';
import { Exercise, ExerciseType } from '../services/api';

type ExerciseContentProps = {
  exercise: Exercise;
  isCorrect: boolean | null;
  userAnswer?: string;
};

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercise,
  isCorrect,
  userAnswer,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const borderColor = useSharedValue('#EEE');
  const confettiRef = useRef<LottieView>(null);

  useEffect(() => {
    if (isCorrect) {
      borderColor.value = '#4CD964';
      scale.value = withSequence(
        withTiming(1.05, {
          duration: 200,
          easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
        }),
        withTiming(1, {
          duration: 200,
          easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
        })
      );

      opacity.value = withDelay(
        400,
        withSequence(
          withTiming(0.7, {
            duration: 300,
            easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
          }),
          withTiming(1, {
            duration: 300,
            easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
          })
        )
      );

      if (confettiRef.current) {
        confettiRef.current.reset();
        confettiRef.current.play();
      }
    } else if (isCorrect === false) {
      borderColor.value = '#FF3B30';
    } else {
      borderColor.value = '#EEE';
    }
  }, [isCorrect, scale, opacity, borderColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      borderColor: borderColor.value,
    };
  });

  const renderContent = () => {
    switch (exercise.type) {
      case ExerciseType.FillWord:
      case ExerciseType.AnswerQuestion:
      case ExerciseType.WriteText:
        return exercise.content;
    }

    return exercise.content;
  };

  const showHintText = isCorrect === false;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Typography style={styles.exerciseText}>{renderContent()}</Typography>

        {showHintText && exercise.hint && (
          <Typography style={styles.hintText}>
            Подсказка: {exercise.hint}
          </Typography>
        )}
      </Animated.View>

      <View style={styles.lottieContainer}>
        <LottieView
          ref={confettiRef}
          source={require('../assets/animations/confetti.json')}
          style={styles.confettiAnimation}
          autoPlay={false}
          loop={false}
          speed={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  textContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  exerciseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  hintText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0099FF',
    fontStyle: 'italic',
  },
  lottieContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: -50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  confettiAnimation: {
    width: 400,
    height: 400,
  },
  correctAnswer: {
    fontWeight: 'bold',
    color: '#4CD964',
  },
});

export default ExerciseContent;
