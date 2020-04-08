import { useState } from 'react';

export const useNavLocation = () => {
  const [location, setLocation] = useState(undefined);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation(coords);
    });
  } else setLocation(false);

  return { location };
};
