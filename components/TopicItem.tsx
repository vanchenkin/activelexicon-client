import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';

export interface Topic {
  id: string;
  name: string;
  icon: string;
}

interface TopicItemProps {
  topic: Topic;
  index: number;
  isSelected: boolean;
  itemsPerRow?: number;
  totalItems: number;
  onPress: (topicId: string) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  index,
  isSelected,
  itemsPerRow = 2,
  totalItems,
  onPress,
}) => {
  const isLastInRow = index % itemsPerRow === itemsPerRow - 1;
  const isLastRow = index >= totalItems - itemsPerRow;

  return (
    <TouchableOpacity
      key={topic.id}
      style={[
        styles.topicButton,
        isSelected && styles.selectedTopicButton,
        isLastInRow && { marginRight: 0 },
        isLastRow && { marginBottom: 0 },
      ]}
      onPress={() => onPress(topic.id)}
    >
      <Ionicons
        name={topic.icon as any}
        size={16}
        color="#0066CC"
        style={styles.topicIcon}
      />
      <Typography style={styles.topicText}>{topic.name}</Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topicButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTopicButton: {
    borderColor: '#0066CC',
  },
  topicIcon: {
    marginRight: 8,
  },
  topicText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TopicItem;
