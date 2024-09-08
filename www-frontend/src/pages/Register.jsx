import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/v1/signup', {
        user: {
          first_name: firstName,
          last_name: lastName,
          email,
          handle,
          password,
<<<<<<< Updated upstream
          password_confirmation: passwordConfirmation
=======
          password_confirmation: passwordConfirmation,
          address: {
            line1: addressLine1,
            line2: addressLine2,
            city: city,
            country_id: countryId
          }
>>>>>>> Stashed changes
        }
      });
      setSuccess('Registration successful!');
      navigate('/login'); // Redirigir al login después de registrarse
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Register
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
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Handle"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: '16px' }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/login')}
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
