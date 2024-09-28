import React, { useState } from 'react';
import axios from 'axios';

function EventPhotoUpload({ eventId }) {
  const [image, setImage] = useState(null);

  const handleCapture = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('event_picture[image]', image);

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload image.');
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        capture="camera"
        type="file"
        onChange={handleCapture}
      />
      <button onClick={handleSubmit}>Upload Photo</button>
    </div>
  );
}

export default EventPhotoUpload;
