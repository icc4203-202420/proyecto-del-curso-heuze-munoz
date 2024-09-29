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
      alert('You must be logged in to see the users list.');
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
        elevation={6}
        sx={{
          width: 320,
          padding: '24px',
          textAlign: 'center',
          borderRadius: '8px',
          bgcolor: '#ffffff', // Fondo blanco del card
        }}
      >
        <List>
          <ListItem button onClick={handleUsersClick} sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
            <ListItemIcon sx={{ color: '#6A0DAD' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Users" 
              primaryTypographyProps={{
                style: { color: '#6A0DAD', fontWeight: 'bold', fontSize: '1.1rem' }, // Cambia el color, negrita y tamaño
              }} 
            />
          </ListItem>
          <ListItem button component="a" href="/beers" sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
            <ListItemIcon sx={{ color: '#6A0DAD' }}>
              <SportsBarIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Beers" 
              primaryTypographyProps={{
                style: { color: '#6A0DAD', fontWeight: 'bold', fontSize: '1.1rem' },
              }} 
            />
          </ListItem>
          <ListItem button component="a" href="/bars" sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
            <ListItemIcon sx={{ color: '#6A0DAD' }}>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Bars" 
              primaryTypographyProps={{
                style: { color: '#6A0DAD', fontWeight: 'bold', fontSize: '1.1rem' },
              }} 
            />
          </ListItem>
          <ListItem button component='a' href="/events" sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
            <ListItemIcon sx={{ color: '#6A0DAD' }}>
              <EventIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Events" 
              primaryTypographyProps={{
                style: { color: '#6A0DAD', fontWeight: 'bold', fontSize: '1.1rem' },
              }} 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default MainCard;
