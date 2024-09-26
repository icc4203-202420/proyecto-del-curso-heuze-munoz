import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';

const MapComponent = ({ lat, lng }) => {
  const [center, setCenter] = useState({ lat, lng });

  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  useEffect(() => {
    setCenter({ lat, lng });
  }, [lat, lng]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={center}
      >
        <MarkerF position={center}/>
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
