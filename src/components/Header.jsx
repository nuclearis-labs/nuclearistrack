// header.js
import React, { useContext } from 'react';
import PublicHeader from './PublicHeader';
import LoggedHeader from './LoggedHeader';
import useAuth from '../hooks/useAuth';

function Header(props) {
  const [isUser, user] = useAuth();

  return isUser ? (
    <LoggedHeader {...props} user={user} />
  ) : (
    <PublicHeader {...props} />
  );
}

export default Header;
