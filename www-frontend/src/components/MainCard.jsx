import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';

function MainCard() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '64px',
        width: '100vw',
        minWidth: '100%'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 300,
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <List>
          <ListItem button component={Link} to="/users">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/beers">
            <ListItemIcon>
              <SportsBarIcon />
            </ListItemIcon>
            <ListItemText primary="Beers" />
          </ListItem>
          <ListItem button component={Link} to="/bars">
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Bars" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default MainCard;
