import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Input, TextField, Autocomplete, Chip } from '@mui/material';

function EventPhotoUpload({ eventId, attendees }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [taggedAttendees, setTaggedAttendees] = useState([]);

  const handleCapture = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image || !description) return;

    const formData = new FormData();
    formData.append('event_picture[image]', image);
    formData.append('event_picture[description]', description);
    
    // Solo agrega tagged_friends si hay asistentes etiquetados
    if (taggedAttendees.length > 0) {
      formData.append('tagged_friends', JSON.stringify(taggedAttendees));
    }

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${localStorage.getItem('authToken')}`,
        },
      });
      alert('Image uploaded successfully!');
      // Reset the form
      setImage(null);
      setDescription('');
      setTaggedAttendees([]); // Resetea los asistentes etiquetados
    } catch (error) {
      console.error(error);
      alert('Failed to upload image.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Upload Event Photo
      </Typography>
      <Input
        accept="image/*"
        capture="camera"
        type="file"
        onChange={handleCapture}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <Autocomplete
        multiple
        options={attendees} // Cambia aquí para usar attendees
        getOptionLabel={(option) => option.handle} // Asegúrate de acceder correctamente a handle
        onChange={(event, value) => setTaggedAttendees(value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option.handle} {...getTagProps({ index })} key={option.id} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Tag Attendees (Optional)" variant="outlined" placeholder="Select attendees" />
        )}
        sx={{ width: '100%', marginBottom: '16px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!image || !description} // Solo deshabilita si no hay imagen o descripción
        sx={{ width: '100%' }}
      >
        Upload Photo
      </Button>
    </Box>
  );
}

export default EventPhotoUpload;
