import React from 'react';
import { Route } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function PrivateRoute(props) {
  const [isUser, user] = useAuth();

  return isUser && <Route {...props} />;
}

export default PrivateRoute;
