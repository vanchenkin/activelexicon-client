import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import Typography from './Typography';

type ProgressBarProps = {
  current: number;
  total: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  return (
    <ThemedView style={styles.progressContainer}>
      <Typography style={styles.progressText}>
        Выполнено {current} из {total} заданий до получения опыта
      </Typography>
      <ThemedView style={styles.progressBar}>
        <ThemedView
          style={[
            styles.progressFill,
            {
              width: `${(current / total) * 100}%`,
            },
          ]}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099FF',
    borderRadius: 4,
  },
});

export default ProgressBar;
