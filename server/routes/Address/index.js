const express = require("express");
const { successResponse, serverError } = require("../../helpers/response");
const router = express.Router();
const { CustomerAddress, Country, State, City } = require("../../models");
const auth = require("../../middlewares/jwtauth");

const foriegnKeys = ["CustomerID", "CountryID", "StateID", "CityID"];

//add new address
router.post("/addNew", auth, async (req, res) => {
  await CustomerAddress.create({
    ...req.body,
    CustomerID: req.user.reference_id,
    createdBy: req.user.reference_id,
  })
    .then((data) => successResponse(res, req, data, "New address Added"))
    .catch((err) => serverError(res, req, err));
});

//update address
router.post("/updateAddress/:id", auth, async (req, res) => {
  await CustomerAddress.update(
    { ...req.body, updatedBy: req.user.reference_id },
    { where: { ID: req.body.ID } }
  )
    .then((data) =>
      successResponse(res, req, data, "Address updated successfully")
    )
    .catch((err) => serverError(res, req, err));
});

//get all user addresses
router.get("/getAll", auth, async (req, res) => {
  await CustomerAddress.findAll({
    where: { CustomerID: req.user.reference_id, IsActive: 1, IsDelete: 0 },
    include: [
      { model: Country, attributes: ["Country"] },
      { model: State, attributes: ["State"] },
      { model: City, attributes: ["City"] },
    ],
    raw: true,
  })
    .then((data) => successResponse(res, req, data, "All addresses"))
    .catch((err) => serverError(res, req, err));
});

//update address
router.post("/deleteAddress/:id", auth, async (req, res) => {
  await CustomerAddress.findAll({ where: { ID: req.params.id } }).then(
    async (singleData) => {
      let CustomerID = singleData[0].dataValues.CustomerID;
      let CountryID = singleData[0].dataValues.CountryID;
      let StateID = singleData[0].dataValues.StateID;
      let CityID = singleData[0].dataValues.CityID;
      let obj = {};
      //if foriegn keys then add them for reference
      if (foriegnKeys) {
        for (let key of foriegnKeys) {
          obj[key] = singleData[0].dataValues[key];
          singleData[0].dataValues[key] = null;
        }
      }
      obj.OldID = singleData[0].dataValues.ID;
      //store stingified data in old id
      singleData[0].dataValues.OldID = JSON.stringify(obj);
      delete singleData[0].dataValues.ID;

      //delete address....
      await CustomerAddress.destroy({ where: { ID: req.params.id } })
        .then((data) => {
          //Create a new entry of old deleted data
          CustomerAddress.create({
            ...singleData[0].dataValues,
            CustomerID,
            CountryID,
            StateID,
            CityID,
            IsActive: 0,
            IsDelete: 1,
            createdBy: req.user.reference_id,
          });

          var newData = {
            ID: req.params.id,
          };
          successResponse(res, req, newData, "Address deleted successfully");
        })
        .catch((err) => {
          // check for foreign constraint error
          if (err.original && err.original.errno == 1451) {
            res.status(422).send({ msg: "Foriegn key constraint" });
          } else {
            serverError(res, req, err);
          }
        });
    }
  );
});

module.exports = router;
