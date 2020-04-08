import { useAuth } from '../hooks/useAuth';

export default function RoleBasedACL(props) {
  const { user } = useAuth();

  if (user) {
    if (props.roles.some(element => user.roles.includes(element)))
      return props.children;
    else return null;
  } else {
    return null;
  }
}
