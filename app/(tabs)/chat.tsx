import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
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
} from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Button';
import ChatMessage from '../../components/ChatMessage';
import TopicSelector from '@/components/TopicSelector';
import CorrectionModal from '@/components/CorrectionModal';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [correctionResult, setCorrectionResult] = useState<{
    isCorrect: boolean;
    suggestions?: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const [chatStarted, setChatStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [originalMessages, setOriginalMessages] = useState<ChatMessageType[]>(
    []
  );
  const [forceTopicSelection, setForceTopicSelection] = useState(false);

  const { data: messages = [], isLoading: isMessagesLoading } =
    useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { data: wordsData, refetch: refetchWords } = useWords();
  const startNewChatMutation = useStartNewChat();
  const addWordMutation = useAddWord();
  const queryClient = useQueryClient();

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
        setForceTopicSelection(false);
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
    setForceTopicSelection(true);
  };

  const handleCheckCorrectness = (messageText: string) => {
    const message = messages.find(
      (msg) => msg.isUser && msg.text === messageText
    );
    if (message) {
      setCorrectionResult({
        isCorrect: message.isPerfect || false,
        suggestions: message.correction ? [message.correction] : undefined,
      });
    }
  };

  const handleWordSelected = (word: string) => {
    if (word && /[a-zA-Z]/.test(word)) {
      addWordMutation.mutate({ word });
      refetchWords();
    }
  };

  const closeModal = () => {
    setCorrectionResult(null);
  };

  const renderMessageItem = ({
    item,
  }: {
    item: ChatMessageType;
    index: number;
  }) => {
    return (
      <ChatMessage
        text={item.text}
        isUser={item.isUser}
        dictionaryWords={wordMap || {}}
        onCheckCorrectness={handleCheckCorrectness}
        onWordSelected={handleWordSelected}
      />
    );
  };

  const renderTopicSelector = () => (
    <ThemedView style={styles.topicContainer}>
      <Typography style={styles.topicTitle}>Выберите тему для чата</Typography>
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

        {(messages.length > 0 || originalMessages.length > 0) && (
          <Button
            title="Вернуться к существующему чату"
            onPress={() => {
              if (messages.length === 0 && originalMessages.length > 0) {
                queryClient.setQueryData(['chatHistory'], originalMessages);
              }
              setChatStarted(true);
              setForceTopicSelection(false);
            }}
            style={styles.backToChatButton}
            variant="outline"
          />
        )}
      </ThemedView>
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
          keyExtractor={(item, index) =>
            `${item.isUser ? 'user' : 'bot'}-${index}-${item.text.substring(0, 10)}`
          }
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

  useEffect(() => {
    if (messages.length > 0 && !chatStarted && !forceTopicSelection) {
      setChatStarted(true);
    }

    if (messages.length > 0 && originalMessages.length === 0) {
      setOriginalMessages(messages);
    }
  }, [messages, chatStarted, originalMessages.length, forceTopicSelection]);

  return (
    <ThemedView style={styles.container}>
      <Header
        title="Чат"
        rightElement={
          <ThemedView style={styles.headerButtonsContainer}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleStartNewChat}
            >
              <Ionicons name="add" size={32} color="#000" />
            </TouchableOpacity>
          </ThemedView>
        }
      />

      {!chatStarted ? renderTopicSelector() : renderChat()}

      <CorrectionModal
        visible={isLoading || correctionResult !== null}
        isLoading={isLoading}
        correctionResult={correctionResult}
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
    flex: 1,
  },
  startChatButton: {
    marginTop: 8,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerButton: {
    paddingHorizontal: 32,
  },
  backToChatButton: {
    marginTop: 8,
  },
});
