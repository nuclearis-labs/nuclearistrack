import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const center = {
  lat: -34.57351,
  lng: -58.474495,
};

function DocumentMap(props) {
  const [map, setMap] = React.useState(null);
  const [position, setPosition] = useState({
    lat: props.coords.lat,
    lng: props.coords.lng,
  });
  console.log(props.coords);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
        options={{
          draggable: false,
          gestureHandling: false,
          zoomControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
        }}
      >
        <Marker
          onDragEnd={(mouseEvent) => {
            props.setLocation({
              lat: mouseEvent.latLng.lat(),
              lng: mouseEvent.latLng.lng(),
            });
          }}
          draggable
          position={props.coords}
        />{' '}
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(DocumentMap);
