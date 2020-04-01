import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ ...rest }) {
  const { getCurrentUser } = useContext(UserContext);
  const user = getCurrentUser();

  if (!user) return <Redirect to="/login" />;
  if (user && user.roles.includes(rest.roles)) return <Route {...rest} />;
  else return <Redirect to="/" />;
}
