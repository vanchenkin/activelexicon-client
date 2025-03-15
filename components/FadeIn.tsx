import React, { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface FadeInProps extends ViewProps {
  delay?: number;
  duration?: number;
  from?: {
    opacity?: number;
    translateY?: number;
  };
  children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  from = { opacity: 0, translateY: 10 },
  style,
  ...props
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(from.translateY || 0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));

    translateY.value = withDelay(delay, withTiming(0, { duration }));
  }, [opacity, translateY, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default FadeIn;
