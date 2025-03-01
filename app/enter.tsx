import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';

export default function EnterScreen() {
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <Typography weight="bold" size="2xl" style={styles.welcomeText}>
        Добро пожаловать!
      </Typography>

      <ThemedView style={styles.logoContainer}>
        <Logo size={150} />
      </ThemedView>

      <Typography size="md" style={styles.descriptionText}>
        Приложение для развития активного словарного запаса
      </Typography>

      <ThemedView style={styles.buttonContainer}>
        <Button
          title="Регистрация"
          onPress={() => router.push('/register')}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <Button
          title="Войти по логину и паролю"
          onPress={() => router.push('/login')}
          style={styles.button}
          textStyle={styles.buttonText}
        />
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
    color: '#333',
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
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#0099FF',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
