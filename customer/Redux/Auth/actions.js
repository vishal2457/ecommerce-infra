import {
  LOGIN,
  LOGIN_ERROR,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  REGISTER,
  REGISTER_ERROR,
  SUPPLIER_REGISTER,
  SUPPLIER_REGISTER_ERROR,
  USER_REDIRECT,
  USER_REDIRECT_ERROR,
  USER_FORGOT_PWD,
  USER_FORGOT_PWD_ERROR,
  RESET_LOGIN_STATE,
} from "./types";
import API from "../api";


export const login = (Email, Password, items) => async (dispatch) => {
  const body = { Email, Password, cartData: {items} };
  await API.post(`/auth/customer`, body)
    .then((res) => dispatch({ type: LOGIN, payload: res.data }))
    .catch((err) => dispatch({ type: LOGIN_ERROR, payload: err }));
};

export const register = (body) => async (dispatch) => {
  await API.post("/customer/register", body)
    .then((res) => dispatch({ type: REGISTER, payload: res.data }))
    .catch((err) => dispatch({ type: REGISTER_ERROR, payload: err }));
};

export const logout = (body) => async (dispatch) => {
  await API.post(`/auth/logoutCustomer`, body)
    .then((res) => dispatch({ type: LOGOUT_USER, payload: res.data }))
    .catch((err) => dispatch({ type: LOGOUT_USER_ERROR, payload: err }));
  //dispatch({ type: LOGOUT_USER });
};

export const supplierRegister = (body) => async (dispatch) => {
  API.post("/supplier/register", body)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: SUPPLIER_REGISTER, payload: true });
    })
    .catch((err) =>
      dispatch({ type: SUPPLIER_REGISTER_ERROR, payload: false })
    );
};

export const redirectUser = (body) => async (dispatch) => {
  await API.get("/auth/userRedirecting")
    .then((res) => dispatch({ type: USER_REDIRECT, payload: res.data }))
    .catch((err) =>
      dispatch({ type: USER_REDIRECT_ERROR, payload: err.message })
    );
};

export const forgotPwdUser = (body) => async (dispatch) => {
  await API.post("/auth/forgotPassword", { Email: body.ForgotEmail })
    .then((res) => dispatch({ type: USER_FORGOT_PWD, payload: res.data }))
    .catch((err) => dispatch({ type: USER_FORGOT_PWD_ERROR, payload: err }));
};


export const setLoginSuccess = () => async (dispatch) => {
  await dispatch({type: RESET_LOGIN_STATE})
}