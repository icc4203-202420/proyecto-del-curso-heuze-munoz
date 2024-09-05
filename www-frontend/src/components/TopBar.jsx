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
    try {
      await axios.delete('http://localhost:3001/api/v1/logout', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Adjust token storage as needed
        }
      });
      localStorage.removeItem('jwtToken'); // Clear token on logout
      setLoggedIn(false); // Update login state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout error', error);
    }
    handleClose();
  };

  useEffect(() => {
    // Check if user is logged in and update the state
    const token = localStorage.getItem('jwtToken');
    console.log('Token:', token); // Debugging statement
    setLoggedIn(!!token); // Set loggedIn based on token presence

    console.log('LoggedIn State:', !!token);

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
