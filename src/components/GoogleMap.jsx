import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

function DocumentMap(props) {
  const [position] = useState({
    lat: props.coords.lat,
    lng: props.coords.lng,
  });

  return (
    <LoadScript googleMapsApiKey="AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
        options={{
          draggable: true,
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
          draggable={props.draggable}
          position={props.coords}
        />
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(DocumentMap);
