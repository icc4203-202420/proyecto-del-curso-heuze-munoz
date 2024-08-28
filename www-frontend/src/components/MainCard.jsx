import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Beer from '@mui/icons-material/SportsBar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';

function MainCard() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // Ensures the container takes the full height of the viewport
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
          <ListItem button>
            <ListItemIcon>
              <Beer />
            </ListItemIcon>
            <ListItemText primary="Cervezas" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Bares" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}

export default MainCard;