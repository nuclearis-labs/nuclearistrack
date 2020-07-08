import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function PrivateRoute({ children, ...rest }) {
  const { isReady, isConnected, connect } = useContext(UserContext);

  useEffect(() => {
    if (isReady) connect();
    // eslint-disable-next-line
  }, [isReady]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isConnected ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
}

export default PrivateRoute;
