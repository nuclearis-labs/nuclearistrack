import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider(props) {
  const [contextUser, setCurrentUser] = useState({});
  const logoutUser = props => {
    // axios.get('/api/user/logout').then(response => {
    //   setCurrentUser();
    // });
  };

  const loginUser = form => {
    return new Promise((resolve, reject) => {
      axios.post('/api/auth', form).then(response => {
        console.log(response.data);

        if (response.data.hasOwnProperty('success')) {
          setCurrentUser(response.data);
          resolve(true);
        } else if (response.data.hasOwnProperty('error')) {
          resolve(false);
        }
      });
    });
  };

  useEffect(() => {
    // axios.get('/api/user').then(response => {
    //   setCurrentUser(response.data);
    // });
  }, []);

  return (
    <UserContext.Provider value={{ contextUser, logoutUser, loginUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
