import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

interface GoogleSignInButtonProps {
  fullWidth?: boolean;
}

const GoogleSignInButton = ({ fullWidth = false }: GoogleSignInButtonProps) => {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <Button
      title="Войти через Google"
      onPress={signInWithGoogle}
      variant="primary"
      size="medium"
      fullWidth={fullWidth}
      isLoading={isLoading}
      style={styles.googleButton}
    />
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    shadowColor: '#2E6AD1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
});

export default GoogleSignInButton;
