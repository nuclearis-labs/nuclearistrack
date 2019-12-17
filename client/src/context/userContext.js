import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider(props) {
  const [change, setChange] = useState();
  const [contextUser, setCurrentUser] = useState({});
  const logoutUser = props => {
    localStorage.removeItem('token');
    setChange(false);
  };

  const loginUser = form => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth', form)
        .then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', JSON.stringify(response.data.token));
            setChange(true);
            resolve(true);
          } else {
            reject();
          }
        })
        .catch(e => {
          reject();
        });
    });
  };

  useEffect(() => {
    axios({
      method: 'post',
      url: '/auth/current',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(({ data }) => {
      setCurrentUser(data);
    });
  }, [change]);

  return (
    <UserContext.Provider value={{ contextUser, logoutUser, loginUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
