import { useContext } from 'react';
import { UserContext } from '../context/userContext';

export default function RoleBasedACL(props) {
  const { getCurrentUser, logoutUser } = useContext(UserContext);
  const user = getCurrentUser();

  if (user && user.hasOwnProperty('roles')) {
    if (props.roles.some(element => user.roles.includes(element)))
      return props.children;
    else return null;
  } else {
    return null;
  }
}
