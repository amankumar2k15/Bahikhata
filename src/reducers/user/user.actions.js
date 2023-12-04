import {
  USER_LOGIN_FAILED,
  USER_LOGIN_PROGRESS,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT
} from "./user.actionsTypes";

export const loginProgress = () => ({ type: USER_LOGIN_PROGRESS });

export const loginFailed = (error) => ({
  type: USER_LOGIN_FAILED,
  payload: error
});

export const loginSuccessfully = (user) => ({
  type: USER_LOGIN_SUCCESS,
  payload: user
});

export const logout = () => ({ type: USER_LOGOUT });
