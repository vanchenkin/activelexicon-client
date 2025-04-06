import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/Typography';
import { ThemedView } from '../../components/ThemedView';
import Header from '../../components/Header';
import Input from '../../components/Input';
import { useRouter } from 'expo-router';
import { ChatMessage } from '../../services/api';
import { useChatHistory, useSendMessage } from '../../hooks/useApi';

export default function ChatScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: messages = [], isLoading } = useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

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

  const handleOpenSettings = () => {
    router.push('/chat-settings');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const formattedTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <ThemedView
        style={[
          styles.messageBubble,
          item.isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Typography style={styles.messageText}>{item.text}</Typography>
        <Typography style={styles.messageTime}>{formattedTime}</Typography>
      </ThemedView>
    );
  };

  const settingsButton = (
    <TouchableOpacity
      style={styles.settingsButton}
      onPress={handleOpenSettings}
    >
      <Ionicons name="settings-outline" size={24} color="#000" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Header title="Чат" rightElement={settingsButton} />

      {isLoading ? (
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  settingsButton: {
    paddingHorizontal: 24,
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
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
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
});
