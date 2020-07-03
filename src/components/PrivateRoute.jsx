import React from 'react';
import { Route } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useWeb3 from '../hooks/useWeb3';

function PrivateRoute(props) {
  const web3 = useWeb3();
  const [isUser] = useAuth(web3);
  if (web3) return isUser ? <Route {...props} /> : null;
  else return null;
}

export default PrivateRoute;
