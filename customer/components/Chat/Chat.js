import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../contexts/auth/auth.context";
import api from "../../Redux/api";
// import { SOCKET_KEYS } from "../../utility/commonUtility";
import SingleChat from "./SingleChat";

const Chat = () => {
  const { user } = useContext(AuthContext)?.authState;
  const { openChats, userList, socket } = useSelector((state) => state?.Chat);
  
  let userData = React.useMemo(() => {
    return user ? JSON.parse(user) : null;
  }, [user]);

  if (!openChats?.length) {
    return <> </>;
  }

  return (
    <>
      <div
        className={`chat-popup quotation ${userList ? "openSideBar" : ""}`}
        id="chat-popup"
      >
        {openChats.map((c, headIndex) => {
          return (
            <SingleChat 
            singlec={c} 
            userData={userData} 
            headIndex={headIndex}
            socket={socket}
            />
          );
        })}
      </div>
    </>
  );
};

export default Chat;
