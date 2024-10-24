import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const saveToken = async (token) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  };

  const saveUserId = async (userId) => {
    try {
      await SecureStore.setItemAsync('userId', userId.toString());
    } catch (error) {
      console.error('Error al guardar el user id:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Error response (not JSON):', errorText);
        Alert.alert('Login failed', 'Unexpected server response');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const token = response.headers.get('authorization');
      const userId = data.status.data.user.id;

      if (token && userId) {
        await saveToken(token);
        await saveUserId(userId);
        navigation.navigate('Home');
      } else {
        Alert.alert('Login failed', 'No token or user ID received.');
      }
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        required
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonTextSecondary}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.info}>
        Email: default@example.com{'\n'}PW: password
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  button: {
    width: '100%', // Asegurando que el botón ocupe todo el ancho
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10, // Espaciado entre botones
  },
  buttonSecondary: {
    width: '100%',
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: 'white',
    fontWeight: 'bold',
  },
  info: {
    color: 'gray',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
