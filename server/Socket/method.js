const { SOCKET_KEYS, ROLE_ID } = require("../helpers/commonHelper");
const {Chat, ChatMessages, User} = require("../models");
const { getFromRedis, setInRedis } = require("../Redis");
let CHAT_ROOMS = "CHAT_ROOMS"
//users that are in rooms
// let users = [];

const addUser =  (obj, users) => {
  (async() => {
   let [data, error] = await getFromRedis(CHAT_ROOMS);
   if(!data) {
     users = data
   }
  })();

  let findUser = users.findIndex((item) => item.MetaData.UserID == obj.MetaData.UserID);
  if (findUser < 0) {
    users.push(obj);
   }else {
     users[findUser] = obj
   }
setInRedis(CHAT_ROOMS, users)
   
    // console.log(users, "this are users");
};

const getUser = async(id) => {
 let [users, error] =  await getFromRedis(CHAT_ROOMS)
  return  users.find((user) => user.socketid == id)
};

const getUsersInRoom = async (room) => {
  let [users, error] =  await getFromRedis(CHAT_ROOMS)
 return users.filter((user) => user.room === room);
}


/**
 * @send message 
 */
const sendMessageToRoom = async (obj, socket) => {
  const { CustomerID, SupplierID} = obj;
  let RoomID = obj.ChatRoom
  try {
    let chatRoom = await Chat.findOne({
      where: {RoomID},
      raw: true,
    });
    if (!chatRoom) {
      let newChatRoom = await Chat.create({ CustomerID, SupplierID, RoomID });
      let dbID = newChatRoom.get({ plain: true }).ID;
      await ChatMessages.create({ ChatID: dbID, ...obj });
      socket.to(RoomID).emit(SOCKET_KEYS.MESSAGE,obj)
    } else {
      await ChatMessages.create({ ChatID: chatRoom.ID, ...obj });
      socket.to(RoomID).emit(SOCKET_KEYS.MESSAGE, obj)
    }
  } catch (error) {
    console.log(error, "this is error");
  }
}



const getRelatedSockets = async (obj) => {
  console.log(obj);
  let customers = await User.findAll({where: {ReferenceID: obj.CustomerID, RoleID: ROLE_ID.CUSTOMER}, attributes: ["ID", "Email", "UserName", "RoleID"], raw: true});
  let supplier = await User.findOne({where: {ReferenceID: obj.SupplierID, RoleID: ROLE_ID.SUPPLIER}, attributes: ["ID", "Email", "UserName", "RoleID"], raw: true});
  let userSockets = [];
  let users = [];
  for(let singleCustomer of customers) {
       let [s, error] = await getFromRedis(singleCustomer.ID.toString());
    // let s = sockets.get(singleCustomer.ID.toString())
    if(s) {
      let obj = {
        UserID: singleCustomer.ID,
        UserEmail: singleCustomer.Email,
        Username: singleCustomer.UserName,
        socketid: s
      }
      userSockets.push(obj)
    }
    users.push(singleCustomer.UserName)
  }

  let [supplierSocket, error] = await getFromRedis(supplier.ID.toString());

  // let supplierSocket = sockets.get(supplier.ID.toString());
  if(supplierSocket) {
    let obj = {
      UserID: supplier.ID,
      UserEmail: supplier.Email,
      Username: supplier.UserName,
      socketid: supplierSocket
    }
    userSockets.push(obj)
  }
  users.push(supplier.UserName)
  return [userSockets, users]
}


  module.exports = { addUser, getUser, getUsersInRoom, sendMessageToRoom, getRelatedSockets}