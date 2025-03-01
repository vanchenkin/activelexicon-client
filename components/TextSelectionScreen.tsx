import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  mockTranslationService,
  WordDetails,
} from '@/services/mockTranslationService';
import WordDetailsModal from '@/components/WordDetailsModal';

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
  const [currentWordDetails, setCurrentWordDetails] =
    useState<WordDetails | null>(null);
  const [loadingWord, setLoadingWord] = useState(false);

  // Process the text to split it into words and non-words
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
      const details = await mockTranslationService.getWordDetails(word);
      setCurrentWordDetails(details);
      setIsModalVisible(true);

      // Also notify parent component if callback provided
      if (onWordSelected) {
        onWordSelected(word);
      }
    } catch (error) {
      console.error('Failed to get word details:', error);
    } finally {
      setLoadingWord(false);
    }
  };

  const handleAddWordToVocabulary = async (word: string) => {
    try {
      await mockTranslationService.addWordToVocabulary(word);
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
        return <Text key={index}>{part.text}</Text>;
      }

      const isSelected = selectedWords.includes(part.text);

      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleWordPress(part.text)}
          style={[styles.wordTouchable, isSelected && styles.selectedWord]}
        >
          <Text
            style={[styles.wordText, isSelected && styles.selectedWordText]}
          >
            {part.text}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity
        style={styles.regenerateButton}
        onPress={onRegenerateText}
      >
        <Text style={styles.regenerateButtonText}>Сгенерировать снова</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color="#666"
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>
          Прочитайте этот текст и нажмите на все слова, которые вы не понимаете
        </Text>
      </View>

      <ScrollView style={styles.textScrollView}>
        <Text style={styles.textContainer}>{renderTextParts()}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Готово</Text>
      </TouchableOpacity>

      <WordDetailsModal
        visible={isModalVisible}
        wordDetails={currentWordDetails}
        onClose={() => setIsModalVisible(false)}
        onAddWord={handleAddWordToVocabulary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  regenerateButton: {
    backgroundColor: '#0099FF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  regenerateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
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
  textScrollView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  textContainer: {
    fontSize: 16,
    lineHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordTouchable: {
    marginHorizontal: 1,
  },
  selectedWord: {
    backgroundColor: '#FFE082',
    borderRadius: 3,
  },
  wordText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  selectedWordText: {
    color: '#333',
  },
  doneButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  doneButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
