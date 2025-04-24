import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TextStyle } from 'react-native';
import Typography from './Typography';

interface SelectableWordProps {
  word: string;
  originalWord?: string;
  isSelected?: boolean;
  onPress: (word: string, originalWord?: string) => void;
  style?: object;
  progress?: number;
  showProgressIndicator?: boolean;
}

export default function SelectableWord({
  word,
  originalWord,
  isSelected = false,
  onPress,
  style,
}: SelectableWordProps) {
  const isSpace = word.trim() === '';

  return (
    <TouchableOpacity
      onPress={() => !isSpace && onPress(word.toLowerCase(), originalWord)}
      style={[styles.wordTouchable, isSelected && styles.selectedWord, style]}
      disabled={isSpace}
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
