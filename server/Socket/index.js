const { SOCKET_KEYS } = require("../helpers/commonHelper");
const { getFromRedis } = require("../Redis");
const { addUser, sendMessageToRoom, getRelatedSockets } = require("./method");
let { SEND_MESSAGE,  JOIN, TYPING, ON_TYPING, STOP_TYPING, ON_STOP_TYPING} = SOCKET_KEYS;
let CHAT_ROOMS = "CHAT_ROOMS"


module.exports = (socket, socketInstances) => {

    socket.on(JOIN, async (obj, callback) => {
      try {
        let userArray = [];
        let [users, error] = await getFromRedis(CHAT_ROOMS);
        if(users) {
          userArray = users
        }
          let [relatedUsers, allUsers] = await getRelatedSockets(obj);
          console.log(relatedUsers, "this is related users");
          for(let item of relatedUsers) {
              socketInstances[item.UserID].join(obj.ID)
            let MetaData= {
              UserEmail: item.UserEmail,
               Username: item.Username, 
               UserID: parseInt(item.UserID),
            }
            let objLocal = {...obj, MetaData, socketid: item.socketid};
            addUser(objLocal, userArray);
          }
          callback(allUsers)
      } catch (error) {
        console.log(error, "this is error");
      }
    
    });

  //   socket.on(JOIN, async (obj, callback) => {
  //     let relatedUsers = sockets.get(obj.MetaData.UserID.toString());
  //     let objLocal = {...obj, socketid: relatedUsers};
  //     console.log(objLocal, "this is object Local");
  //     addUser(objLocal);
  //     socket.join(obj.ID)
  //     // for(let item of Object.keys(relatedUsers)) {
  //     //   let socketIndex = socketInstances.findIndex(i => i.id == relatedUsers[item]);
  //     //   if(socketIndex >= 0){
  //     //     socketInstances[socketIndex].join(obj.ID)
  //     //   }
  //     //   let objLocal = {...obj, Username: item, UserID: item, socketid: relatedUsers[item]};
  //     //   addUser(objLocal);
  //     // }
  //     callback(relatedUsers)
  // });


  //SEND A NEW MESSAGE
    socket.on(SEND_MESSAGE,async (messageData, callback) => {
      sendMessageToRoom({...messageData}, socket)
      callback({messageData})
    });


    //INDICATE USER IS TYPING 
    socket.on(ON_TYPING, (item) => {
      socket.to(item.ID).emit(TYPING, item)
    })

      //INDICATE USER IS TYPING 
      socket.on(ON_STOP_TYPING, (item) => {
        socket.to(item.ID).emit(STOP_TYPING, item)
      })

}