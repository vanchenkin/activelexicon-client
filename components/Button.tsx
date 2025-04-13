import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'red' | 'red-outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) => {
  const pressed = useSharedValue(0);

  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.96]);

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withSpring(1);
      }}
      onPressOut={() => {
        pressed.value = withSpring(0);
      }}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...rest}
    >
      <Animated.View style={[buttonStyles, animatedStyle]}>
        {isLoading ? (
          <ActivityIndicator
            color={
              variant === 'outline' || variant === 'red-outline'
                ? variant === 'outline'
                  ? '#3498db'
                  : '#FF3B30'
                : '#fff'
            }
            size="small"
          />
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: '#0099FF',
    boxShadow: '0px 2px 0px 0px #2A63A9',
  },
  secondary: {
    backgroundColor: 'grey',
    boxShadow: '0px 2px 0px 0px #5a5a5a',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  red: {
    backgroundColor: '#FF3B30',
    boxShadow: '0px 2px 0px 0px #CC2F26',
  },
  'red-outline': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 40,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    height: 50,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    height: 60,
  },
  disabled: {
    backgroundColor: '#bdc3c7',
    borderColor: '#bdc3c7',
    boxShadow: '0px 2px 0px 0px rgb(111, 111, 111)',
  },
  text: {
    fontFamily: 'Inter-Regular',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#3498db',
  },
  redText: {
    color: '#ffffff',
  },
  'red-outlineText': {
    color: '#FF3B30',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#7f8c8d',
  },
});

export default Button;
