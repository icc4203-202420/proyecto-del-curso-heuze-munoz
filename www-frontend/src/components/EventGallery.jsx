import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventGallery({ eventId }) {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/events/${eventId}/event_pictures`,
          {
            headers: {
              Authorization: `${localStorage.getItem('authToken')}`,
            },
          }
        );
        setPictures(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPictures();
  }, [eventId]);

  return (
    <div style={{ overflowY: 'scroll', maxHeight: '80vh' }}>
      {pictures.map((picture) => (
        <div key={picture.id}>
          <img
            src={picture.image_url}
            alt={picture.description}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <p>{picture.description}</p>
        </div>
      ))}
    </div>
  );
}

export default EventGallery;
