import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatMessage from '@/components/ChatMessage';

jest.mock('@/components/Typography', () => 'Typography');
jest.mock('@/components/ThemedView', () => 'ThemedView');
jest.mock('@/components/SelectableWord', () => 'SelectableWord');
jest.mock('@/components/WordSelectionModal', () => 'WordSelectionModal');

describe.skip('ChatMessage Component', () => {
  const mockDictionaryWords = {
    hello: {
      word: 'hello',
      progress: 0.5,
      translations: [],
      isReadyToRepeat: false,
    },
    world: {
      word: 'world',
      progress: 0.8,
      translations: [],
      isReadyToRepeat: false,
    },
  };

  const mockOnCheckCorrectness = jest.fn();
  const mockOnWordSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user message correctly', () => {
    const { getByTestId } = render(
      <ChatMessage
        text="Hello world!"
        isUser={true}
        dictionaryWords={mockDictionaryWords}
        onCheckCorrectness={mockOnCheckCorrectness}
        onWordSelected={mockOnWordSelected}
      />
    );

    expect(getByTestId('check-button')).toBeTruthy();
  });

  it('renders AI message correctly', () => {
    const { queryByTestId } = render(
      <ChatMessage
        text="Hello world!"
        isUser={false}
        dictionaryWords={mockDictionaryWords}
      />
    );

    expect(queryByTestId('check-button')).toBeNull();
  });

  it('calls onCheckCorrectness when check button is pressed', () => {
    const { getByTestId } = render(
      <ChatMessage
        text="Hello world!"
        isUser={true}
        dictionaryWords={mockDictionaryWords}
        onCheckCorrectness={mockOnCheckCorrectness}
        onWordSelected={mockOnWordSelected}
      />
    );

    fireEvent.press(getByTestId('check-button'));
    expect(mockOnCheckCorrectness).toHaveBeenCalledWith('Hello world!');
  });
});
