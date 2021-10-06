const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const { User, Role } = require("../models");
const auth = require("../middlewares/jwtauth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const date = new Date();
const currentTime = date.toLocaleTimeString("en-US");

const {
  successResponse,
  alredyExists,
  serverError,
} = require("../helpers/response");

//Register new user
router.post("/register", async (req, res) => {
  const { user_name, email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    return alredyExists(res, "User exists, Please login");
  }
  const newUser = User.build({
    user_name,
    email,
    password,
  });

  //encrypt password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();

  const payload = {
    newUser: {
      id: newUser.user_id,
    },
  };

  jwt.sign(
    payload,
    config.get("jwtSecret"),
    {
      expiresIn: "24h",
    },
    (err, token) => {
      if (err) throw err;
      successResponse(token, "User registered successfully");
    }
  );
});

//create another user
router.post(
  "/createUser",
  [check("user_name", "Please enter employee name").not().isEmpty()],
  [check("email", "Please enter Mobile number").not().isEmpty()],
  [check("password", "Please select a state").not().isEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var activity = "Add user"
    const { user_name, email, password } = req.body;
    const checkExisting = await User.findOne({ where: { email } });
    if (checkExisting){
auditLog(req.user,activity, "User already exists")
      return alredyExists(res, "User already exists");
    } 
    
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    let pwd = await bcrypt.hash(password, salt);

    await User.create({
      user_name,
      email,
      password: pwd,
    })
      .then((data) => {
      auditLog(req.user,activity, `User created successfully`)
        
        successResponse(res, data, `User created successfully`)})
      .catch((err) => {
        auditLog(req.user,activity,err)
        serverError(err);
      });
  }
);

//get all users paginated
router.post("/", auth,  async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;

  await User.findAndCountAll(
    { attributes: ["user_id", "user_name", "email", "is_deleted"] },
    {
      where: { is_deleted: 0 },
      offset,
      limit,
    }
  )
    .then((data) => successResponse(res, data, `All users`))
    .catch((err) => {
      console.log(err);
      serverError(err);
    });
});

//get user by id
router.get("/singleUser/:id", auth, async (req, res) => {
  await User.findOne({
    where: { user_id: req.params.id },
    attributes: ["email", "user_name"],
  })
    .then((data) => successResponse(res, data, "Single user"))
    .catch((err) => {
      console.log(err);
      serverError(res, "Server error");
    });
});

//soft delete a user
router.delete("/delete/:id", auth, async (req, res) => {
  var activity= "Add user"
  await User.destroy({ where: { user_id: req.params.id } })
    .then((data) =>{
      auditLog(req.user,activity,"User deleted successfully")
      successResponse(res, "", "User deleted successfully")
    })
    .catch((err) => {
      auditLog(req.user,activity,err)
      serverError(res, err);
    });
});

//update user
router.post("/update/:id", auth, async (req, res) => {
  var activity = "Update User"
  await User.update(req.body, { where: { user_id: req.params.id } })
    .then(async (data) => {
      await User.findOne({ where: { user_id: req.params.id } }).then((user) => {
      auditLog(req.user,activity,"User updated successfully")
        successResponse(res, user, "User updated successfully");
      });
    })
    .catch((err) => {
      auditLog(req.user,activity,err)
      serverError(res, err);
    });
});

router.get("/logout", auth, async (req, res) => {
  var activity = "logout"
  await User.update({is_loggedin: 0}, {where: {user_id: req.user.id }}).then(data => {
   // console.log(data, 'this si data');
    req.logger.info(
      `[Auth][logout(post)][${currentTime}], logout successfull`
    );
    auditLog(req.user,activity,"Logged out successfully")
    successResponse(res, data, "Logged out successfully")
  }).catch(err => {
    req.logger.error(`[Auth][logout(post)][${currentTime}], ${err}`);
    auditLog(req.user,activity,err)
    serverError(res, "Server error")
  })
})

//get all roles
router.get("/allRole", async(req, res) => {
  await Role.findAll({where: {isActive: 1}})
  .then((roles) => successResponse(res, roles, "All roles"))
  .catch(err => serverError(res, err))
})

module.exports = router;
