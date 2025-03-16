import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import Typography from './Typography';
import { Word } from '../services/wordsService';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THRESHOLD = -SCREEN_WIDTH * 0.3;

interface WordItemProps {
  item: Word;
  onDelete: (wordId: string) => void;
}

const WordItem = ({ item, onDelete }: WordItemProps) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (translateX.value < THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(onDelete)(item.word);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.container]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.wordItem, rStyle]}>
          <ThemedView style={styles.wordInfo}>
            <Typography style={styles.wordText}>{item.word}</Typography>
            <Typography style={styles.translationText}>
              {item.translation}
            </Typography>
          </ThemedView>
          <TouchableOpacity onPress={() => onDelete(item.word)}>
            <Animated.View style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wordItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  wordInfo: {
    flex: 1,
    borderRadius: 10,
  },
  wordText: {
    fontSize: 16,
    marginBottom: 6,
  },
  translationText: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 10,
  },
  deleteIndicator: {
    position: 'absolute',
    right: 0,
    height: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WordItem;
