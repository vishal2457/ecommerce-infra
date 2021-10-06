import {
  CHAT_TOGGLE_LIST,
  HANDLE_NEW_MESSAGE,
  LOAD_CHAT_LIST,
  REMOVE_CHAT,
  SET_SOCKET,
  START_CHAT,
} from "./types";

const initialState = {
  userList: false,
  totalMessages: 0,
  openChats: [],
  chatList: [],
  socket: null,
};
export default function (state = initialState, actions) {
  const { type, payload } = actions;

  switch (type) {
    //toggle chat list
    case CHAT_TOGGLE_LIST:
      return { ...state, userList: !state.userList, totalMessages: 0 };

    //start a new chat
    case START_CHAT:
      let tempArr = state.openChats;
      let cl = state.chatList;
      let { ID, DBID } = payload.item;
      let chatIndex = state.openChats.findIndex((e) => e.ID == ID);
      if (state.openChats && chatIndex >= 0) {
        tempArr = state.openChats.filter((c) => {
          return c.ID != ID;
        });
      } else {
        let obj = {
          ...payload.item,
          Messages: payload.messages,
          Users: payload.users,
        };
        tempArr.unshift(obj);
        if (DBID) {
          let chatListIndex = cl.findIndex((e) => e.ID == DBID);
          cl[chatListIndex].count = 0;
        }
        if (tempArr.length > 3) tempArr.pop();
      }
      return { ...state, openChats: tempArr, chatList: cl };

    //remove a chat
    case REMOVE_CHAT:
      let temp = state.openChats;
      temp.splice(
        state.openChats.findIndex((item) => item.ID == payload.ID),
        1
      );
      return { ...state, openChats: temp };

    //get users  chat list
    case LOAD_CHAT_LIST:
      return { ...state, chatList: payload };

    case SET_SOCKET:
      console.log(payload, "this si socket payload");
      return { ...state, socket: payload };

    case HANDLE_NEW_MESSAGE:
      let openChats = state.openChats;
      let chatRoomIndex = openChats.findIndex(
        (item) => item?.ID == payload?.ChatRoom
      );
      let t = state.totalMessages;
      if (chatRoomIndex < 0) {
        t++;
      } else {
        let messageArr = openChats[chatRoomIndex]?.Messages;
        // console.log(messageArr, "this is message arr");
        messageArr.push(payload);
        openChats.Messages = messageArr;
      }
      return { ...state, openChats: openChats, totalMessages: t };

    default:
      return state;
  }
}
