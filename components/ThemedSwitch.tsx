import { Switch, SwitchProps, Platform } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedSwitchProps = SwitchProps & {
  lightTrackColor?: string;
  darkTrackColor?: string;
  lightThumbColor?: string;
  darkThumbColor?: string;
};

export function ThemedSwitch({
  value,
  onValueChange,
  lightTrackColor,
  darkTrackColor,
  lightThumbColor,
  darkThumbColor,
  ...otherProps
}: ThemedSwitchProps) {
  const trackColor = useThemeColor(
    { light: lightTrackColor, dark: darkTrackColor },
    'tint'
  );

  const thumbColor = useThemeColor(
    { light: lightThumbColor, dark: darkThumbColor },
    'icon'
  );

  const switchProps = {
    value,
    onValueChange,
    trackColor: { false: '#F4F3F4', true: trackColor || '#F4F3F4' },
    ...otherProps,
  };

  if (Platform.OS === 'web') {
    // @ts-expect-error - This is for web platform only
    return <Switch {...switchProps} activeThumbColor={'#0099ff'} />;
  }

  return (
    <Switch
      {...switchProps}
      thumbColor={
        Platform.OS === 'ios' ? undefined : value ? thumbColor : '#F4F3F4'
      }
      ios_backgroundColor="#F4F3F4"
    />
  );
}
