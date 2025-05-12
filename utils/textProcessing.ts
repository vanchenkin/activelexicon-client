export interface ProcessedTextItem {
  text: string;
  isWord: boolean;
  isWordWithPunctuation?: boolean;
  originalWord?: string;
}

/**
 * Processes text by splitting it into words, spaces, and punctuation
 * @param text Text to process
 * @returns Array of processed text items
 */
export function processText(text: string): ProcessedTextItem[] {
  const result: ProcessedTextItem[] = [];
  // Match words with alpha characters
  const regex = /([a-zA-Z0-9а-яА-ЯёЁ']+)|(\s+)|([^\w\s]+)/g;
  let match;
  let lastWordIndex = -1;

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const isWord = Boolean(match[1]); // Word with letters
    const isSpace = Boolean(match[2]); // Space character
    const isPunctuation = Boolean(match[3]); // Punctuation

    if (isSpace) {
      const normalizedSpace = fullMatch.replace(/\s+/g, ' ');
      if (normalizedSpace) {
        result.push({ text: normalizedSpace, isWord: false });
      }
      continue;
    }

    if (isWord) {
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
      const previousItem: ProcessedTextItem = result[lastWordIndex];
      const combinedText: string = previousItem.text + fullMatch;

      result[lastWordIndex] = {
        text: combinedText,
        isWord: true,
        isWordWithPunctuation: true,
        originalWord: previousItem.originalWord,
      };
    } else {
      result.push({ text: fullMatch, isWord: false });
    }
  }

  return result;
}
