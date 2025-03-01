import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordDetails } from '@/services/mockTranslationService';

interface WordDetailsModalProps {
  visible: boolean;
  wordDetails: WordDetails | null;
  onClose: () => void;
  onAddWord: (word: string) => void;
}

export default function WordDetailsModal({
  visible,
  wordDetails,
  onClose,
  onAddWord,
}: WordDetailsModalProps) {
  if (!wordDetails) return null;

  const handleAddWord = () => {
    onAddWord(wordDetails.word);
    onClose();
  };

  const formatPartOfSpeech = () => {
    if (wordDetails.gender) {
      return `${wordDetails.partOfSpeech}, ${wordDetails.gender}`;
    }
    return wordDetails.partOfSpeech;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <Text style={styles.word}>{wordDetails.word}</Text>
          <Text style={styles.translation}>{wordDetails.translation}</Text>
          <Text style={styles.partOfSpeech}>{formatPartOfSpeech()}</Text>
          <Text style={styles.example}>{wordDetails.example}</Text>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
            <Ionicons name="add-circle" size={32} color="#0099FF" />
          </TouchableOpacity>
        </View>
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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  translation: {
    fontSize: 18,
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#666',
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
}); 