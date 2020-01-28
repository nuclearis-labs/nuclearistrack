import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ children, ...rest }) {
  const { contextUser } = useContext(UserContext);
  console.log(contextUser);

  return (
    <Route
      {...rest}
      render={() =>
        contextUser.hasOwnProperty('address') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      }
    />
  );
}
