import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { ThemedView } from './ThemedView';

export type InputVariant = 'default' | 'success' | 'error';

export interface InputProps extends TextInputProps {
  variant?: InputVariant;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  trailingIcon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      variant = 'default',
      label,
      error,
      style,
      fullWidth = false,
      trailingIcon,
      leadingIcon,
      containerStyle,
      ...props
    },
    ref
  ) => {
    const getVariantStyle = () => {
      switch (variant) {
        case 'success':
          return styles.successInput;
        case 'error':
          return styles.errorInput;
      }
    };

    return (
      <ThemedView
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          containerStyle,
        ]}
      >
        {label && <Text style={[styles.label]}>{label}</Text>}

        <ThemedView style={styles.inputWrapper}>
          {leadingIcon && (
            <ThemedView style={styles.leadingIcon}>{leadingIcon}</ThemedView>
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leadingIcon ? styles.inputWithLeadingIcon : null,
              trailingIcon ? styles.inputWithTrailingIcon : null,
              error ? styles.inputError : null,
              style,
              getVariantStyle(),
              Platform.OS === 'web' ? { outlineColor: '#0099FF' } : null,
            ]}
            placeholderTextColor="#999"
            {...props}
          />

          {trailingIcon && (
            <ThemedView style={styles.trailingIcon}>{trailingIcon}</ThemedView>
          )}
        </ThemedView>

        {error !== '' && error !== undefined && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </ThemedView>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  successInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  errorInput: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  inputError: {
    borderColor: '#F44336',
  },
  inputWithLeadingIcon: {
    paddingLeft: 45,
  },
  inputWithTrailingIcon: {
    paddingRight: 45,
  },
  leadingIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    top: '50%',
    transform: [{ translateY: '-50%' }],
  },
  trailingIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    top: '50%',
    transform: [{ translateY: '-50%' }],
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});

export default Input;
