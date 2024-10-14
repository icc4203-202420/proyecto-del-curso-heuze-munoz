import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

function RegisterScreen({navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [countryId, setCountryId] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://topical-pheasant-primary.ngrok-free.app/api/v1/countries'); // Cambia localhost por tu IP si es necesario
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError('Failed to load countries.');
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const userData = {
      user: {
        first_name: firstName,
        last_name: lastName,
        email,
        handle,
        password,
        password_confirmation: passwordConfirmation,
      }
    };

    if (countryId) {
      userData.user.address_attributes = {
        line1: addressLine1,
        line2: addressLine2,
        city: city,
        country_id: countryId
      };
    }

    try {
      const response = await fetch('https://topical-pheasant-primary.ngrok-free.app/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      setSuccess('Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <TextInput
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Last Name *"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Handle *"
        value={handle}
        onChangeText={setHandle}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Confirm Password *"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
        style={styles.input}
        required
      />
      
      <Text style={styles.optionalHeader}>Address (Optional)</Text>
      <TextInput
        placeholder="Address Line 1"
        value={addressLine1}
        onChangeText={setAddressLine1}
        style={styles.input}
      />
      <TextInput
        placeholder="Address Line 2"
        value={addressLine2}
        onChangeText={setAddressLine2}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      {/* Aquí podrías agregar un Picker para los países, si es necesario */}
      
      <Button
        title={loading ? "Signing Up..." : "Sign Up"}
        onPress={handleSubmit}
        disabled={loading}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')} // Cambia aquí
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  success: {
    color: 'green',
    marginBottom: 12,
  },
  optionalHeader: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default RegisterScreen;
