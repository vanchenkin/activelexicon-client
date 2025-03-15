import React from 'react';
import { StyleSheet } from 'react-native';
import Typography from './Typography';

const DescriptionTitle: React.FC = () => {
  return (
    <Typography
      size="md"
      style={{
        ...styles.descriptionText,
      }}
    >
      Приложение для развития <br /> активного словарного запаса
    </Typography>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    maxWidth: '80%',
  },
});

export default DescriptionTitle;
