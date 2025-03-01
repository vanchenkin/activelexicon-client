import React from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordDetails } from '@/services/mockTranslationService';
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
  if (!word) return null;

  const formatPartOfSpeech = () => {
    if (word.gender) {
      return `${word.partOfSpeech}, ${word.gender}`;
    }
    return word.partOfSpeech;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <ThemedView
          style={styles.container}
          onStartShouldSetResponder={() => true}
        >
          <Typography weight="bold" size="lg" style={styles.word}>
            {word.word}
          </Typography>
          <Typography size="lg" style={styles.translation}>
            {word.translation}
          </Typography>
          <Typography color="#666" style={styles.partOfSpeech}>
            {formatPartOfSpeech()}
          </Typography>
          <Typography style={styles.example}>{word.example}</Typography>

          {!isAlreadyAdded ? (
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Ionicons name="add-circle" size={32} color="#0099FF" />
            </TouchableOpacity>
          ) : (
            <ThemedView style={styles.addedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Typography color="#4CAF50" style={styles.addedText}>
                Добавлено
              </Typography>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    position: 'relative',
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
});
