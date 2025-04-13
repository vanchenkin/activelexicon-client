import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import Input from '@/components/Input';
import { ChatMessage as ChatMessageType, DictionaryWord } from '@/services/api';
import {
  useChatHistory,
  useSendMessage,
  useWords,
  useStartNewChat,
  useAddWord,
  useCheckMessageCorrectness,
} from '@/hooks/useApi';
import Button from '@/components/Button';
import ChatMessage from '../../components/ChatMessage';
import TopicSelector from '@/components/TopicSelector';
import CorrectionModal from '@/components/CorrectionModal';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [checkingMessage, setCheckingMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correctionResult, setCorrectionResult] = useState<{
    isCorrect: boolean;
    suggestions?: string[];
  } | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const [chatStarted, setChatStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { data: messages = [], isLoading: isMessagesLoading } =
    useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { data: wordsData, refetch: refetchWords } = useWords();
  const startNewChatMutation = useStartNewChat();
  const addWordMutation = useAddWord();
  const checkMessageCorrectnessMutation = useCheckMessageCorrectness();

  const wordMap = useMemo(() => {
    return wordsData?.items.reduce(
      (acc, item) => {
        acc[item.word.toLowerCase()] = item;
        return acc;
      },
      {} as Record<string, DictionaryWord>
    );
  }, [wordsData]);

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName);
  };

  const startNewChat = () => {
    if (!selectedTopic) {
      return;
    }

    startNewChatMutation.mutate(selectedTopic, {
      onSuccess: () => {
        setChatStarted(true);
      },
      onError: (error) => {
        console.error('Failed to start new chat:', error);
      },
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const userInput = inputText.trim();
    setInputText('');

    sendMessage(userInput, {
      onSuccess: () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    });
  };

  const handleStartNewChat = () => {
    setChatStarted(false);
    setSelectedTopic(null);
  };

  const handleCheckCorrectness = (messageText: string) => {
    setCheckingMessage(messageText);
    setIsLoading(true);

    checkMessageCorrectnessMutation.mutate(messageText, {
      onSuccess: (result) => {
        setCorrectionResult({
          isCorrect: result.isCorrect,
          suggestions: result.suggestions,
        });
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('Error checking message correctness:', error);
        setIsLoading(false);
      },
    });
  };

  const handleWordSelected = (word: string) => {
    if (word && /[a-zA-Z]/.test(word)) {
      addWordMutation.mutate({ word });
      refetchWords();
    }
  };

  const closeModal = () => {
    setCheckingMessage(null);
    setCorrectionResult(null);
  };

  const renderMessageItem = ({ item }: { item: ChatMessageType }) => {
    return (
      <ChatMessage
        id={item.id}
        text={item.text}
        timestamp={item.timestamp}
        isUser={item.isUser}
        dictionaryWords={wordMap || {}}
        onCheckCorrectness={handleCheckCorrectness}
        onWordSelected={handleWordSelected}
      />
    );
  };

  const headerButtons = (
    <View style={styles.headerButtonsContainer}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleStartNewChat}
      >
        <Ionicons name="add" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderTopicSelector = () => (
    <ThemedView style={styles.topicContainer}>
      <Typography style={styles.topicTitle}>Выберите тему для чата</Typography>
      <ScrollView style={styles.topicScrollView}>
        <ThemedView style={styles.topicSection}>
          <TopicSelector
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
          />

          <Button
            title="Начать чат"
            onPress={startNewChat}
            isLoading={startNewChatMutation.isPending}
            disabled={startNewChatMutation.isPending || !selectedTopic}
            style={styles.startChatButton}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );

  const renderChat = () => (
    <>
      {isMessagesLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
        </ThemedView>
      ) : (
        <FlatList
          ref={flatListRef}
          style={styles.messagesList}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <Input
          placeholder="Введите текст..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          containerStyle={styles.chatInputContainer}
          trailingIcon={
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={isSending || !inputText.trim()}
            >
              {isSending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          }
        />
      </KeyboardAvoidingView>
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <Header title="Чат" rightElement={headerButtons} />

      {!chatStarted ? renderTopicSelector() : renderChat()}

      <CorrectionModal
        visible={
          isLoading || (correctionResult !== null && checkingMessage !== null)
        }
        isLoading={isLoading}
        correctionResult={correctionResult}
        checkingMessage={checkingMessage}
        onClose={closeModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  chatInputContainer: {
    flex: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0099FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  topicContainer: {
    flex: 1,
    padding: 16,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  topicScrollView: {
    flex: 1,
  },
  topicSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  startChatButton: {
    marginTop: 8,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 12,
  },
});
