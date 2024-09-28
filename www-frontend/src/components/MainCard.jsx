import React from 'react';
import { Paper, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';

function MainCard() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authToken'); // Verifica si el token está presente

  const handleUsersClick = (event) => {
    if (!isAuthenticated) {
      event.preventDefault(); // Evita la navegación si no está autenticado
      alert('Debes iniciar sesión para ver la lista de usuarios.');
      navigate('/login'); // Redirige a la página de login
    } else {
      navigate('/users'); // Si está autenticado, navega a la página de usuarios
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '64px',
        width: '100vw',
        minWidth: '100%',
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
          <ListItem button onClick={handleUsersClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component="a" href="/beers">
            <ListItemIcon>
              <SportsBarIcon />
            </ListItemIcon>
            <ListItemText primary="Beers" />
          </ListItem>
          <ListItem button component="a" href="/bars">
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Bars" />
          </ListItem>
          <ListItem button component={Link} to="/events">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default MainCard;
