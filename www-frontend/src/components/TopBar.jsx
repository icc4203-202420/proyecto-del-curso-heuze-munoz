import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

export default function TopBar() {
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
          aria-label="settings"
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}