import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTimeout } from 'react-use';
import Loading from '../pages/Loading';

function PrivateRoute({ children, ...rest }) {
  const { isReady, isConnected, connect } = useContext(UserContext);
  const [timePassed] = useTimeout(1500);

  useEffect(() => {
    if (isReady) connect();
    // eslint-disable-next-line
  }, [isReady]);

  if (timePassed())
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
  else return <Loading />;
}

export default PrivateRoute;
