import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      console.log('Token guardado');
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  };

  const saveUserId = async (userId) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      console.log('User id guardado');
    } catch (error) {
      console.error('Error al guardar el user id:', error);
    }
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://topical-pheasant-primary.ngrok-free.app/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });
      const data = await response.json();
      console.log(data)
      
      const token = response.headers.get('authorization');
      const userId = data.status.data.user.id;

      if (token && userId) {
        // Almacena el token y userId
        saveToken(token);
        saveUserId(userId);

        Alert.alert('Login successful!', 'Welcome back!');
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
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('Register')}
      />
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
  info: {
    color: 'gray',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
