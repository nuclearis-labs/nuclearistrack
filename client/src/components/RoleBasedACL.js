import { useContext } from 'react';
import { UserContext } from '../context/userContext';

export default function RoleBasedACL(props) {
  const { getCurrentUser } = useContext(UserContext);
  const user = getCurrentUser();
  if (props.roles.some(element => user.roles.includes(element)))
    return props.children;
  else return null;
}
