import React from 'react';
import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';

interface CorrectionResult {
  isCorrect: boolean;
  suggestions: string;
}

interface CorrectionModalProps {
  visible: boolean;
  correctionResult: CorrectionResult | null;
  onClose: () => void;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({
  visible,
  correctionResult,
  onClose,
}) => {
  return (
    <ThemedView>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.loadingPopup}>
            {correctionResult && (
              <>
                <Ionicons
                  name={
                    correctionResult.isCorrect
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={48}
                  color={correctionResult.isCorrect ? '#4CAF50' : '#F44336'}
                  style={styles.resultIcon}
                />
                <Typography style={styles.resultTitle}>
                  {correctionResult.isCorrect ? 'Правильно!' : 'Есть ошибки'}
                </Typography>

                {!correctionResult.isCorrect &&
                  correctionResult.suggestions && (
                    <>
                      <Typography style={styles.suggestionsTitle}>
                        Рекомендации:
                      </Typography>
                      <Typography style={styles.suggestion}>
                        {correctionResult.suggestions}
                      </Typography>
                    </>
                  )}

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Typography style={styles.closeButtonText}>
                    Закрыть
                  </Typography>
                </TouchableOpacity>
              </>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingPopup: {
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  resultIcon: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
    color: '#555',
  },
  suggestion: {
    fontSize: 14,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0099FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CorrectionModal;
