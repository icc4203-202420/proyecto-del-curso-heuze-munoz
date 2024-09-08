import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', {
        user: { email, password }
      });

      const token = response.headers['authorization']; // Obtener el token del encabezado
      if (token) {
        // Guarda el token en el almacenamiento local o en el estado de tu aplicación
        localStorage.setItem('authToken', token);
        console.log('Token received:', token);
        // Redirige a la página de inicio o a otra página
        console.log('Login successful. Redirecting to home page...');
        navigate('/'); // Redirige usando react-router
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={() => navigate('/signup')} // Navega a la página de registro
        sx={{ marginTop: '16px' }}
      >
        Don't have an account? Sign Up
      </Button>
    </Container>
  );
};

export default Login;