import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '../components/ThemedView';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Input from '../components/Input';
import BackButton from '../components/BackButton';
import { profileServiceInstance } from '../services/api';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setIsSubmitting(true);

      const response = await profileServiceInstance.changePassword(
        currentPassword,
        newPassword
      );

      if (response.success) {
        Alert.alert('Успех', 'Пароль успешно изменен', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        setError('Не удалось изменить пароль');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError(
        'Ошибка при изменении пароля. Возможно, текущий пароль неверен.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton onPress={() => router.back()} />
      <ThemedView style={styles.header}>
        <Typography size="lg" style={styles.headerTitle}>
          Изменить пароль
        </Typography>
      </ThemedView>

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
          isLoading={isSubmitting}
          disabled={
            isSubmitting || !currentPassword || !newPassword || !confirmPassword
          }
          style={styles.button}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
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
