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
import { Exercise } from '../services/api';

type ExerciseContentProps = {
  exercise: Exercise;
  correctnessResponse: {
    correct: boolean;
    recommendations: string;
  } | null;
};

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercise,
  correctnessResponse,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const borderColor = useSharedValue('#EEE');
  const confettiRef = useRef<LottieView>(null);

  useEffect(() => {
    if (correctnessResponse?.correct) {
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
    } else if (correctnessResponse && !correctnessResponse.correct) {
      borderColor.value = '#FF3B30';
    } else {
      borderColor.value = '#EEE';
    }
  }, [correctnessResponse, scale, opacity, borderColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      borderColor: borderColor.value,
    };
  });

  const showHintText = correctnessResponse && !correctnessResponse.correct;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Typography style={styles.exerciseText}>{exercise.content}</Typography>

        {showHintText && exercise.hint && (
          <Typography style={styles.hintText}>
            Подсказка: {exercise.hint}
          </Typography>
        )}

        {correctnessResponse && correctnessResponse.recommendations && (
          <Typography style={styles.hintText}>
            Рекомендации: {correctnessResponse.recommendations}
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
