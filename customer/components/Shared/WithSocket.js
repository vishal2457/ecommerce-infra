import React from "react";
import { io } from "socket.io-client";
import { APIURL, getToken, getUser } from "../../utility/commonUtility";

const WithSocket = (WrappedComponent) => (props) => {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    var socket = io(APIURL, {
      reconnectionDelayMax: 10000,
      transports: ["websocket"],
      query: {
        auth: getToken(),
        user: JSON.stringify(getUser())
      },
    });
  }

  return (
    <WrappedComponent
      {...props}
      socket={socket}
    />
  );
};

export default WithSocket;
