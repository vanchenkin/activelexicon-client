import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { ThemedView } from './ThemedView';
import SelectableWord from './SelectableWord';
import WordSelectionModal from './WordSelectionModal';
import { DictionaryWord } from '../services/api';

export interface ChatMessageProps {
  text: string;
  isUser: boolean;
  dictionaryWords: Record<string, DictionaryWord>;
  onCheckCorrectness?: (text: string) => void;
  onWordSelected?: (word: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  text,
  isUser,
  dictionaryWords,
  onCheckCorrectness,
  onWordSelected,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    setShowWordModal(true);
  };

  const handleAddToDictionary = (word: string) => {
    if (onWordSelected) {
      onWordSelected(word);
    }
  };

  const renderMessageText = () => {
    if (Object.keys(dictionaryWords).length === 0) {
      return (
        <Typography style={styles.messageText}>
          {text.split(/\b/).map((word, index) => (
            <SelectableWord key={index} word={word} onPress={handleWordPress} />
          ))}
        </Typography>
      );
    }

    const words = text.split(/\b/);
    return (
      <Typography style={styles.messageText}>
        {words.map((word, index) => {
          const lowerWord = word.toLowerCase();
          const dictWord = dictionaryWords[lowerWord];

          if (dictWord) {
            return (
              <SelectableWord
                key={index}
                word={word}
                onPress={handleWordPress}
                progress={dictWord.progress}
                showProgressIndicator={true}
              />
            );
          }

          return (
            <SelectableWord key={index} word={word} onPress={handleWordPress} />
          );
        })}
      </Typography>
    );
  };

  const isWordInDictionary = (word: string | null): boolean => {
    if (!word) return false;
    return Object.keys(dictionaryWords).includes(word.toLowerCase());
  };

  return (
    <>
      <ThemedView
        style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        {renderMessageText()}
        <ThemedView style={styles.messageFooter}>
          {isUser && onCheckCorrectness && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => onCheckCorrectness(text)}
            >
              <Typography color="#0099FF" size="sm">
                Проверить
              </Typography>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>

      <WordSelectionModal
        visible={showWordModal}
        selectedWord={selectedWord}
        onClose={() => setShowWordModal(false)}
        onAddToDictionary={handleAddToDictionary}
        isAlreadyAdded={isWordInDictionary(selectedWord)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  checkButton: {
    padding: 4,
  },
});

export default ChatMessage;
