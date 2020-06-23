// header.js
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import PublicHeader from "./PublicHeader";
import LoggedHeader from "./LoggedHeader";
import {
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../actions/actionCreators";

function Header(props: any) {
  useEffect(() => {
    props.getCurrentUser();
  }, []);
  return props.user === null ? (
    <PublicHeader {...props} />
  ) : (
    <LoggedHeader {...props} />
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user };
}

export default connect(mapStateToProps, {
  getCurrentUser,
  loginUser,
  logoutUser,
})(Header);
