const express = require("express");
const router = express.Router();
const {
  ProductGroup,
  ProductSubgroup,
  MeasurementUnit,
  PaperClass,
  PaperQuality,
  PaperPrintibility,
  PaperGrain,
  PaperGsm,
  RunningDirection,
  PaperStrength,
  PaperRies,
  PaperColor,
} = require("../../models");
const { check } = require("express-validator");
const {createRoutes } = require("../../helpers/createRoutes");
let errorMessage = "This field is required";

const propertiesArray = [
  {
    endPoint: "PaperClass",
    model: PaperClass,
    requiredFields: [check("PaperClass", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperPrintibility",
    model: PaperPrintibility,
    requiredFields: [check("PaperPrintibility", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "ProductGroup",
    model: ProductGroup,
    requiredFields: [check("ProductGroup", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "MeasurementUnit",
    model: MeasurementUnit,
    requiredFields: [check("MeasurementUnit", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "ProductSubgroup",
    model: ProductSubgroup,
    include: [{ model: ProductGroup, attributes: ["ProductGroup", "Code", "ID"] }],
    requiredFields: [
      check("ProductSubgroup", errorMessage).not().isEmpty(),
      check("GroupID", errorMessage).not().isEmpty(),
    ],
  },
  {
    endPoint: "PaperGrain",
    model: PaperGrain,
    requiredFields: [check("PaperGrain", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperGsm",
    model: PaperGsm,
    requiredFields: [check("PaperGsm", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperStrength",
    model: PaperStrength,
    requiredFields: [check("PaperStrength", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperColor",
    model: PaperColor,
    requiredFields: [check("PaperColor", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperRies",
    model: PaperRies,
    requiredFields: [check("PaperRies", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "RunningDirection",
    model: RunningDirection,
    requiredFields: [check("RunningDirection", errorMessage).not().isEmpty()],
  },
  {
    endPoint: "PaperQuality",
    model: PaperQuality,
    requiredFields: [check("PaperQuality", errorMessage).not().isEmpty()],
  },
];

createRoutes(propertiesArray, router); 
module.exports = router;
