const express = require("express");
const { successResponse, serverError } = require("../../helpers/response");
const router = express.Router();

const auth = require("../../middlewares/jwtauth");


//dashboard route for checking authentication
router.get("/checkauth", auth, (req, res) => {
    successResponses(req, res, "authentication checked", "auth")
})





module.exports = router