import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute(props) {
  const { getCurrentUser } = useContext(UserContext);
  const Component = props.component;

  return getCurrentUser() ? <Component /> : <Redirect to="/login" />;
}
