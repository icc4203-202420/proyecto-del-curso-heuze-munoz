import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SearchIcon from '@mui/icons-material/Search'; // Lupa
import MenuIcon from '@mui/icons-material/Menu';     // Tres líneas (menú)
import { Link as RouterLink } from 'react-router-dom'; // Importa Link de react-router-dom

export default function BotNav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
      <BottomNavigation
        showLabels
        sx={{ bgcolor: '#6A0DAD' }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction 
          label="Search" 
          icon={<SearchIcon />} 
          onClick={() => {
            // Aquí puedes agregar la lógica para la búsqueda cuando esté disponible
          }} 
        />
        <BottomNavigationAction 
          label="Menu" 
          icon={<MenuIcon />} 
          component={RouterLink} 
          to="/"  // La ruta a la que debe llevar el botón
        />
      </BottomNavigation>
    </Box>
  );
}
