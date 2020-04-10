import { useState } from 'react';

export const useNavLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation(coords);
    });
  } else throw Error('No se pudo obtener la geolocalizacion');
  if (location !== null) return { location };
  else throw Error('No se pudo obtener la geolocalizacion');
};
