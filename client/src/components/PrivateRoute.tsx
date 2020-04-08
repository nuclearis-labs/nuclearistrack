import React, { useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ ...rest }) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/login" />;
  if (user && user.roles.includes(rest.roles)) return <Route {...rest} />;
  else return <Redirect to="/" />;
}
