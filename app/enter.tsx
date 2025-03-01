import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function EnterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.welcomeText}>Добро пожаловать!</Text>

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>ActiveLexicon</Text>
        </View>
      </View>

      <Text style={styles.descriptionText}>
        Приложение для развития активного словарного запаса
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Регистрация</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Войти по логину и паролю</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 30,
    color: '#333',
  },
  logoContainer: {
    marginBottom: 20,
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
