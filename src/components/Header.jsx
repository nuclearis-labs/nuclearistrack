import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import LoggedHeader from './LoggedHeader';
import PublicHeader from './PublicHeader';

export default function Header() {
  const { isConnected } = useContext(UserContext);

  return isConnected ? <LoggedHeader /> : <PublicHeader />;
}
