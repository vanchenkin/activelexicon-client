import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.wordListButton}
            onPress={handleMyWordsList}
          >
            <Text style={styles.wordListButtonText}>Мой список слов</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Если текст вам кажется слишком легким или слишком трудным, то
              можете изменить его сложность
            </Text>
          </View>

          <Text style={styles.complexityTitle}>Выберите сложность текста:</Text>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'easy' && styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('easy')}
          >
            <Text style={styles.complexityButtonText}>Легче</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'medium' &&
                styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('medium')}
          >
            <Text style={styles.complexityButtonText}>Средняя</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.complexityButton,
              selectedComplexity === 'hard' && styles.selectedComplexityButton,
            ]}
            onPress={() => handleComplexitySelect('hard')}
          >
            <Text style={styles.complexityButtonText}>Сложнее</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
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
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  wordListButton: {
    backgroundColor: '#0099FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  wordListButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  complexityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  complexityButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  selectedComplexityButton: {
    backgroundColor: '#0099FF',
  },
  complexityButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 10,
  },
});
