import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si ya hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, redirigir a la página principal
      navigate('/'); // O la ruta a la que quieras redirigir al usuario autenticado
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/v1/login', { email, password })
      .then(response => {
        // Guarda el token en el localStorage
        const token = response.data.token; // Asegúrate de que el token esté en la respuesta
        localStorage.setItem('token', token);
        navigate('/'); // Redirige a la página principal
      })
      .catch(error => {
        setError('Invalid email or password');
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
