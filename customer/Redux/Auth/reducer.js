import {
  LOGIN_ERROR,
  LOGIN,
  REGISTER,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  SUPPLIER_REGISTER,
  SUPPLIER_REGISTER_ERROR,
  USER_REDIRECT,
  USER_REDIRECT_ERROR,
  USER_FORGOT_PWD,
  USER_FORGOT_PWD_ERROR,
  RESET_LOGIN_STATE,
} from "./types";
import { TOKEN_PREFIX, USER_DATA } from "../../utility/commonUtility";

const initialState = {
  isAuthenticated: false,
  supplierRegistered: false,
  loading: true,
  user: null,
  redirectSuccessfull: false,
  passwordChanged: false,
  loginSuccess: false,
  err: null,
  cart: [],
};
export default function (state = initialState, actions) {
  const { type, payload } = actions;

  switch (type) {
    case LOGIN:
      localStorage.setItem(TOKEN_PREFIX, payload.data.token);
      localStorage.setItem(USER_DATA, JSON.stringify(payload.data.user));
      localStorage.setItem(
        "authentication",
        JSON.stringify({ isAuthenticated: true })
      );
      console.log(payload.data, "reducer");
      return {
        ...state,
        isAuthenticated: true,
        laoding: false,
        user: payload.data.user,
        loginSuccess: true,
        cart: payload?.data?.cart,
      };

    case LOGIN_ERROR:
      localStorage.clear();

      return {
        ...state,
        err: payload,
        loading: false,
      };

    case REGISTER:
      localStorage.setItem(TOKEN_PREFIX, payload.data.token);
      localStorage.setItem("USER_DATA", JSON.stringify(payload.data.user));
      localStorage.setItem(
        "authentication",
        JSON.stringify({ isAuthenticated: true })
      );
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload.data.user,
      };

    case SUPPLIER_REGISTER:
      return {
        ...state,
        supplierRegistered: true,
        loading: false,
      };

    case SUPPLIER_REGISTER_ERROR:
      return {
        ...state,
      };

    case LOGOUT_USER:
      localStorage.removeItem(TOKEN_PREFIX);
      localStorage.setItem(
        "authentication",
        JSON.stringify({ isAuthenticated: false })
      );
      //localStorage.setItem("USER_DATA", JSON.stringify({}));

      localStorage.removeItem("USER_DATA");

      return { ...state, isAuthenticated: false, loading: false };

    case LOGOUT_USER_ERROR:
      return { ...state };

    case USER_REDIRECT:
      return { ...state, redirectSuccessfull: true, loading: false };

    case USER_REDIRECT_ERROR:
      return { ...state, redirectSuccessfull: false, loading: false };

    case USER_FORGOT_PWD:
      showAlert(`${payload.msg}-custom`);
      return {
        ...state,
        passwordChanged: true,
        loading: false,
      };

    case USER_FORGOT_PWD_ERROR:
      return {
        ...state,
      };

    case RESET_LOGIN_STATE:
      return {
        ...state,
        loginSuccess: false,
        cart: [],
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
