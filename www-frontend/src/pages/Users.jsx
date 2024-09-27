import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState(''); // Para almacenar el evento opcional
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
  }, [navigate]);

  const handleAddFriend = (user) => {
    setSelectedUser(user);
    setOpen(true); // Abrir el cuadro de diálogo
  };

  const handleClose = () => {
    setOpen(false); // Cerrar el cuadro de diálogo
    setEvent(''); // Limpiar el campo del evento
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('authToken');
    
    // Realizar la solicitud POST para agregar la amistad
    axios.post('http://localhost:3001/api/v1/friendships', {
      friend_id: selectedUser.id, // ID del usuario seleccionado
      event_name: event // Evento opcional donde se conocieron
    }, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(response => {
      console.log('Friendship created:', response.data);
      handleClose(); // Cerrar el cuadro de diálogo después de agregar al amigo
    })
    .catch(error => {
      console.error('Error creating friendship:', error);
    });
  };

  // Filtrar usuarios basados en el término de búsqueda
  const filteredUsers = users.filter(user =>
    user.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Users Page
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      
      {/* Cuadro de búsqueda */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        sx={{ 
          marginBottom: '16px',
          '& .MuiInputBase-input': {
            color: '#fff'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff'
            },
            '&:hover fieldset': {
              borderColor: '#fff'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#fff'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff'
          },
          backgroundColor: '#3f3f3f'
        }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <Grid container spacing={2}>
        {filteredUsers.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.handle}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {user.handle}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddFriend(user)} // Abrir el cuadro de diálogo al hacer clic
                  sx={{ marginTop: '8px' }}
                >
                  Add Friend
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cuadro de diálogo para agregar amigos */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <Typography>
            Add {selectedUser?.handle} as a friend. Optionally, you can indicate the event where you met.
          </Typography>
          <TextField
            label="Event Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={event}
            onChange={(e) => setEvent(e.target.value)} // Almacenar el evento opcional
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
