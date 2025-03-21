import React from 'react';
import { StyleSheet, ViewStyle, Image } from 'react-native';
import { ThemedView } from './ThemedView';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
}

const Logo = ({ size = 1, style }: LogoProps) => {
  const width = 286 * size;
  const height = 150 * size;
  return (
    <ThemedView style={[styles.container, style]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: width, height: height }}
        resizeMode="contain"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo;
