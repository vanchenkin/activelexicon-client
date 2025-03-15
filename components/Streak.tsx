import React from 'react';
import { StyleSheet } from 'react-native';
import Typography from './Typography';
import { ThemedView } from './ThemedView';

interface StreakProps {
  streak: number;

  maxTriangles?: number;

  showLabel?: boolean;
}

export default function Streak({
  streak,
  maxTriangles = 15,
  showLabel = true,
}: StreakProps) {
  const getStreakText = (count: number) => {
    if (count === 1) return 'день';
    if (count >= 2 && count <= 4) return 'дня';
    return 'дней';
  };

  const renderStreakIndicators = () => {
    const indicators = [];
    const filledTriangles = Math.min(streak, maxTriangles);

    for (let i = 0; i < maxTriangles; i++) {
      indicators.push(
        <Typography
          key={i}
          color={i < filledTriangles ? '#4096FE' : '#DDD'}
          style={styles.triangleIndicator}
        >
          🔥
        </Typography>
      );
    }

    const rows = [];
    const rowSize = 5;
    const numRows = Math.ceil(maxTriangles / rowSize);

    for (let i = 0; i < numRows; i++) {
      rows.push(
        <ThemedView key={i} style={styles.triangleRow}>
          {indicators.slice(i * rowSize, (i + 1) * rowSize)}
        </ThemedView>
      );
    }

    return rows;
  };

  return (
    <ThemedView style={[styles.container]}>
      {showLabel && (
        <Typography weight="medium" size="md" style={styles.streakLabel}>
          {streak === 0
            ? 'Начните серию!'
            : `Серия: ${streak} ${getStreakText(streak)}`}
        </Typography>
      )}
      <ThemedView style={styles.streakIndicators}>
        {renderStreakIndicators()}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  streakLabel: {
    marginBottom: 10,
  },
  streakIndicators: {
    alignItems: 'flex-start',
  },
  triangleRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  triangleIndicator: {
    fontSize: 16,
    marginHorizontal: 5,
  },
});
