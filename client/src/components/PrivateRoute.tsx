import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentUser } from '../actions/actionCreators';

function PrivateRoute(props: any) {
  return localStorage.getItem('token') ? (
    <Route {...props} />
  ) : (
    <Redirect to="/login" />
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user };
}

export default connect(
  mapStateToProps,
  { getCurrentUser }
)(PrivateRoute);
