import { connect } from 'react-redux';
import { getCurrentUser } from '../actions/actionCreators';

type IRoleBasedACL = {
  roles: string[];
  children: JSX.Element;
};

const RoleBasedACL = (props: any) => {
  if (props.user.roles) {
    if (props.roles.some((element: any) => props.user.roles.includes(element)))
      return props.children;
    else return null;
  }
  return null;
};

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user };
}

export default connect(
  mapStateToProps,
  { getCurrentUser }
)(RoleBasedACL);
