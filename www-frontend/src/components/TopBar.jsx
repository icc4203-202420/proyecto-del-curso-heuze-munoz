import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
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
  
    if (token) {
      axios.delete('http://localhost:3001/api/v1/logout', {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(() => {
        localStorage.removeItem('authToken');
        navigate('/login');
      })
      .catch(err => {
        console.error("Error en logout:", err);
        localStorage.removeItem('authToken');
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setLoggedIn(!!token);
  }, []);

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#6A0DAD', height: '64px' }}>
      <Toolbar sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          BeerBuddy
        </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="user menu"
          onClick={handleMenu}
          sx={{ transition: '0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              '& .MuiMenuItem-root': {
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              },
            },
          }}
        >
          {loggedIn ? (
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          ) : (
            <MenuItem onClick={() => navigate('/login')}>Login/Sign Up</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
