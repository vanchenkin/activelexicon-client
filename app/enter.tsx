import React from 'react';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function EnterScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <Typography size="2xl" style={styles.welcomeText}>
        Добро пожаловать!
      </Typography>

      <ThemedView style={styles.logoContainer}>
        <Logo />
      </ThemedView>

      <Typography size="md" style={styles.descriptionText}>
        Приложение для развития активного словарного запаса
      </Typography>

      <ThemedView style={styles.buttonContainer}>
        <Button title="Регистрация" onPress={() => router.push('/register')} />

        <Button
          title="Войти по логину и паролю"
          onPress={() => router.push('/login')}
        />

        {/* <Button
          title="Войти через Google"
          onPress={signInWithGoogle}
          variant="primary"
          size="medium"
          fullWidth
        /> */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    maxWidth: '80%',
  },
  buttonContainer: {
    gap: 10,
    width: '100%',
    maxWidth: 300,
  },
});
