import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleNewMessage, removeChat } from "../../Redux/Chat/action";
import { CHAT_TYPES, SOCKET_KEYS } from "../../utility/commonUtility";
import Fuse from "fuse.js"; 
import TextareaAutosize from 'react-textarea-autosize';

function SingleChat({ singlec, headIndex, userData, socket }) {
  const [message, setmessage] = useState("");
  const dispatch = useDispatch();
  const [typing, settyping] = useState("");
  const messagesEndRef = useRef(null);
  const [initialTimeout, setinitialTimeout] = useState(null);
  const [showUser, setshowUser] = useState(false);
  const [userList, setuserList] = useState([]);
  const messageRef = useRef();

  /**
   * @scroll to bottom
   */
  const scrollToBottom = () => {
    if( messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    //listen for the messages
    socket.on(SOCKET_KEYS.MESSAGE, (data) => {
      scrollToBottom();
    });

    //listen for anyone typing
    socket.on(SOCKET_KEYS.TYPING, (data) => {
      settyping(data);
    });

    //listen for stop typing
    socket.on(SOCKET_KEYS.STOP_TYPING, (data) => {
      settyping(null);
    });
    setuserList(singlec.Users);
    messageRef.current.focus();
    scrollToBottom();
  }, [singlec]);


  /**
   * this method is to find last index
   * @param {string} str
   */
  function findLastIndex(str, x) {
    // Traverse from right
    for (let i = str.length - 1; i >= 0; i--) if (str[i] == x) return i;
    return -1;
  }

  
  //send new message
  const sendMessage = () => {
    if (!message) return;
    let obj = {
      Message: message,
      SupplierID: singlec.SupplierID,
      CustomerID: userData?.reference_id,
      UserID: userData?.id,
      Type: CHAT_TYPES.CUSTOMER,
      Username: userData?.name,
      ChatRoom: singlec?.ID,
      createdAt: new Date(),
    };
    setmessage("");
    scrollToBottom();
    socket?.emit(SOCKET_KEYS.SEND_MESSAGE, obj, ({ messageData }) => {
      dispatch(handleNewMessage(messageData));
      scrollToBottom();
    });
  };

  /**
   * @handle message typing
   */
  const onTyping = (e) => {

    //event code for @
    if (e.target.value == "@" && e.keyCode == 50 && !showUser) {
      setshowUser(true);
      setuserList(singlec.Users); 
    }

    if(e.keyCode == 13) {
      e.preventDefault();
      sendMessage()
    }

    //emit typing
    socket.emit(SOCKET_KEYS.ON_TYPING, { ...singlec.MetaData, ID: singlec.ID });
    clearTimeout(initialTimeout);
    let timeout = setTimeout(() => {
      socket.emit(SOCKET_KEYS.ON_STOP_TYPING, { ID: singlec.ID });
    }, 1000);
    setinitialTimeout(timeout);
  };

  /**
   * @handle message box change event
   * @param {event} param0 javascrupt synthetic event
   */
  const handleMessageChange = async ({ target }) => {
    
    // const Fuse = (await import("fuse.js")).default;
    const options = {
      includeScore: true,
    };
    setmessage(target?.value);
    let fuse = new Fuse(singlec.Users, options);

    //format search string
    let searchString = target?.value.substring(
      findLastIndex(target?.value, "@") + 1,
      target?.value.length
    );

    //result after fuse search
    const result = fuse.search(searchString);
    let formattedResult = result.map(
      (character) => singlec.Users[character.item]
    );

    //show searched user list
    setuserList(formattedResult);


    //check if last letter is @ in chat
    if (!formattedResult?.length && target.value.slice(-1) != "@") {
      setshowUser(false);
    } else if (!formattedResult?.length) {
      //if last letter is @ and
      setshowUser(true);
      setuserList(singlec?.Users);
    }
  };

  /**
   * @param {string} name of the user clicked from suggested users
   */
  const onUserSelect = (name) => {
    setshowUser(false);
    let lastIndex = findLastIndex(message, "@");
    let m = message.substring(0, lastIndex + 1);
    let mes = `${m}${name} `;
    setmessage(mes);
    messageRef.current?.focus();
  };

  /**
   * @param {number} i index
   * @toggles chat window
   */
  const toggleChatWindow = (i) => {
    // console.log(i, "this is index");
    let ele = document.getElementById(`toggle-chat${i}`);
    let icon = document.getElementById(`toggleIcon${i}`);

    if (ele.classList.contains("d-none")) {
      ele.classList.remove("d-none");
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    } else {
      ele.classList.add("d-none");
      icon.classList.add("fa-chevron-up");
      icon.classList.remove("fa-chevron-down");
    }
  };


  return (
    <div className="chat-socket">
      <div className="card shadow mb-0">
        <div
          className="card-header d-flex justify-content-between"
          style={{ backgroundColor: "#ef4036" }}
        >
          <div>
            <div style={{ color: "#fff" }}>
              <span
                className={`status ${
                  singlec?.SupplierOnline ? "online" : "offline"
                }`}
              ></span>
              {singlec.SupplierName}
            </div>
            {/* <div className="inq_no">{singlec.no}</div> */}
          </div>
          <div>
            <button
              className="btn btn-sm btn-circle whtclr"
              onClick={() => dispatch(removeChat(singlec.ID))}
            >
              <i className="fa fa-times"></i>
            </button>
            <button
              className="btn btn-sm btn-circle ml-1 whtclr"
              onClick={() => toggleChatWindow(headIndex)}
            >
              <i
                id={`toggleIcon${headIndex}`}
                className="fa fa-chevron-down"
              ></i>
            </button>
          </div>
        </div>
        <div id={`toggle-chat${headIndex}`}>
          <div className="card-body" id="chatBody">
            {singlec?.Messages?.length
              ? singlec?.Messages.map((singleChat) => {
                  //console.log(singleChat, "this is single chat");
                  let self = userData?.reference_id == singlec.CustomerID;
                  return (
                    <>
                      <div
                        className={`text-${
                          singleChat?.Type == CHAT_TYPES.CUSTOMER
                            ? "right"
                            : "left"
                        }`}
                      >
                        <small className="text-muted">
                          {singleChat?.User_Master?.UserName ||
                            singleChat?.Username}
                        </small>
                      </div>
                      <div
                        className={`chat-text ${
                          singleChat?.Type == CHAT_TYPES.CUSTOMER ? "me" : "you"
                        }`}
                      >
                        <div>{singleChat?.Message}</div>
                        <div className="chat-time">
                          {new Date(singleChat?.createdAt).toLocaleTimeString(
                            "en-US"
                          )}
                        </div>
                      </div>
                    </>
                  );
                })
              : null}
            <div ref={messagesEndRef} />
          </div>
          <div className="card-footer">
           {/* {typing ? <p style={{position:"absolute", left: "20px", bottom: "50px"}}>{typing?.Username} is typing...</p> : null }   */}
          {showUser ? (
            <div className="suggetion_box">
              <ul>
                {userList &&
                  userList.map((user, index) => {
                    return (
                      <li
                        onClick={() => onUserSelect(user)}
                        className="pointer"
                      >
                        {user}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : null}
          <TextareaAutosize
              type="text"
              className="form-control"
              placeholder="Enter Message"
              value={message}
              onKeyUp={onTyping}
              ref={messageRef}
              maxRows={6}
              onChange={handleMessageChange}
            />
            <button
              className="btn btn-sm btn-primary  btn-sm btn-circle mx-2"
              onClick={() => sendMessage()}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleChat;
