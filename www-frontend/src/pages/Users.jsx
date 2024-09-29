import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Chip, CardContent, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from '@mui/material';

function Users() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Si hay un token, retorna true, si no, false
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      if (!isUserLoggedIn()) {
        alert('You must be logged in to see the users list.');
        navigate('/login');
        return;
      }
  
      if (!token || !userId) {
        alert('User session not found. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        // Cargar los usuarios
        const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const filteredUsers = usersResponse.data.filter(user => user.id !== userId);
        setUsers(filteredUsers);

        // Cargar los amigos del usuario actual
        const friendsResponse = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: {
            Authorization: `${token}`,
          },
          params: { user_id: userId },
        });
        setFriends(friendsResponse.data);
        
        // Cargar eventos
        const eventsResponse = await axios.get('http://localhost:3001/api/v1/events', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setEvents(eventsResponse.data.events);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddFriend = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    try {
      // Realizar la solicitud POST para agregar la amistad
      const response = await axios.post(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
        user_id: userId,
        friend_id: selectedUser.id,
        event_id: selectedEvent ? selectedEvent.id : null
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      handleClose();
    } catch (error) {
      console.error('Error creating friendship:', error);
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user =>
    user.handle.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.id !== Number(userId)
  );

  return (
    <Box sx={{ padding: '16px', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>
        Users Page
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        sx={{ 
          marginBottom: '16px',
          '& .MuiInputBase-input': { color: '#000' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#fff' },
            '&:hover fieldset': { borderColor: '#fff' },
            '&.Mui-focused fieldset': { borderColor: '#fff' }
          },
          '& .MuiInputLabel-root': { color: '#fff' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
        }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <Grid container spacing={2}>
        {filteredUsers.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.handle}>
            <Card sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {user.handle}
                  {/* Mostrar Chip si el usuario es amigo */}
                  {friends.some(friend => friend.id === user.id) && (
                    <Chip label="Friend" color="success" sx={{ marginLeft: '8px' }} />
                  )}
                </Typography>
                {/* Solo mostrar el botón si no es amigo */}
                {!friends.some(friend => friend.id === user.id) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddFriend(user)}
                    sx={{ marginTop: '8px' }}
                  >
                    Add Friend
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <Typography>
            Add {selectedUser?.handle} as a friend. Optionally, you can indicate the event where you met.
          </Typography>
          
          <Autocomplete
            options={Array.isArray(events) ? events : []}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => (
              <TextField {...params} label="Event" variant="outlined" fullWidth margin="normal" />
            )}
            onChange={(event, newValue) => setSelectedEvent(newValue)}
            value={selectedEvent}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
