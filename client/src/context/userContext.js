import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider(props) {
  const [contextUser, setCurrentUser] = useState({});
  const logoutUser = props => {
    localStorage.removeItem('token');
    setCurrentUser();
  };

  const loginUser = form => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth', form)
        .then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', JSON.stringify(response.data.token));
            setCurrentUser(response.data);
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
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }).then(({ data }) => {
      console.log(data);

      setCurrentUser(data);
    });
  }, []);

  return (
    <UserContext.Provider value={{ contextUser, logoutUser, loginUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
