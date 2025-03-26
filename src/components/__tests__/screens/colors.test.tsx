import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import Colors from '@/src/constants/Colors';

// First, let's test the Colors object itself
describe('Colors Constants', () => {
  it('contains all required color values', () => {
    // Check that all expected color properties exist
    expect(Colors).toHaveProperty('primary');
    expect(Colors).toHaveProperty('secondary');
    expect(Colors).toHaveProperty('background');
    expect(Colors).toHaveProperty('textPrimary');
    expect(Colors).toHaveProperty('textSecondary');
    expect(Colors).toHaveProperty('white');
    
    // Check that colors are strings (valid color values)
    expect(typeof Colors.primary).toBe('string');
    expect(typeof Colors.secondary).toBe('string');
    expect(typeof Colors.background).toBe('string');
    expect(typeof Colors.textPrimary).toBe('string');
    expect(typeof Colors.textSecondary).toBe('string');
    expect(typeof Colors.white).toBe('string');
    
    // Check specific color values if they should be consistent
    expect(Colors.primary).toBe('#4e752d');
    expect(Colors.secondary).toBe('#74af44');
    expect(Colors.background).toBe('#e6f2dc');
    expect(Colors.white).toBe('#ffffff');
  });
});

// Now, let's test that the colors are applied correctly to components
describe('Colors usage in components', () => {
  // Create a simple test component that uses Colors
  const TestComponent = () => (
    <View style={{ 
      backgroundColor: Colors.background,
      borderColor: Colors.primary
    }} testID="test-view" />
  );
  
  it('applies colors correctly to components', () => {
    const { getByTestId } = render(<TestComponent />);
    const testView = getByTestId('test-view');
    
    // Check that the styles were applied correctly
    expect(testView.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: Colors.background,
        borderColor: Colors.primary
      })
    );
  });
});