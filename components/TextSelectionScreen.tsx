import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAddWord } from '@/hooks/useApi';
import Typography from './Typography';
import { ThemedView } from './ThemedView';
import Button from './Button';
import SelectableWord from './SelectableWord';
import WordSelectionModal from './WordSelectionModal';
import { processText, ProcessedTextItem } from '../utils/textProcessing';

interface TextSelectionScreenProps {
  generatedText: string;
  onRegenerateText: () => void;
  onDone: () => void;
  onWordSelected?: (word: string) => void;
}

export default function TextSelectionScreen({
  generatedText,
  onRegenerateText,
  onDone,
  onWordSelected,
}: TextSelectionScreenProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [processedText, setProcessedText] = useState<ProcessedTextItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [loadingWord, setLoadingWord] = useState(false);

  const addWord = useAddWord();

  useEffect(() => {
    if (generatedText) {
      setProcessedText(processText(generatedText));
    }
  }, [generatedText]);

  const handleWordPress = async (word: string, originalWord?: string) => {
    if (loadingWord) return;

    const wordToUse = originalWord || word;

    try {
      setLoadingWord(true);

      setCurrentWord(wordToUse);
      setIsModalVisible(true);

      if (onWordSelected) {
        onWordSelected(wordToUse);
      }
    } catch (error) {
      console.error('Failed to get word details:', error);
      setCurrentWord(wordToUse);
      setIsModalVisible(true);

      if (onWordSelected) {
        onWordSelected(wordToUse);
      }
    } finally {
      setLoadingWord(false);
    }
  };

  const handleAddWordToVocabulary = async (word: string) => {
    try {
      await addWord.mutateAsync({ word });
      if (!selectedWords.includes(word)) {
        setSelectedWords([...selectedWords, word]);
      }
    } catch (error) {
      console.error('Failed to add word to vocabulary:', error);
    }
  };

  const renderTextParts = () => {
    return processedText.map((part, index) => {
      if (!part.isWord) {
        return <Typography key={index}>{part.text}</Typography>;
      }

      const isSelected = selectedWords.includes(
        part.originalWord || part.text.toLowerCase()
      );

      return (
        <SelectableWord
          key={index}
          word={part.text}
          originalWord={part.originalWord}
          isSelected={isSelected}
          onPress={handleWordPress}
        />
      );
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentWord(null);
  };

  return (
    <ThemedView style={styles.container}>
      <WordSelectionModal
        visible={isModalVisible}
        selectedWord={currentWord}
        onClose={closeModal}
        onAddToDictionary={handleAddWordToVocabulary}
      />

      <ThemedView style={styles.generatedTextInfoCard}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color="#666"
          style={styles.infoIcon}
        />
        <Typography color="#666" style={styles.infoText}>
          Нажмите на слово, чтобы увидеть его перевод и добавить в словарь
        </Typography>
      </ThemedView>

      <ScrollView style={styles.generatedTextScrollView} overScrollMode="never">
        <ThemedView style={styles.generatedText}>
          {renderTextParts()}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.buttonsContainer}>
        <Button
          title="Сгенерировать заново"
          onPress={onRegenerateText}
          variant="primary"
          fullWidth
          style={styles.regenerateButton}
        />

        <Button
          title="Готово"
          onPress={onDone}
          variant="outline"
          fullWidth
          style={styles.doneButton}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    position: 'relative',
  },
  generatedTextInfoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  generatedTextScrollView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
  },
  generatedText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  selectedWordsContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedWordsText: {
    fontSize: 16,
  },
  buttonsContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  regenerateButton: {
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#F0F0F0',
  },
  doneButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
