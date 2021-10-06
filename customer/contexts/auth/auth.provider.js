import React, { useReducer } from 'react';
import { NOTIFICATION_COUNT, TOKEN_PREFIX, USER_DATA } from '../../utility/commonUtility';
import { AuthContext } from './auth.context';
const isBrowser = typeof window !== 'undefined';
const INITIAL_STATE = {
  isAuthenticated: isBrowser && !!localStorage.getItem(TOKEN_PREFIX),
  NotificationCount: isBrowser && localStorage.getItem(NOTIFICATION_COUNT),
  user: isBrowser && localStorage.getItem(USER_DATA)
};

function reducer(state, action) {

  switch (action.type) {
    case 'SIGNIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
      };

    case 'UPDATE_NOTIFICATION_COUNT': 
      return {...state, NotificationCount: action.payload.count}
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
