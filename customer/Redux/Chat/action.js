import { SOCKET_KEYS } from "../../utility/commonUtility";
import api from "../api";
import {
  CHAT_TOGGLE_LIST,
  HANDLE_NEW_MESSAGE,
  LOAD_CHAT_LIST,
  LOAD_CHAT_LIST_ERROR,
  REMOVE_CHAT,
  START_CHAT,
} from "./types";

/**
 * @toggles user list
 */
export const toggleUserList = () => (dispatch) => {
  dispatch({ type: CHAT_TOGGLE_LIST });
};

/**
 * @start a chat
 */
export const startChat = (item, socketEmit) => (dispatch) => {
  socketEmit.emit(SOCKET_KEYS.JOIN, item, (response) => {
    api
      .get(`/chat/getChatMessages/${item?.ID}?limit=50&page=1`)
      .then((res) => {
        dispatch({
          type: START_CHAT,
          payload: { item, messages: res?.data?.data, users: response },
        });
      })
      .catch((err) => {
        console.log(err, "thisj is errior");
      });
  });
};

/**
 * @start a chat
 */
export const removeChat = (id) => (dispatch) => {
  dispatch({ type: REMOVE_CHAT, payload: { ID: id } });
};

export const getChatList = (id) => (dispatch) => {
  api
    .get(`/chat/getCustomerChats/${id}`)
    .then((res) => {
      dispatch({ type: LOAD_CHAT_LIST, payload: res?.data?.data });
    })
    .catch((err) => {
      dispatch({ type: LOAD_CHAT_LIST_ERROR, payload: err });
    });
};

export const handleNewMessage = (message) => (dispatch) => {
  dispatch({ type: HANDLE_NEW_MESSAGE, payload: message });
};
