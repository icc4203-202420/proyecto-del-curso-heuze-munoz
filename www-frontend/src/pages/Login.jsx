import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', {
        user: { email, password }
      });

      const token = response.headers['authorization'];
      const userId = response.data.status.data.user.id;

      if (token && userId) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        navigate('/');
      } else {
        setError('Login failed: No token or user ID received.');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={loading}
            sx={{ marginTop: '16px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate('/signup')}
            sx={{ marginTop: '16px' }}
          >
            Don't have an account? Sign Up
          </Button>
          <Typography color="secondary" sx={{ marginTop: '16px' }}>
            Email: default@example.com
          </Typography>
          <Typography color="secondary">
            PW: password
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
