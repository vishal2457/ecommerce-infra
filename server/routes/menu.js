const express = require("express");
const router = express.Router();
const {MenuGroup, MenuMaster} = require("../models");
const { successResponse, serverError } = require("../helpers/response");
const auth = require("../middlewares/jwtauth")

//get all menu master
router.get("/byGroup/:id", async (req, res) => {
    await MenuMaster.findAll({where: {MenuGroupID: req.params.id}})
    .then(data =>{
       // console.log(data, "this is menu");
        successResponse(res, req, data, "All menu")
    } )
    .catch((err) => serverError(res, req, err))
})


//get all menu group
router.get("/allGroup", auth, async(req, res) => {
    await MenuGroup.findAll()
    .then((menuGroups) => successResponse(res, req, menuGroups, "All menu"))
    .catch((err) => serverError(res, req, err))
})
module.exports = router;
