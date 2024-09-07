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

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found for logout');
      return;
    }
  
    try {
      await axios.delete('http://localhost:3001/api/v1/logout', {
        headers: {
          'authorization': `${token}`
        }
      });
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
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
    <AppBar position="fixed" sx={{ bgcolor: '#6A0DAD', height: '64px' }}>
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
