import React, { createContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider(props) {
  const logoutUser = () => {
    localStorage.removeItem('token');
  };

  const loginUser = form => {
    return new Promise((resolve, reject) => {
      axios({ method: 'POST', url: '/auth', data: form })
        .then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', response.data);
            resolve(true);
          } else {
            reject();
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  };

  const getCurrentUser = () => {
    const jwt = localStorage.getItem('token');
    let session;
    try {
      if (jwt) {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        session = JSON.parse(window.atob(base64));
      }
    } catch (error) {
      console.error(error);
    }
    return session;
  };

  return (
    <UserContext.Provider value={{ getCurrentUser, logoutUser, loginUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
