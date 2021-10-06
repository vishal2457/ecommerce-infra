const express = require("express");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const {
  State,
  City,
  Country,
  Customer,
  User,
  CustomerGroup,
  Group,
} = require("../../models");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/jwtauth");
const {
  successResponse,
  alreadyExist,
  serverError,
  unauthorized,
  other,
} = require("../../helpers/response");
const { ROLE_ID } = require("../../helpers/commonHelper");

// define foreign key for the customer table

//customer registeration
router.post("/register", async (req, res) => {
  const { CustomerName, Email, Password, Number } = req.body;

  const user = await User.findOne({ where: { Email } });
  if (user) return alreadyExist(res, req, "User already exists");
  var RandomCode = Math.random().toString(36).slice(-8);

  const newCustomer = Customer.build({
    CustomerName,
    Email,
    UserCode: RandomCode,
    Number,
    Phone: Number,
  });
  await newCustomer.save().then(async (data) => {
    //console.log("customer registration........", data);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(Password, salt);
    const newUser = User.build({
      UserName: CustomerName,
      Email,
      Password: newPassword,
      RoleID: ROLE_ID.CUSTOMER,
      ReferenceID: data.ID,
      CustomerAdmin: 1,
    });

    //encrypt password

    await newUser
      .save()
      .then(async (user) => {
        const payload = {
          user: {
            id: user.ID,
            email: user.Email,
            name: user.UserName,
            role_id: user.RoleID,
            reference_id: user.ReferenceID,
            user_code: RandomCode,
          },
          customer: {
            id: data.ID,
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
            let userData = {
              id: user.ID,
              email: user.Email,
              name: user.UserName,
              role_id: user.RoleID,
              reference_id: user.ReferenceID,
            };
            successResponse(
              res,
              req,
              { token, user: userData },
              "User registered successfully"
            );
          }
        );
      })
      .catch((err) => serverError(res, req, err));
  });
});

//get all customers paginated to show in admin panel
router.post("/allCustomer", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;
  await Customer.findAndCountAll({
    offset,
    limit,
  })
    .then((data) => successResponse(res, req, data, "All customers"))
    .catch((err) => serverError(res, req, err));
});

// get Customer data with filters combine filter + getdata + pagination
// hasmukh (23/1/2021)
router.post("/getCustomer", auth, async (req, res) => {
  const { filter, page, limit, paging } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = [
    { model: State, attributes: ["State", "ID"] },
    { model: City, attributes: ["City", "ID"] },
    { model: Country, attributes: ["Country", "ID"] },
    {
      model: CustomerGroup,
      attributes: ["GroupID", "SupplierID", "CustomerID"],
      where: { SupplierID: req.user.referenceID },
      required: false,
      include: [{ model: Group, attributes: ["GroupName", "ID"] }],
    },
  ];

  let modelOption = [{ IsActive: 1, IsDelete: 0 }];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(Customer.rawAttributes).includes(key1)) {
          modelOption.push({
            [key1]: { [Op.like]: `%${filterObj[key1]}%` },
          });
        } else if (includeOption) {
          for (let key2 of includeOption) {
            if (key2.attributes.includes(key1)) {
              key2.where = {
                [key1]: { [Op.like]: `%${filterObj[key1]}%` },
              };
            }

            if (key2.model == CustomerGroup) {
              if (key1 == "Group" || filterObj[key1] == "") {
                delete key2.required;
              }

              if (key1 == "Group") {
                key2.where = {
                  SupplierID: req.user.referenceID,
                  GroupID: filterObj[key1],
                };
              }
            }
          }
        }
      } else {
        for (let key3 of includeOption) {
          key3.where && key3.where[key1] && delete key3.where;
        }
      }
    }
  }
  //console.log("paging === ", paging);

  includeOption.map((item) => console.log(item));

  paging
    ? await Customer.findAndCountAll({
        where: modelOption,
        offset,
        limit,
        include: includeOption,
        order: [["ID", "DESC"]],
      })

        .then((data) =>
          successResponse(res, req, data, `Customer Data with Pagination`)
        )
        .catch((err) => serverError(res, req, err))
    : await Customer.findAndCountAll({
        where: modelOption,
        include: includeOption,
        order: [["ID", "DESC"]],
      })

        .then((data) =>
          successResponse(res, req, data, `Customer Data without Pagination`)
        )
        .catch((err) => serverError(res, req, err));
});

//Get single customer by id
router.get("/singleCustomer/:id", auth, async (req, res) => {
  await Customer.findOne({ where: { ID: req.params.id } })
    .then((data) => successResponse(res, req, data, "Single Customer"))
    .catch((err) => serverError(res, req, err));
});

//hasmukh(27/1/2021)
// Assign Group To Selected Customers
router.post("/addCustomersToGroup", auth, async (req, res) => {
  const { selectedGroup, customerIDs } = req.body;

  await CustomerGroup.destroy({
    where: {
      CustomerID: customerIDs,
      //GroupID: selectedGroup,
      SupplierID: req.user.referenceID,
    },
  })
    .then(async (deletedData) => {
      console.log("No. of deleted Records.............", deletedData);
      var customerGroupArr = [];

      for (var i = 0; i < customerIDs.length; i++) {
        customerGroupArr.push({
          GroupID: selectedGroup,
          CustomerID: customerIDs[i],
          SupplierID: req.user.referenceID,
          createdBy: req.user.referenceID,
        });
      }

      await CustomerGroup.bulkCreate(customerGroupArr)
        .then((data) =>
          successResponse(res, req, data, "customers added to the groups")
        )
        .catch((err) => {
          console.log(err);
          serverError(res, req, err);
        });
    })
    .catch((err) => {
      console.log(err);
      serverError(res, req, err);
    });
});

/**
 * @manage_users
 */
//controllers
//add new users
const addUser = async (req, res) => {
  const { UserName, Email, Password } = req.body;
  
  //check if user exist
  const user = await User.findOne({ where: { Email, IsDelete: 0 } });
  if (user) return other(res, req, "User already exist");

  //hashing users password
  const salt = await bcrypt.genSalt(UserName.length);
  hashedPassword = await bcrypt.hash(Password, salt);

  await User.create({
    UserName,
    Password: hashedPassword,
    Email,
    RoleID: ROLE_ID.CUSTOMER,
    ReferenceID: req.user.reference_id,
  })
    .then((result) => {
      successResponse(res, req, result, "New user created");
    })
    .catch((err) => {
      serverError(res, req, err);
    });
};

//get all users
const getAllUsers = async (req, res) => {
  const { page, limit } = req.query;
  let covertedLimit = Number(limit);
  let offset = (page - 1) * limit;

  await User.findAndCountAll({
    where: { ReferenceID: req.user.reference_id, IsDelete: 0 },
    attributes: ['UserName', "Email", "CustomerAdmin", "ID"],
    raw: true,
    offset,
    limit:covertedLimit,
  }).then(result => successResponse(res,req, result, "All users"))
  .catch(err => serverError(res, req, err))
};

//update all users
const updateUser = async (req, res) => {

  let requestTypes = {
    UPDATE_DATA : "UPDATE_DATA",
    ADMIN_REQ : "ADMIN_REQ"
  }

  let {type, userid, status} = req.query;
status = Number(status)
  if(type == requestTypes.ADMIN_REQ) {
    if(status) {
      let adminUsers = await User.findAll({where:{ ReferenceID: req.user.reference_id, CustomerAdmin: 1, IsDelete: 0}, raw: true});
      console.log(adminUsers, "this is the length");
      if(adminUsers.length <= 1) {
        return other(res, req, "At least one admin required")
      }
    }
    await User.update({CustomerAdmin: status ? 0 : 1}, {where: {ID: userid}})
    .then((result) =>
    successResponse(res, req, result, "user updated successfully")
  )
  .catch((err) => serverError(res, req, err));

  }else {
    await User.update({ ...req.body }, { where: { ID: userid } })
    .then((result) =>
      successResponse(req, res, result, "user updated successfully")
    )
    .catch((err) => serverError(req, res, err));
  }
  


};

//delete user
const deleteUser = async (req, res) => {
  await User.update({ IsDelete: 1 }, { where: { ID: req.query.userid } })
    .then((result) =>
      successResponse(res, req, result, "User deleted successfully")
    )
    .catch((err) => serverError(res, req, err));
};

const checkAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) return other(res, req, "Request failed");
  next();
};

//declaring routes
router
  .route("/users")
  .all(auth, checkAdmin) //check id user is admin
  .get(getAllUsers) //get all user
  .post(addUser) //add new user
  .put(updateUser) //update user information
  .delete(deleteUser); //soft delete user

module.exports = router;
