import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAddWord } from '@/hooks/useApi';
import Typography from './Typography';
import { ThemedView } from './ThemedView';
import Button from './Button';
import SelectableWord from './SelectableWord';
import WordSelectionModal from './WordSelectionModal';

interface TextSelectionScreenProps {
  generatedText: string;
  onRegenerateText: () => void;
  onDone: () => void;
  onWordSelected?: (word: string) => void;
}

interface ProcessedTextItem {
  text: string;
  isWord: boolean;
  isWordWithPunctuation?: boolean;
  originalWord?: string;
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
      // First split text into words, spaces, and other characters
      const result: ProcessedTextItem[] = [];
      // First match words with alpha characters
      const regex = /([a-zA-Z0-9а-яА-ЯёЁ']+)|(\s+)|([^\w\s]+)/g;
      let match;
      let lastWordIndex = -1;

      while ((match = regex.exec(generatedText)) !== null) {
        const fullMatch = match[0];
        const isWord = Boolean(match[1]); // Word with letters
        const isSpace = Boolean(match[2]); // Space character
        const isPunctuation = Boolean(match[3]); // Punctuation

        // Handle space with consistent newlines
        if (isSpace) {
          // Normalize all types of line breaks to a single space
          // Replace all sequences of whitespace (including newlines) with a single space
          const normalizedSpace = fullMatch.replace(/\s+/g, ' ');
          if (normalizedSpace) {
            result.push({ text: normalizedSpace, isWord: false });
          }
          continue;
        }

        if (isWord) {
          // Store words as selectable
          result.push({
            text: fullMatch,
            isWord: true,
            originalWord: fullMatch.toLowerCase(),
          });
          lastWordIndex = result.length - 1;
        } else if (
          isPunctuation &&
          lastWordIndex !== -1 &&
          !result[lastWordIndex].isWordWithPunctuation
        ) {
          // Attach punctuation to the previous word to prevent line breaks between them
          const previousItem: ProcessedTextItem = result[lastWordIndex];
          const combinedText: string = previousItem.text + fullMatch;

          // Replace previous word with combined text, but keep tracking original word
          result[lastWordIndex] = {
            text: combinedText,
            isWord: true,
            isWordWithPunctuation: true,
            originalWord: previousItem.originalWord,
          };
        } else {
          // Add spaces and other characters as non-selectable
          result.push({ text: fullMatch, isWord: false });
        }
      }

      setProcessedText(result);
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
