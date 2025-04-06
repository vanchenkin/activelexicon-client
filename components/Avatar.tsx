import React from 'react';
import {
  StyleSheet,
  Image,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const avatarImages = {
  0: require('../assets/images/avatars/avatar0.png'),
  1: require('../assets/images/avatars/avatar1.png'),
  2: require('../assets/images/avatars/avatar2.png'),
  3: require('../assets/images/avatars/avatar3.png'),
  4: require('../assets/images/avatars/avatar4.png'),
  5: require('../assets/images/avatars/avatar5.png'),
  6: require('../assets/images/avatars/avatar6.png'),
  7: require('../assets/images/avatars/avatar7.png'),
  8: require('../assets/images/avatars/avatar8.png'),
  9: require('../assets/images/avatars/avatar9.png'),
  10: require('../assets/images/avatars/avatar10.png'),
};

interface AvatarProps {
  avatarId: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Avatar({ avatarId, size = 80, style }: AvatarProps) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const safeAvatarId = Math.min(Math.max(0, avatarId), 10);

  try {
    return (
      <Image
        source={avatarImages[safeAvatarId as keyof typeof avatarImages]}
        style={[styles.avatar, containerStyle, style as StyleProp<ImageStyle>]}
      />
    );
  } catch (error) {
    console.error('Error loading avatar:', error);
    return (
      <View style={[styles.placeholder, containerStyle, style]}>
        <Ionicons name="person-outline" size={size * 0.5} color="#888" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
