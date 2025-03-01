import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
  color?: string;
}

const Logo = ({ size = 100, style, color }: LogoProps) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo;
