import jwt from 'jsonwebtoken';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

function handleUserLoginSuccess(token: any) {
  const user = jwt.decode(token);
  return { type: LOGIN_USER_SUCCESS, user };
}

function handleUserLoginFailure() {
  return { type: LOGIN_USER_FAILURE, error: 'Not able to connect' };
}

export function getCurrentUser() {
  // @ts-ignore
  const user = jwt.decode(localStorage.getItem('token'));
  return { type: GET_CURRENT_USER, user };
}

export function logoutUser() {
  localStorage.removeItem('token');
  return { type: LOGOUT_USER };
}

export function loginUser(form: any) {
  return (dispatch: any) => {
    return fetch('/auth', {
      method: 'POST',
      body: JSON.stringify({
        ...form
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res: any) => {
        if (res.ok) {
          return res.json();
        } else throw Error;
      })
      .then((token: any) => {
        localStorage.setItem('token', token);
        history.push('/');
        dispatch(handleUserLoginSuccess(token));
      })
      .catch((err: any) => dispatch(handleUserLoginFailure()));
  };
}
