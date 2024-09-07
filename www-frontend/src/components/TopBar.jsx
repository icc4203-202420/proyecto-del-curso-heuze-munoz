import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

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
          aria-label="settings"
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}