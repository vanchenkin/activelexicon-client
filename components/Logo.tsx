import React from 'react';
import { StyleSheet, ViewStyle, Image } from 'react-native';
import { ThemedView } from './ThemedView';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const Logo = ({ width = 286, height = 150, style }: LogoProps) => {
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
