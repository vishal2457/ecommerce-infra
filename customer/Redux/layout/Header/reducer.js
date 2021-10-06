import { getUser } from "../../../utility/commonUtility";
import {
  GET_NOTIFICATION,
  SET_NOTIFICATION,
  GENERIC_ERROR,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATION,
} from "./types";

let user;
const initialState = {
  loading: true,
  notifications: [],
  count: 0,
  err: "",
};

export default function (state = initialState, actions) {
  // console.log("getUser() === ", getUser());

  const { type, payload } = actions;

  switch (type) {
    case SET_NOTIFICATION:
      user = getUser();
      user.notificationCount = payload;
      return { ...state, count: payload };

    case GET_NOTIFICATION:
      user = getUser();
      user.notificationCount = payload.data.count.length;
      localStorage.setItem("USER_DATA", JSON.stringify(user));
      return {
        ...state,
        notifications: payload.data.count,
        loading: false,
        count: user.notificationCount,
      };

    case REMOVE_NOTIFICATION:
      user = getUser();
      user.notificationCount = state.count - 1;
      localStorage.setItem("USER_DATA", JSON.stringify(user));
      return {
        ...state,
        notifications: [],
        loading: false,
        count: user.notificationCount,
      };

      case CLEAR_NOTIFICATION:
        return {
          ...state,
          notifications: [],
        }

    case GENERIC_ERROR:
      return { ...state, err: payload, loading: false };
    default:
      return state;
  }
}
