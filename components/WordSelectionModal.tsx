import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Typography from './Typography';
import { ThemedView } from './ThemedView';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';
import { useGetWord } from '../hooks/useApi';

interface WordSelectionModalProps {
  visible: boolean;
  selectedWord: string | null;
  onClose: () => void;
  onAddToDictionary: (word: string) => void;
  isAlreadyAdded: boolean;
}

export default function WordSelectionModal({
  visible,
  selectedWord,
  onClose,
  onAddToDictionary,
  isAlreadyAdded,
}: WordSelectionModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { data: wordData, isLoading } = useGetWord(selectedWord || '');
  const translations = wordData?.translations;

  useEffect(() => {
    if (!isAdding) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [isAdding, fadeAnim, scaleAnim]);

  const handleAddToDictionary = () => {
    if (selectedWord) {
      setIsAdding(true);
      onAddToDictionary(selectedWord);

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

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();

      setTimeout(() => {
        setIsAdding(false);
        onClose();
      }, 1800);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
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
            <ThemedView style={styles.wordModal}>
              <Typography style={styles.wordModalTitle}>
                Выбрано слово
              </Typography>
              <Typography style={styles.selectedWordText}>
                {selectedWord}
              </Typography>

              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#0099FF"
                  style={styles.loader}
                />
              ) : translations ? (
                <Typography style={styles.translationText}>
                  {translations
                    .map((translation) => translation.text)
                    .join(', ')}
                </Typography>
              ) : null}

              {isAdding ? (
                <Animated.View
                  style={[styles.successContainer, { opacity: fadeAnim }]}
                >
                  <Ionicons name="checkmark-circle" size={36} color="#4CAF50" />
                  <Typography color="#4CAF50" style={styles.successText}>
                    Слово добавлено!
                  </Typography>
                </Animated.View>
              ) : !isAlreadyAdded ? (
                <View style={styles.modalButtons}>
                  <Button
                    title="Добавить в словарь"
                    onPress={handleAddToDictionary}
                    style={styles.addButton}
                  />
                  <Button
                    title="Отмена"
                    onPress={onClose}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    alignSelf: 'center',
    maxWidth: 400,
  },
  animatedContainer: {
    width: '100%',
  },
  wordModal: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 180,
  },
  wordModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  selectedWordText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0099FF',
    marginBottom: 12,
  },
  translationText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  addButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
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
    borderRadius: 16,
  },
  successText: {
    fontSize: 18,
    marginTop: 12,
  },
  addedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedText: {
    marginLeft: 4,
    fontSize: 14,
  },
  loader: {
    marginBottom: 24,
  },
});
