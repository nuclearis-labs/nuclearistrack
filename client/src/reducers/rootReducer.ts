import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  GET_CURRENT_USER,
  LOGOUT_USER
} from '../actions/actionCreators';

const initialState = { user: null };

export function rootReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return { ...state, user: action.user, error: undefined };
    case LOGIN_USER_FAILURE:
      return { ...state, error: action.error };
    case GET_CURRENT_USER:
      return { ...state, user: action.user };
    case LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}
