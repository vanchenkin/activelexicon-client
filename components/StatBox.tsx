import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Typography from '@/components/Typography';

interface StatBoxProps {
  title: string;
  value: number | string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
}

const StatBox = ({
  title,
  value,
  style,
  titleStyle,
  valueStyle,
}: StatBoxProps) => (
  <ThemedView style={[styles.statBox, style]}>
    <Typography
      style={
        titleStyle ? { ...styles.statTitle, ...titleStyle } : styles.statTitle
      }
    >
      {title}
    </Typography>
    <Typography
      style={
        valueStyle ? { ...styles.statValue, ...valueStyle } : styles.statValue
      }
    >
      {value}
    </Typography>
  </ThemedView>
);

const styles = StyleSheet.create({
  statBox: {
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  statTitle: {
    color: '#333',
    textAlign: 'center',
  },
  statValue: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
});

export default StatBox;
