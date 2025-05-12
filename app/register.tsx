import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import LanguageLevelSelect from '../components/LanguageLevelSelect';
import BackButton from '../components/BackButton';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../context/crossPlatformAlert';

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

    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    try {
      await signUp(email, password, languageLevel);
      router.replace('/');
    } catch (error: unknown) {
      console.error('Registration error:', error);

      const apiError = error as { response?: { status?: number } };
      if (apiError?.response?.status === 409) {
        setError('Этот email уже занят. Пожалуйста, используйте другой email.');
      } else if (apiError?.response?.status === 400) {
        setError(
          'Ошибка валидации. Проверьте email и пароль. Пароль должен содержать минимум 8 символов, включая букву и цифру.'
        );
      } else {
        setError('Ошибка при регистрации.');
        Alert.alert(
          'Регистрация не удалась',
          'Не удалось создать аккаунт. Пожалуйста, попробуйте снова.'
        );
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.backButtonContainer}>
          <BackButton onPress={() => router.replace('/enter')} />
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
          fullWidth
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
    justifyContent: 'center',
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
