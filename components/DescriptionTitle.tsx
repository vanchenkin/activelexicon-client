import React from 'react';
import { StyleSheet } from 'react-native';
import Typography from './Typography';

interface DescriptionTitleProps {
  // Optional custom styles
  style?: any;
}

const DescriptionTitle: React.FC<DescriptionTitleProps> = ({ style }) => {
  return (
    <Typography
      size="md"
      style={{
        ...styles.descriptionText,
        ...style,
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
