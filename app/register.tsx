import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import LanguageLevelSelect from '../components/LanguageLevelSelect';
import BackButton from '../components/BackButton';
import Input from '../components/Input';

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
    <ThemedView style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.backButtonContainer}>
          <BackButton onPress={() => router.replace('/')} />
        </ThemedView>

        <ThemedView style={styles.logoContainer}>
          <Logo />
        </ThemedView>

        <Typography style={styles.descriptionText}>
          Приложение для развития активного словарного запаса
        </Typography>

        {error ? (
          <Typography color="red" style={styles.errorText}>
            {error}
          </Typography>
        ) : null}

        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          fullWidth
          error={error || undefined}
        />

        <Input
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          fullWidth
        />

        <Input
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          fullWidth
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
          fullWidth
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    padding: 15,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
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
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
