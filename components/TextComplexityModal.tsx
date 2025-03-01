import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Typography from './Typography';
import { ThemedView } from './ThemedView';

type TextComplexity = 'easy' | 'medium' | 'hard';

interface TextComplexityModalProps {
  visible: boolean;
  onClose: () => void;
  initialComplexity?: TextComplexity;
  onComplexityChange: (complexity: TextComplexity) => void;
}

export default function TextComplexityModal({
  visible,
  onClose,
  initialComplexity = 'medium',
  onComplexityChange,
}: TextComplexityModalProps) {
  const router = useRouter();
  const [selectedComplexity, setSelectedComplexity] =
    useState<TextComplexity>(initialComplexity);

  const handleComplexitySelect = (complexity: TextComplexity) => {
    setSelectedComplexity(complexity);
    onComplexityChange(complexity);
  };

  const handleMyWordsList = () => {
    // Navigate to words list
    onClose();
    router.push('/(tabs)/words');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <TouchableOpacity
            style={styles.wordListButton}
            onPress={handleMyWordsList}
          >
            <Typography style={styles.wordListButtonText}>
              Мой список слов
            </Typography>
          </TouchableOpacity>

          <ThemedView style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#666"
              style={styles.infoIcon}
            />
            <Typography color="#666" style={styles.infoText}>
              Если текст вам кажется слишком легким или слишком трудным, то
              можете изменить его сложность
            </Typography>
          </ThemedView>

          <Typography weight="medium" size="lg" style={styles.complexityTitle}>
            Выберите сложность текста:
          </Typography>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'easy' && styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('easy')}
          >
            <Typography style={styles.complexityButtonText}>Легче</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'medium' &&
                styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('medium')}
          >
            <Typography style={styles.complexityButtonText}>Средняя</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'hard' && styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('hard')}
          >
            <Typography style={styles.complexityButtonText}>Сложнее</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  wordListButton: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  wordListButtonText: {
    color: '#333',
    fontSize: 16,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  complexityTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  complexityButton: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  selectedComplexityButton: {
    backgroundColor: '#E1F5FE',
    borderWidth: 1,
    borderColor: '#0099FF',
  },
  complexityButtonText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
  },
});
