const express = require("express");
const router = express.Router();
const { Role } = require("../../models")
const {successResponse, serverError} = require("../../helpers/response")
const auth = require("../../middlewares/jwtauth");
const { check, validationResult } = require("express-validator");


//get all roles 
router.get("/getAll", auth, async (req, res) => {
    await Role.findAll()
    .then(data =>{
        successResponse(res, req, data, "All roles")})
        .catch(err => serverError(res, req, err))
})

router.post("/getroles", auth, async (req, res) => {
    const { limit, page } = req.body;
  let offset = (page - 1) * limit;
  await Role.findAndCountAll({
    offset,
    limit,
  })
    .then(data => successResponse(res, req, data, "All Roles"))
    .catch(err => serverError(res, req, err))
})

//save permission
router.post("/permission", auth, async(req, res) => {
    const {roleId, permission} = req.body
    //console.log(req.body, "this is req.body");
    await Role.update({Permission: permission},{where: {ID: JSON.parse(roleId)}})
    .then(data =>{
        //console.log(data, "permission saving");
        Role.findOne({where: {ID: JSON.parse(roleId)}})
        .then(singleRole =>{
            Role.findAll()
            .then(allRoles => {
                successResponse(res, req, {singleRole, allRoles}, "single role permissions")})
            })
    })
    .catch(err => serverError(res, req, err))
});

//add new role 
router.post("/addRole", auth, 
[check("RoleName", "This field is required").not().isEmpty()],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return requiredFieldsEmpty(res, req, errors.array());
    }
    Role.create(req.body)
    .then(data => succesResponse(res, req, data, "Role addded successfully"))
    .catch(err => serverError(res, req, err))
})
 
module.exports = router;