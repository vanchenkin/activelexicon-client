import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import Typography from './Typography';
import { Word } from '../services/wordsService';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THRESHOLD = -SCREEN_WIDTH * 0.3;

interface WordItemProps {
  item: Word;
  onDelete: (wordId: string) => void;
}

const WordItem = ({ item, onDelete }: WordItemProps) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(72);
  const opacity = useSharedValue(1);

  const handleDelete = (wordId: string) => {
    itemHeight.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onDelete)(wordId);
    });
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = Math.min(0, event.translationX);
    },
    onEnd: (event) => {
      if (translateX.value < THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(handleDelete)(item.id);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      opacity: opacity.value,
      marginBottom: itemHeight.value === 0 ? 0 : 8,
    };
  });

  return (
    <Animated.View style={[styles.container, rContainerStyle]}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.wordItem, rStyle]}>
          <ThemedView style={styles.wordInfo}>
            <Typography style={styles.wordText}>{item.word}</Typography>
            <Typography color="#666" style={styles.translationText}>
              {item.translation}
            </Typography>
          </ThemedView>
          <Animated.View style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.deleteIndicator]}>
        <Ionicons name="trash" size={24} color="#fff" />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  wordItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    zIndex: 1,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    marginBottom: 8,
  },
  translationText: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIndicator: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 80,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WordItem;
