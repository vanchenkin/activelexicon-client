import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TextStyle } from 'react-native';
import Typography from './Typography';

interface SelectableWordProps {
  word: string;
  isSelected?: boolean;
  onPress: (word: string) => void;
  style?: object;
  progress?: number;
  showProgressIndicator?: boolean;
}

export default function SelectableWord({
  word,
  isSelected = false,
  onPress,
  style,
  progress,
  showProgressIndicator = false,
}: SelectableWordProps) {
  const getProgressStyle = (progress?: number): TextStyle => {
    if (!progress) return {};
    if (progress >= 6) return styles.wordLearnedWell;
    if (progress >= 3) return styles.wordLearning;
    return styles.wordNew;
  };

  if (progress !== undefined && showProgressIndicator) {
    return (
      <Text
        style={[getProgressStyle(progress), style]}
        onPress={() => onPress(word.toLowerCase())}
      >
        {word}
      </Text>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(word.toLowerCase())}
      style={[styles.wordTouchable, isSelected && styles.selectedWord, style]}
    >
      <Typography>{word}</Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wordTouchable: {
    borderRadius: 4,
    marginVertical: 2,
  },
  selectedWord: {
    backgroundColor: '#E3F2FD',
  },
  wordNew: {
    color: '#FF9800',
    fontWeight: '400',
  },
  wordLearning: {
    color: '#7986CB',
    fontWeight: '500',
  },
  wordLearnedWell: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressIndicator: {
    fontSize: 12,
    verticalAlign: 'top',
  },
});
