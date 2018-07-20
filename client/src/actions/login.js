import { USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAILED, USER_LOGOUT } from '../actions/types';

export const login = payload => ({ type: USER_LOGIN, payload });

export const loginSuccess = payload => ({ type: USER_LOGIN_SUCCESS, payload });

export const loginFailed = payload => ({ type: USER_LOGIN_FAILED, payload, error: true });

export const logout = () => ({ type: USER_LOGOUT });
