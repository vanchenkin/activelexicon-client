import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

const BackButton = ({
  onPress,
  color = '#333',
  size = 32,
}: BackButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    position: 'absolute',
    zIndex: 1000,
    top: 24,
    left: 24,
  },
});

export default BackButton;
