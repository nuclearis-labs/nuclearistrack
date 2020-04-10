import { useAuth } from '../hooks/useAuth';
import { FunctionComponent } from 'react';

type IRoleBasedACL = {
  roles: string[];
  children: JSX.Element;
};

const RoleBasedACL: FunctionComponent<IRoleBasedACL> = props => {
  const { user } = useAuth();

  if (user?.roles) {
    if (props.roles.some(element => user.roles.includes(element)))
      return props.children;
    else return null;
  }
  return null;
};

export default RoleBasedACL;
