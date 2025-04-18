import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      text: '#565656',
      background: '#fff',
      tint: '#0a7ea4',
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#fff',
    },
  },
}));

describe('useThemeColor Hook', () => {
  it('returns color from props when provided', () => {
    const props = { light: '#FF0000', dark: '#00FF00' };
    const { result } = renderHook(() => useThemeColor(props, 'background'));
    expect(result.current).toBe('#FF0000');
  });

  it('returns default color when props not provided', () => {
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    expect(result.current).toBe(Colors.light.text);
  });

  it('returns correct color for specific theme and colorName', () => {
    const { result } = renderHook(() => useThemeColor({}, 'tint'));
    expect(result.current).toBe(Colors.light.tint);
  });
});
