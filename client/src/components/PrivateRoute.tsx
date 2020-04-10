import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router';

interface IPrivateRoute extends RouteProps {
  roles: string;
  path: string;
  component: (props: any) => JSX.Element;
  exact?: boolean;
}

export default function PrivateRoute(props: IPrivateRoute) {
  const { user } = useAuth();
console.log(user?.roles);
console.log(props.roles);

  if (!user) return <Redirect to="/login" />;
  if (user?.roles?.includes(props.roles)) return <Route {...props} />;
  else return <Redirect to="/" />;
}
