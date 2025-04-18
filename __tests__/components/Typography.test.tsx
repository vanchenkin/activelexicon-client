import React from 'react';
import { render } from '@testing-library/react-native';
import Typography from '@/components/Typography';

describe('Typography Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Typography>Hello World</Typography>);
    const textElement = getByText('Hello World');
    expect(textElement).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByText } = render(
      <Typography style={{ fontSize: 20 }}>Custom Style</Typography>
    );
    const textElement = getByText('Custom Style');
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([expect.objectContaining({ fontSize: 20 })])
    );
  });
});
