import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
  
    // Verifica si el token existe antes de hacer logout
    if (token) {
      try {
        axios.post('/api/v1/logout', {}, {
          headers: {
            Authorization: `${token}`
          }
        }).then(() => {
          // Logout exitoso
          localStorage.removeItem('authToken');
          navigate('/login');
        }).catch(err => {
          // Token expirado o cualquier otro error
          console.error("Error en logout:", err);
          // Limpiar el token local y redirigir al login
          localStorage.removeItem('authToken');
          navigate('/login');
        });
      } catch (error) {
        console.error("Error al intentar desloguear:", error);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } else {
      // Si no hay token, simplemente redirigir al login
      navigate('/login');
    }
  };

  useEffect(() => {
    // Check if user is logged in and update the state
    const token = localStorage.getItem('authToken');
    const isLoggedIn = !!token;
    setLoggedIn(isLoggedIn); // Set loggedIn based on token presence
    console.log('Token:', token);
    console.log('Logged in:', isLoggedIn);
  }, []);

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#6A0DAD', height: '64px', minWidth: '100%' }}>
      <Toolbar sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BeerBuddy
        </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="user"
          onClick={handleMenu}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {loggedIn ? (
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          ) : (
            <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}