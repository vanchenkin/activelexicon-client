import React, { useMemo } from 'react';
import { FlatList, FlatListProps, ListRenderItemInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedFlatListProps<T> extends FlatListProps<T> {
  itemAnimationDelay?: number;
}

const AnimatedItem = React.memo(
  ({ children, delay }: { children: React.ReactNode; delay: number }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    React.useEffect(() => {
      opacity.value = 0;
      translateY.value = 20;
      const timeoutId = setTimeout(() => {
        opacity.value = withTiming(1, { duration: 400 });
        translateY.value = withTiming(0, { duration: 400 });
      }, delay);

      return () => clearTimeout(timeoutId);
    }, [delay, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
  }
);

AnimatedItem.displayName = 'AnimatedItem';

const AnimatedFlatList = <T extends any>({
  data,
  renderItem,
  itemAnimationDelay = 0,
  ...rest
}: AnimatedFlatListProps<T>) => {
  const animatedRenderItem = useMemo(() => {
    if (!renderItem) return null;

    const AnimatedRenderItem = (info: ListRenderItemInfo<T>) => (
      <AnimatedItem
        key={`÷item-${info.index}`}
        delay={info.index * itemAnimationDelay}
      >
        {renderItem(info)}
      </AnimatedItem>
    );

    AnimatedRenderItem.displayName = 'AnimatedRenderItem';
    return AnimatedRenderItem;
  }, [itemAnimationDelay, renderItem]);

  if (!renderItem || !animatedRenderItem) {
    return null;
  }

  return <FlatList data={data} renderItem={animatedRenderItem} {...rest} />;
};

AnimatedFlatList.displayName = 'AnimatedFlatList';

export default AnimatedFlatList;
