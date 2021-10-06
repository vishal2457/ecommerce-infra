import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../contexts/auth/auth.context";
import { getChatList, handleNewMessage, startChat } from "../../Redux/Chat/action";
import { SOCKET_KEYS } from "../../utility/commonUtility";
import Fuse from "fuse.js"; 

const ChatList = ({ toggleUserList }) => {
  const [chatListLocal, setchatListLocal] = useState([])
  const { isAuthenticated, user } = useContext(AuthContext).authState;
  //check user authentication
  if (!isAuthenticated) {
    return <> </>;
  }

  const {userList, totalMessages, socket, chatList} = useSelector((state) => state?.Chat);
  const dispatch = useDispatch();

  let userData = React.useMemo(() => {
    return user ? JSON.parse(user) : null;
  }, [user]);

  useEffect(() => {
    if (userList && userData) {
      dispatch(getChatList(userData?.reference_id));
    }
    return () => {};
  }, [userList]);

  useEffect(() => {
    setchatListLocal(chatList)
    return () => {
      
    }
  }, [chatList])

  useEffect(() => {
    socket?.on(SOCKET_KEYS.MESSAGE, (data) => {
      dispatch(handleNewMessage(data));
    });
    return () => {};
  }, [socket]);


  const onUserSearch = ({target}) => {
    if(!target?.value) return setchatListLocal(chatList)
    const options = {
      includeScore: true,
      keys: ['Supplier.SupplierName']
    };
    let fuse = new Fuse(chatList, options);
    const result = fuse.search(target?.value);
    let formattedResult = result.map(
      (character) => character.item
    );
    
    setchatListLocal(formattedResult)
  }


  /**
   * @param {object} item details
   * @param {number} i add chat
   */
  const addChat = (chat) => {
    let { RoomID, SupplierID, CustomerID, Supplier, ID, SupplierOnline } = chat;
    let obj = {
      ID: RoomID,
      DBID: ID,
      SupplierID,
      SupplierName: Supplier?.SupplierName,
      CustomerName: userData?.CustomerName,
      CustomerID,
      SupplierOnline,
      MetaData: {
        UserID: userData?.id,
        Username: userData?.name,
        UserEmail: userData?.email,
      }
    };
    dispatch(startChat(obj, socket));
  };

  return (
    <>
      <div
        className="chatuserlist"
        style={userList ? { right: "0px" } : { right: "-250px" }}
      >
        <div className="userlistbox">
          <div className="chat-user-btn" onClick={toggleUserList}>
          {totalMessages ? <span className="chat-message">{totalMessages}</span> : null}
          <i className="fa fa-comment" />
          </div>
          <div className="card shadow mb-0">
            <div className="chatList-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={onUserSearch}
              />
              {/* <button className="btn btn-sm btn-primary  btn-sm btn-circle mx-2">
                
                <i className="fa fa-search"></i>
              </button> */}
            </div>
            <div className="card-body">
              <ul className="user">
                {chatListLocal.map((chat, index) => {
                  return (
                    <li
                      key={index}
                      className="pointer "
                      onClick={() => addChat(chat)}
                    >
                      <div className="usericon text-uppercase">{chat?.Customer?.CustomerName.charAt(0)}</div>
                      <div className="d-flex justify-content-between">
                      {chat?.Supplier?.SupplierName}
                      <span className={`user-${chat?.SupplierOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="chat-date">
                        {new Date(chat?.createdAt).toLocaleString()}
                      </div>
                      {chat?.count ? <div className="chat-count">
                        {chat?.count}
                        
                      </div> : null }
                      
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
