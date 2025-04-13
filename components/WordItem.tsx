import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import Typography from './Typography';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DictionaryWord } from '../services/api/dictionaryService';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THRESHOLD = -SCREEN_WIDTH * 0.3;

interface WordItemProps {
  item: DictionaryWord;
  onDelete: (wordId: string) => void | Promise<void>;
}

const WordItem = ({ item, onDelete }: WordItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const translateX = useSharedValue(0);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(item.word);
    } catch (error) {
      translateX.value = withSpring(0);
      setIsDeleting(false);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd(() => {
      if (translateX.value < THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(handleDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const getProgressColor = () => {
    const progress = item.progress || 0;
    if (progress >= 6) return '#3F51B5';
    if (progress >= 3) return '#7986CB';
    return '#64B5F6';
  };

  const getProgressLabel = () => {
    const progress = item.progress || 0;
    if (progress >= 6) return 'Освоено';
    if (progress >= 3) return 'Изучается';
    return 'Новое';
  };

  const getProgressIcon = () => {
    const progress = item.progress || 0;
    if (progress >= 6) return 'checkmark-circle';
    if (progress >= 3) return 'time';
    return 'school';
  };

  return (
    <Animated.View style={[styles.container]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.wordItem, rStyle]}>
          <ThemedView style={styles.wordInfo}>
            <ThemedView style={styles.headerRow}>
              <Typography style={styles.wordText}>{item.word}</Typography>
              <ThemedView
                style={[
                  styles.progressBadge,
                  { backgroundColor: getProgressColor() },
                ]}
              >
                <Ionicons
                  name={getProgressIcon()}
                  size={12}
                  color="white"
                  style={styles.progressIcon}
                />
                <Typography style={styles.progressText}>
                  {getProgressLabel()}
                </Typography>
              </ThemedView>
            </ThemedView>
            <Typography style={styles.translationText}>
              {item.translations
                .map((translation) => translation.text)
                .join(', ')}
            </Typography>
            <ThemedView style={styles.progressBarContainer}>
              <ThemedView
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(100, ((item.progress || 0) / 7) * 100)}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </ThemedView>
            {item.isReadyToRepeat && (
              <ThemedView style={styles.repeatBadge}>
                <Ionicons name="refresh" size={12} />
                <Typography style={styles.repeatText}>
                  Готово к повторению
                </Typography>
              </ThemedView>
            )}
          </ThemedView>
          <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
            <Animated.View style={styles.deleteButton}>
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '500',
  },
  translationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIndicator: {
    position: 'absolute',
    right: 0,
    height: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressIcon: {
    marginRight: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  repeatText: {
    fontSize: 10,
    marginLeft: 4,
  },
});

export default WordItem;
