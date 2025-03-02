import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import BackButton from '../components/BackButton';
import Input from '../components/Input';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      setError('Ошибка входа. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton onPress={() => router.replace('/')} />

      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.logoContainer}>
          <Logo />
        </ThemedView>
        <Typography size="md" style={styles.descriptionText}>
          Приложение для развития активного словарного запаса
        </Typography>
        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          fullWidth
        />
        <Input
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          fullWidth
          error={error || undefined}
        />
        <Button
          fullWidth
          title="Войти"
          onPress={handleLogin}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
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
  },
  input: {
    fontFamily: 'Inter-Regular',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
});
