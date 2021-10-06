const express = require("express");
const router = express.Router();
const { Country, State, City } = require("../../models");
const { check } = require("express-validator");
const { createRoutes } = require("../../helpers/createRoutes");
let errorMessage = "This field is required";

const { successResponse, serverError } = require("../../helpers/response");

const apiArray = [
  {
    endPoint: "Country",
    model: Country,
    requiredFields: [check("Country", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "State",
    model: State,
    include: [{ model: Country, attributes: ["Country", "ID"] }],
    requiredFields: [
      check("CountryID", errorMessage).not().isEmpty(),
      check("State", errorMessage).not().isEmpty(),
    ],
    foreignKeys: ["CountryID"],
  },
  {
    endPoint: "City",
    model: City,
    include: [
      { model: State, attributes: ["State", "ID"] },
      { model: Country, attributes: ["Country", "ID"] },
    ],
    requiredFields: [
      check("CountryID", errorMessage).not().isEmpty(),
      check("StateID", errorMessage).not().isEmpty(),
      check("City", errorMessage).not().isEmpty(),
    ],
    foreignKeys: ["CountryID", "StateID"],
  },
];

createRoutes(apiArray, router);

// get all countries for supplier registration
router.get("/countries", async (req, res) => {
  await Country.findAll({ where: { IsActive: 1, IsDelete: 0 } })
    .then((data) => {
      successResponse(res, req, data, "All countries");
    })
    .catch((err) => serverError(res, req, err));
});

// get all countries for supplier registration
router.get("/states", async (req, res) => {
  await State.findAll({ where: { IsActive: 1, IsDelete: 0 } })
    .then((data) => {
      successResponse(res, req, data, "All states");
    })
    .catch((err) => serverError(res, req, err));
});

// get all cities for supplier registration
router.get("/cities", async (req, res) => {
  await City.findAll({ where: { IsActive: 1, IsDelete: 0 } })
    .then((data) => {
      successResponse(res, req, data, "All cities");
    })
    .catch((err) => serverError(res, req, err));
});

// get states of the specific country for supplier registration
router.get("/states/:id", async (req, res) => {
  await State.findAll({
    where: { CountryID: req.params.id, IsActive: 1, IsDelete: 0 },
  })
    .then((data) => {
      successResponse(res, req, data, "All States");
    })
    .catch((err) => serverError(res, req, err));
});

// get cities of the specific state for supplier registration
router.get("/cities/:state_id/:country_id", async (req, res) => {
  await City.findAll({
    where: {
      StateID: req.params.state_id,
      CountryID: req.params.country_id,
      IsActive: 1,
      IsDelete: 0,
    },
  })
    .then((data) => {
      successResponse(res, req, data, "All Cities");
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
