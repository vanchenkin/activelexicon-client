import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';
type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextType = 'default' | 'title' | 'subtitle' | 'link' | 'defaultSemiBold';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  weight?: FontWeight;
  size?: FontSize;
  color?: string;
  style?: TextStyle;
  lightColor?: string;
  darkColor?: string;
  type?: TextType;
}

const Typography = ({
  children,
  weight = 'regular',
  size = 'md',
  color,
  style,
  lightColor,
  darkColor,
  type,
  ...rest
}: TypographyProps) => {
  // Get theme color if using themed colors
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  // Determine which color to use (prop color overrides theme color)
  const textColor = color || themeColor;

  return (
    <Text
      style={[
        styles.base,
        // Font family based on weight
        weight && styles[weight],
        // Font size based on size prop
        size && styles[size],
        // Legacy type styles for backward compatibility
        type && styles[type],
        // Apply color
        { color: textColor },
        // Custom styles passed as prop
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Inter-Regular',
  },
  // Font weights
  regular: {
    fontFamily: 'Inter-Regular',
  },
  medium: {
    fontFamily: 'Inter-Medium',
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  // Font sizes
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  md: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 28,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '3xl': {
    fontSize: 30,
    lineHeight: 36,
  },
  // Legacy type styles
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: '#0a7ea4',
  },
});

export default Typography;
