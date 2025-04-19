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

export default function TextSelectionScreen({
  generatedText,
  onRegenerateText,
  onDone,
  onWordSelected,
}: TextSelectionScreenProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [processedText, setProcessedText] = useState<
    { text: string; isWord: boolean }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [loadingWord, setLoadingWord] = useState(false);

  const addWord = useAddWord();

  useEffect(() => {
    if (generatedText) {
      const words = [];
      const wordRegex = /([a-zA-Z0-9']+)|([^a-zA-Z0-9'\s]+)|(\s+)/g;
      let match;

      while ((match = wordRegex.exec(generatedText)) !== null) {
        const fullMatch = match[0];
        const isWord = Boolean(match[1]) || Boolean(match[2]);
        words.push({ text: fullMatch, isWord });
      }

      setProcessedText(words);
    }
  }, [generatedText]);

  const handleWordPress = async (word: string) => {
    if (loadingWord) return;

    try {
      setLoadingWord(true);

      setCurrentWord(word);
      setIsModalVisible(true);

      if (onWordSelected) {
        onWordSelected(word);
      }
    } catch (error) {
      console.error('Failed to get word details:', error);
      setCurrentWord(word);
      setIsModalVisible(true);

      if (onWordSelected) {
        onWordSelected(word);
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

      const isSelected = selectedWords.includes(part.text.toLowerCase());

      return (
        <SelectableWord
          key={index}
          word={part.text}
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

      <ScrollView style={styles.generatedTextScrollView}>
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
    padding: 16,
    marginBottom: 16,
  },
  generatedText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
