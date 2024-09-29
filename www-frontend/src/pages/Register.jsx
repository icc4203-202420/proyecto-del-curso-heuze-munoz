import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Card, CardContent, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
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
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/countries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(err => {
        setError('Failed to load countries.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await axios.post('http://localhost:3001/api/v1/signup', userData);
      setSuccess('Registration successful!');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body2" color="success" gutterBottom>
              {success}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              label="First Name *"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name *"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Email *"
              type="email"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Handle *"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. johndoe123"
              required
            />
            <TextField
              label="Password *"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password *"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />

            <Typography variant="h6" gutterBottom>
              Address (Optional)
            </Typography>
            <TextField
              label="Address Line 1"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
            <TextField
              label="Address Line 2"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <FormControl fullWidth sx={{ marginBottom: '16px' }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={countryId}
                onChange={(e) => setCountryId(parseInt(e.target.value, 10))}
                label="Country"
              >
                {countries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(country => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              * If you decide to add an address, the country is required.
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: '16px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ marginBottom: '16px' }}
            >
              Already have an account? Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
