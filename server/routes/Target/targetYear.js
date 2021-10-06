const express = require("express");
const router = express.Router();
const {TargetYear} = require("../../models")
const { check } = require("express-validator");
const {createRoutes } = require("../../helpers/createRoutes");
let errorMessage = "This field is required";

const targetArr = [
    {
        endPoint: "ty",
        model: TargetYear,
        requiredFields: [check("targetYear", errorMessage).not().isEmpty()],
      },
]

createRoutes(targetArr, router); 
module.exports = router;
