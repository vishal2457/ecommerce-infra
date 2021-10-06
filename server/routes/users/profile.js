const express = require("express");
const router = express.Router();
const { State, City, Country, Customer, Supplier } = require("../../models");
const auth = require("../../middlewares/jwtauth");
const { successResponse, serverError } = require("../../helpers/response");

//get the customer or supplier details for profile
router.post("/getUserProfile", auth, async (req, res) => {
  const { role_id, reference_id } = req.user;
  console.log("request dot body...", req.user);

  if (role_id == 3) {
    // console.log("User Profile");
    await Customer.findOne({
      where: { ID: reference_id },
      include: [
        { model: State, attributes: ["State", "ID"] },
        { model: City, attributes: ["City", "ID"] },
        { model: Country, attributes: ["Country", "ID"] },
      ],
    })
      .then((data) => {
        successResponse(res, req, data, "Customer Profile");
      })
      .catch((err) => serverError(res, req, err));
  } else if (role_id == 2) {
    // console.log("Supplier Profile");
    await Supplier.findOne({
      where: { ID: req.user.referenceID },
      include: [
        { model: State, attributes: ["State", "ID"] },
        { model: City, attributes: ["City", "ID"] },
        { model: Country, attributes: ["Country", "ID"] },
      ],
    })
      .then((data) => {
        //console.log("Supplier Profile", data);
        successResponse(res, req, data, "Supplier Profile");
      })
      .catch((err) => serverError(res, req, err));
  } else {
    console.log("role_id not found");
  }
});

//get the customer or supplier details for profile
router.post("/editUserProfile", auth, async (req, res) => {
  const { updatedData, loginData } = req.body;
  const { profileValue, addressValue, otherValue } = updatedData;

  //console.log("updatedData == ", updatedData);
  const { reference_id, role_id } = loginData;

  if (role_id == 3) {
    if (reference_id) {
      await Customer.update(
        { ...profileValue, ...addressValue, ...otherValue },
        { where: { ID: reference_id } }
      )
        .then((data) => {
          successResponse(res, req, data, "Customer Profile Updated");
        })
        .catch((err) => serverError(res, req, err));
    } else {
      console.log("id not Found");
    }
  } else if (role_id == 2) {
    if (reference_id) {
      await Supplier.update(
        { ...profileValue, ...addressValue, ...otherValue },
        { where: { ID: reference_id } }
      )
        .then((data) => {
          successResponse(res, req, data, "Supplier Profile Updated");
        })
        .catch((err) => serverError(res, req, err));
    } else {
      console.log("Id not Found");
    }
  }
});

//update customer address (used in cart step two component)
//vishal
router.post("/editCustomerProfile", auth, async (req, res) => {
  const { reference_id } = req.user;
  console.log(req.body);
  await Customer.update({ ...req.body }, { where: { ID: reference_id } })
    .then((data) => successResponse(res, req, data, "Customer Profile Updated"))
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
