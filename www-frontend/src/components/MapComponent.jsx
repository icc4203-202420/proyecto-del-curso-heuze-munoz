import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const MapComponent = ({ lat, lng }) => {
  const mapStyles = {        
    height: "400px",
    width: "100%"
  };

  const defaultCenter = {
    lat: lat,
    lng: lng
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;