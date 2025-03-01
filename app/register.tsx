import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import LanguageLevelSelect from '../components/LanguageLevelSelect';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [languageLevel, setLanguageLevel] = useState('');
  const [error, setError] = useState('');
  const { signUp, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError('');

    if (!email || !password || !confirmPassword || !languageLevel) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <ThemedView
      style={styles.container}
      darkColor="#1E1E1E"
      lightColor="#F8F8F8"
    >
      <StatusBar style="auto" />

      <ThemedView
        style={styles.formContainer}
        lightColor="white"
        darkColor="#2A2A2A"
      >
        <ThemedView style={styles.logoContainer}>
          <Logo size={150} color="#0099FF" />
        </ThemedView>

        <Typography style={styles.descriptionText}>
          Приложение для развития активного словарного запаса
        </Typography>

        {error ? (
          <Typography color="red" style={styles.errorText}>
            {error}
          </Typography>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <LanguageLevelSelect
          value={languageLevel}
          onChange={setLanguageLevel}
          placeholder="Выберите уровень языка"
          style={styles.input}
        />

        <Button
          title="Зарегистрироваться"
          onPress={handleRegister}
          disabled={isLoading}
          isLoading={isLoading}
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
    backgroundColor: '#1E1E1E',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    padding: 15,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  logoContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    maxWidth: '80%',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#0099FF',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
