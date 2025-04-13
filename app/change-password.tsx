import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useChangePassword } from '@/hooks/useApi';
import Header from '@/components/Header';
import { Alert } from '../context/crossPlatformAlert';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = async () => {
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      changePassword(
        { currentPassword, newPassword },
        {
          onSuccess: () => {
            Alert.alert('Успех', 'Пароль успешно изменен', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: (error) => {
            console.error('Error changing password:', error);
            setError(
              'Ошибка при изменении пароля. Возможно, текущий пароль неверен.'
            );
          },
        }
      );
    } catch (error) {
      console.error('Error changing password:', error);
      setError(
        'Ошибка при изменении пароля. Возможно, текущий пароль неверен.'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Изменить пароль" onBackPress={() => router.back()} />

      <ThemedView style={styles.content}>
        {error ? (
          <Typography color="red" style={styles.errorText}>
            {error}
          </Typography>
        ) : null}

        <Input
          placeholder="Текущий пароль"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          fullWidth
          style={styles.input}
        />

        <Input
          placeholder="Новый пароль"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          fullWidth
          style={styles.input}
        />

        <Input
          placeholder="Подтвердите новый пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          fullWidth
          style={styles.input}
        />

        <Button
          title="Сохранить"
          onPress={handleSubmit}
          isLoading={isPending}
          disabled={
            isPending || !currentPassword || !newPassword || !confirmPassword
          }
          style={styles.button}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
