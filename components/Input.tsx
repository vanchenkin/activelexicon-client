import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type InputVariant = 'default' | 'chat' | 'search' | 'success' | 'error';

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
        case 'chat':
          return styles.chatInput;
        case 'search':
          return styles.searchInput;
        case 'success':
          return styles.successInput;
        case 'error':
          return styles.errorInput;
        default:
          return styles.defaultInput;
      }
    };

    return (
      <View
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          containerStyle,
        ]}
      >
        {label && <Text style={[styles.label]}>{label}</Text>}

        <View style={styles.inputWrapper}>
          {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              getVariantStyle(),
              leadingIcon ? styles.inputWithLeadingIcon : null,
              trailingIcon ? styles.inputWithTrailingIcon : null,
              error ? styles.inputError : null,
              style,
            ]}
            placeholderTextColor="#999"
            {...props}
          />

          {trailingIcon && (
            <View style={styles.trailingIcon}>{trailingIcon}</View>
          )}
        </View>

        {error && <Text style={[styles.errorText]}>{error}</Text>}
      </View>
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
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
  },
  defaultInput: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderWidth: 0,
    fontSize: 16,
    height: 50,
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
  },
  trailingIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});

export default Input;
