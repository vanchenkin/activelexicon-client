import React from 'react';
import { FlatList, FlatListProps, ListRenderItemInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

interface AnimatedFlatListProps<T> extends FlatListProps<T> {
  itemAnimationDelay?: number;
}

const AnimatedFlatList = <T extends any>({
  data,
  renderItem,
  itemAnimationDelay = 150,
  ...rest
}: AnimatedFlatListProps<T>) => {
  // Modified render item function that adds animation
  const animatedRenderItem = (info: ListRenderItemInfo<T>) => {
    const { item, index } = info;

    const AnimatedItem = () => {
      const opacity = useSharedValue(0);
      const translateY = useSharedValue(20);

      React.useEffect(() => {
        // Delay increases with each item
        const delay = index * itemAnimationDelay;

        setTimeout(() => {
          opacity.value = withTiming(1, { duration: 400 });
          translateY.value = withTiming(0, { duration: 400 });
        }, delay);
      }, []);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      });

      return (
        <Animated.View style={[animatedStyle]}>
          {renderItem?.(info) || null}
        </Animated.View>
      );
    };

    return <AnimatedItem />;
  };

  return <FlatList data={data} renderItem={animatedRenderItem} {...rest} />;
};

export default AnimatedFlatList;
