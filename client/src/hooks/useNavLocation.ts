import { useState, useEffect } from 'react';

export const useNavLocation = (): Promise<Coordinates | undefined> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => resolve(coords));
    } else {
      return reject(undefined);
    }
  });
};
