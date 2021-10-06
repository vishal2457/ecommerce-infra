const express = require("express");
const router = express.Router();
const { Notification } = require("../models");
const auth = require("../middlewares/jwtauth");
const { successResponse, serverError } = require("../helpers/response");
const { ROLE_ID } = require("../helpers/commonHelper");

//get notification paginated
//25 12 2020 vishal acharya
router.post("/getNotification", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;
  let RoleID = req.user.role_id; //role id of current user
  let where = { RoleID, Read: 0 };

  //add user id to where clause if not admin
  if (RoleID == ROLE_ID.SUPPLIER) {
    where.SupplierID = req.user.referenceID;
  } else if (RoleID == ROLE_ID.CUSTOMER) {
    where.CustomerID = req.user.reference_id;
  }
  await Notification.findAndCountAll({
    group: ["NotificationType"],
    where,
    order: [[`createdAt`, "DESC"]],
    limit,
    offset,
  })
    .then((notifications) => {
      successResponse(res, req, notifications, "first five notifications");
    })
    .catch((err) => serverError(res, req, err));
});

//read all notification
router.post("/readNotification", auth, async (req, res) => {
  if (req.user.role_id != 1) {
    let RoleID = req.user.role_id; //role id of current user
    let where = { NotificationType: req.body.type };

    //add user id to where clause if not admin
    if (RoleID == ROLE_ID.SUPPLIER) {
      where.SupplierID = req.user.referenceID;
    } else if (RoleID == ROLE_ID.CUSTOMER) {
      where.CustomerID = req.user.reference_id;
    }
    await Notification.update({ Read: 1 }, { where });
  } else {
    //write query for admin notification update
    await Notification.update(
      { Read: 1 },
      { where: { NotificationType: req.body.type } }
    )
      .then((notifications) => {
        successResponse(res, req, notifications, "Notification is being read");
      })
      .catch((err) => serverError(res, req, err));
  }
});


/**
 * @clearNotification for clear all notifications from header customer and supplier
 */
router.get("/clearNotification", auth, async (req, res) => {
  let RoleID = req.user.role_id; //role id of current user
  let where = { RoleID, Read: 0 };
  //add user id to where clause if not admin
  if (RoleID == ROLE_ID.SUPPLIER) {
    where.SupplierID = req.user.referenceID;
  } else if (RoleID == ROLE_ID.CUSTOMER) {
    where.CustomerID = req.user.reference_id;
  }
  await Notification.update({ Read: 1 }, { where })
    .then((notifications) => {
      successResponse(res, req, notifications, "Notification Cleared");
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
