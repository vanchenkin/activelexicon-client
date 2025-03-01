import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [languageLevel, setLanguageLevel] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Reset error
    setError('');
    
    // Validate inputs
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
    <View style={styles.container}>
      <StatusBar style="auto" />
            
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>ActiveLexicon</Text>
          </View>
        </View>
        
        <Text style={styles.descriptionText}>
          Приложение для развития активного словарного запаса
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
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
        
        <TextInput
          style={styles.input}
          placeholder="Уровень языка"
          value={languageLevel}
          onChangeText={setLanguageLevel}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  },
  logoContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#0099FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#0099FF',
    fontSize: 20,
    fontWeight: 'bold',
    transform: [{ rotate: '-30deg' }],
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