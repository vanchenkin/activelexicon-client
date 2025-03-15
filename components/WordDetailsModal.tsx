import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  Pressable,
  View,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordDetails } from '@/services/translationService';
import Typography from './Typography';
import { ThemedView } from './ThemedView';

interface WordDetailsModalProps {
  visible: boolean;
  word: WordDetails | null;
  onClose: () => void;
  onAdd: () => void;
  isAlreadyAdded?: boolean;
}

export default function WordDetailsModal({
  visible,
  word,
  onClose,
  onAdd,
  isAlreadyAdded = false,
}: WordDetailsModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isAdding) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [isAdding]);

  if (!word) return null;

  const formatPartOfSpeech = () => {
    if (word.gender) {
      return `${word.partOfSpeech}, ${word.gender}`;
    }
    return word.partOfSpeech;
  };

  const handleAddWord = () => {
    setIsAdding(true);
    onAdd();

    // Scale animation for the container
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();

    // Fade in animation for success message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

    // Close the modal after animation
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ThemedView style={styles.container}>
              <Typography size="lg" style={styles.word}>
                {word.word}
              </Typography>
              <Typography size="lg" style={styles.translation}>
                {word.translation}
              </Typography>
              <Typography color="#666" style={styles.partOfSpeech}>
                {formatPartOfSpeech()}
              </Typography>
              <Typography style={styles.example}>{word.example}</Typography>

              {isAdding ? (
                <Animated.View
                  style={[styles.successContainer, { opacity: fadeAnim }]}
                >
                  <Ionicons name="checkmark-circle" size={36} color="#4CAF50" />
                  <Typography
                    color="#4CAF50"
                    weight="medium"
                    style={styles.successText}
                  >
                    Слово добавлено!
                  </Typography>
                </Animated.View>
              ) : !isAlreadyAdded ? (
                <Pressable style={styles.addButton} onPress={handleAddWord}>
                  <Ionicons name="add-circle" size={40} color="#0099FF" />
                </Pressable>
              ) : (
                <ThemedView style={styles.addedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Typography color="#4CAF50" style={styles.addedText}>
                    Добавлено
                  </Typography>
                </ThemedView>
              )}
            </ThemedView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '80%',
    marginHorizontal: 20,
  },
  animatedContainer: {
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    position: 'relative',
    minHeight: 180,
  },
  word: {
    fontSize: 18,
    marginBottom: 8,
  },
  translation: {
    fontSize: 18,
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  example: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addedText: {
    marginLeft: 4,
    fontSize: 14,
  },
  successContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
  },
  successText: {
    fontSize: 18,
    marginTop: 12,
  },
});
