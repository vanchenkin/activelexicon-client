import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';
import { ThemedView } from './ThemedView';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface LanguageLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export default function LanguageLevelSelect({
  value,
  onChange,
  placeholder = 'Выберите уровень языка',
  style,
}: LanguageLevelSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const languageLevels: {
    value: LanguageLevel;
    label: string;
    description: string;
  }[] = [
    {
      value: 'A1',
      label: 'A1 - Начальный',
      description: 'Базовое понимание языка',
    },
    {
      value: 'A2',
      label: 'A2 - Элементарный',
      description: 'Общение на повседневные темы',
    },
    {
      value: 'B1',
      label: 'B1 - Средний',
      description: 'Независимое владение языком',
    },
    {
      value: 'B2',
      label: 'B2 - Выше среднего',
      description: 'Свободное общение',
    },
    {
      value: 'C1',
      label: 'C1 - Продвинутый',
      description: 'Профессиональное владение',
    },
    {
      value: 'C2',
      label: 'C2 - Свободный',
      description: 'Владение на уровне носителя',
    },
  ];

  const handleSelect = (level: string) => {
    onChange(level);
    setModalVisible(false);
  };

  const selectedLevel = languageLevels.find((level) => level.value === value);

  return (
    <>
      <TouchableOpacity
        style={[styles.selectButton, style]}
        onPress={() => setModalVisible(true)}
      >
        <Typography style={styles.selectButtonText}>
          {selectedLevel ? selectedLevel.label : placeholder}
        </Typography>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Typography style={styles.modalTitle}>
              Выберите уровень языка
            </Typography>

            {languageLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={styles.levelOption}
                onPress={() => handleSelect(level.value)}
              >
                <View style={styles.levelHeader}>
                  <Typography style={styles.levelLabel}>
                    {level.label}
                  </Typography>
                  {value === level.value && (
                    <Ionicons name="checkmark" size={20} color="#0099FF" />
                  )}
                </View>
                <Typography style={styles.levelDescription}>
                  {level.description}
                </Typography>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelOption: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#0099FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
