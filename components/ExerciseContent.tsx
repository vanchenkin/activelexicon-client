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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
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
      </Animated.View>

      {isCorrect === true && (
        <>
          <View style={styles.lottieContainer}>
            <LottieView
              ref={confettiRef}
              source={require('../assets/animations/confetti.json')}
              style={styles.confettiAnimation}
              autoPlay={true}
              loop={false}
              speed={1.2}
            />
          </View>
        </>
      )}
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
    width: 300,
    height: 300,
  },
  successContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'none',
  },
  successAnimation: {
    width: 100,
    height: 100,
  },
});

export default ExerciseContent;
