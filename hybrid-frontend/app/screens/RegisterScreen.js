import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    handle: '',
    password: '',
    passwordConfirmation: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    countryId: '',
  });
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/countries`);
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data); // Inicializar la lista filtrada
      } catch (err) {
        setError('Failed to load countries.');
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleCountrySelect = (country) => {
    handleChange('countryId', country.id); // Asigna el ID del país seleccionado
    setModalVisible(false); // Cierra el modal
  };

  const handleCountrySearch = (text) => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const userData = {
      user: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        handle: formData.handle,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        address_attributes: formData.countryId ? {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          country_id: formData.countryId,
        } : undefined,
      },
    };

    try {
      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        value={formData.firstName}
        onChangeText={value => handleChange('firstName', value)}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Last Name *"
        value={formData.lastName}
        onChangeText={value => handleChange('lastName', value)}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Email *"
        value={formData.email}
        onChangeText={value => handleChange('email', value)}
        keyboardType="email-address"
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Handle *"
        value={formData.handle}
        onChangeText={value => handleChange('handle', value)}
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Password *"
        value={formData.password}
        onChangeText={value => handleChange('password', value)}
        secureTextEntry
        style={styles.input}
        required
      />
      <TextInput
        placeholder="Confirm Password *"
        value={formData.passwordConfirmation}
        onChangeText={value => handleChange('passwordConfirmation', value)}
        secureTextEntry
        style={styles.input}
        required
      />
      
      <Text style={styles.optionalHeader}>Address (Optional)</Text>
      <TextInput
        placeholder="Address Line 1"
        value={formData.addressLine1}
        onChangeText={value => handleChange('addressLine1', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Address Line 2"
        value={formData.addressLine2}
        onChangeText={value => handleChange('addressLine2', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={formData.city}
        onChangeText={value => handleChange('city', value)}
        style={styles.input}
      />
      
      {/* Campo para seleccionar país */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
        <Text>{formData.countryId ? countries.find(country => country.id === formData.countryId)?.name : 'Select Country'}</Text>
      </TouchableOpacity>

      {/* Modal de selección de país */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Search Country..."
            onChangeText={handleCountrySearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCountrySelect(item)} style={styles.countryItem}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonTextSecondary}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionalHeader: {
    fontSize: 18,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  countryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default RegisterScreen;
