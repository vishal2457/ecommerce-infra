const express = require("express");
const {
  serverError,
  other,
  successResponse,
} = require("../../helpers/response");
const router = express.Router();
const {
  Chat,
  ChatMessages,
  Supplier,
  Customer,
  User,
  sequelize,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const { SOCKET_KEYS, CHAT_TYPES } = require("../../helpers/commonHelper");
const { users, getAllOnlineUsers } = require("../../Socket/method");

//add new message
router.post("/new", auth, async (req, res) => {
  //chatroom id should be customerid+supplierid
  const { CustomerID, SupplierID } = req.body;
  let RoomID = `${CustomerID}-${SupplierID}`;
  try {
    let chatRoom = await Chat.findOne({
      where: { RoomID },
      raw: true,
    });
    if (!chatRoom) {
      let newChatRoom = await Chat.create({ CustomerID, SupplierID, RoomID });
      let dbID = newChatRoom.get({ plain: true }).ID;
      await ChatMessages.create({ ChatID: dbID, ...req.body });
      for (let user of users) {
        if (user.ID == RoomID) {
          req.io.to(user.socketid).emit(SOCKET_KEYS.MESSAGE, { ...req.body });
        }
      }
      successResponse(res, req, null, "new chat room added");
    } else {
      await ChatMessages.create({ ChatID: chatRoom.ID, ...req.body });
      console.log(users, "this are user");
      for (let user of users) {
        if (user.ID == RoomID) {
          console.log(user.socketid);
          req.io.to(user.socketid).emit(SOCKET_KEYS.MESSAGE, { ...req.body });
        }
      }
      successResponse(res, req, null, "message added");
    }
  } catch (error) {
    serverError(res, req, error);
  }
});

/**
 * @get single customer chats
 */
router.get("/getCustomerChats/:id", auth, async (req, res) => {
  // get user chats
  try {
    const { id } = req.params;
    if (!id) return other(res, req, "something went wrong!");
    let chatRoom = await Chat.findAll({
      where: { CustomerID: id },
      attributes: [
        "ID",
        "CustomerID",
        "SupplierID",
        "RoomID",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT Count(`Chat_Messages`.`ID`) FROM `Chat_Messages` WHERE `Chat_Messages`.`ChatID` = `Chat`.`ID` AND `Chat_Messages`.`Read` = 0 AND `Chat_Messages`.`Type` = 'Supplier')"
          ),
          "count",
        ],
      ],
      include: [
        {
          model: Supplier,
          attributes: [
            "SupplierName",
            "ID",
            [
              sequelize.literal(
                "(SELECT `User_Master`.`ID` FROM `User_Master` WHERE `User_Master`.`ReferenceID` = `Chat`.`SupplierID` AND `User_Master`.`RoleID` = 2)"
              ),
              "users",
            ],
          ],
        },
        {
          model: Customer,
          attributes: [
            "CustomerName",
            "ID",
            [
              sequelize.literal(
                "(SELECT GROUP_CONCAT(`User_Master`.`ID`) FROM `User_Master` WHERE `User_Master`.`ReferenceID` = `Chat`.`CustomerID` AND `User_Master`.`RoleID` = 3)"
              ),
              "users",
            ],
          ],
        }, 
      ],
      raw: true,
      nest: true,
      logging: false,
    });
    let onlineUsers = req.sockets;
   // console.log(onlineUsers, "this is online users");
    let finalResponse = chatRoom.map((item) => {
      let supplierSocket = onlineUsers.get(item.Supplier.users.toString());
      // console.log(supplierSocket, "this is supsokcet");
      if (supplierSocket) {
        item.SupplierOnline = true;
      } else {
        item.SupplierOnline = false;
      }
      let customerSocket = [];
      if (item.Customer.users) {
        for (let cus of item.Customer.users.split(",")) {
          let cusSocket = onlineUsers.get(cus);
          if (cusSocket) {
            customerSocket.push(cusSocket);
          }
        }
      }
      item.CustomerOnline = customerSocket;
      return item;
    });
    successResponse(res, req, finalResponse, "Customers chat room");
  } catch (error) {
    serverError(res, req, error);
  }
});

/**
 * @get customer chat messages
 */
router.get("/getChatMessages/:id", auth, async (req, res) => {
  const { limit, page } = req.query;
  let offset = (page - 1) * limit;
 
  // console.log(page, limit, req.params.id, "check meeeee");
  ChatMessages.findAll({
    where: { ChatRoom: req.params.id },
    include: { model: User, attributes: ["UserName"] },
    // limit: parseInt(limit),
    // offset,
    raw: true,
    nest: true
  })
    .then((messages) => {  
      successResponse(res, req, messages, "Chat Messages");
      if(req.user.reference_id) {
        ChatMessages.update({Read: 1}, {where: {ChatRoom: req.params.id, Type: CHAT_TYPES.SUPPLIER}})
      }else if(req.user.referenceID) {
        ChatMessages.update({Read: 1}, {where: {ChatRoom: req.params.id, Type: CHAT_TYPES.CUSTOMER}})
      }
    })
    .catch((err) => serverError(res, req, err));
});

/**
 * @get supplier chat messages
 */
router.get("/getSupplierMessages/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return other(res, req, "something went wrong!");
    let chatRoom = await Chat.findAll({
      where: { SupplierID: id },
      attributes: [
        "ID",
        "CustomerID",
        "SupplierID",
        "RoomID",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT Count(`Chat_Messages`.`ID`) FROM `Chat_Messages` WHERE `Chat_Messages`.`ChatID` = `Chat`.`ID` AND `Chat_Messages`.`Read` = 0 AND `Chat_Messages`.`Type` = 'Customer')"
          ),
          "count",
        ],
      ],
      include: [
        { model: Supplier },
        {
          model: Customer,
          attributes: [
            "CustomerName",
            "ID",
            [
              sequelize.literal(
                "(SELECT GROUP_CONCAT(`User_Master`.`ID`) FROM `User_Master` WHERE `User_Master`.`ReferenceID` = `Chat`.`CustomerID` AND `User_Master`.`RoleID` = 3)"
              ),
              "users",
            ],
          ],
        },
      ],
      raw:true,
      nest: true
    });

    let onlineUsers = req.sockets;
    let finalResponse = chatRoom.map((item) => {
      let customerSocket = [];
      if (item.Customer.users) {
        for (let cus of item.Customer.users.split(",")) {
          let cusSocket = onlineUsers.get(cus);
          if (cusSocket) {
            customerSocket.push(cusSocket);
          }
        }
      }
      item.CustomerOnline = customerSocket;
      return item;
    });
    successResponse(res, req, finalResponse, "Customers chat room");
  } catch (error) {
    serverError(res, req, error);
  }
});

module.exports = router;
