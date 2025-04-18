import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('#FFFFFF'),
}));

describe('ThemedView Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ThemedView testID="themed-view" />);
    const viewElement = getByTestId('themed-view');
    expect(viewElement).toBeTruthy();

    expect(viewElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#FFFFFF' }),
      ])
    );
  });

  it('passes custom styles correctly', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" style={{ padding: 10, margin: 5 }} />
    );
    const viewElement = getByTestId('themed-view');
    expect(viewElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ padding: 10, margin: 5 }),
      ])
    );
  });

  it('passes light and dark color props to useThemeColor', () => {
    render(<ThemedView lightColor="#F0F0F0" darkColor="#222222" />);
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#F0F0F0', dark: '#222222' },
      'background'
    );
  });
});
