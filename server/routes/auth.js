const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  User,
  sequelize,
  Sequelize,
  Role,
  Supplier,
  Customer,
  Notification,
  UserCart,
} = require("../models");
const handleBars = require("handlebars");
const auth = require("../middlewares/jwtauth");
const fs = require("fs");
const {
  unauthorized,
  successResponse,
  serverError,
  notFound,
  other,
} = require("../helpers/response");

const { ROLE_ID, nodemailerTransporter } = require("../helpers/commonHelper");

//COMMON FUNCTIONS
const date = new Date();
const currentTime = date.toLocaleTimeString("en-US");

//Login
router.post("/", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    // console.log(req.body);
    const user = await User.findOne({
      where: [
        { Email, IsActive: 1, IsDelete: 0 },
        { RoleID: { [Sequelize.Op.not]: ROLE_ID.CUSTOMER } },
      ],
    });
    if (!user) {
      return other(res, req, "Invalid credentials");
    }
    // console.log(user, "this is user");

    const isMatch = await bcrypt.compare(Password, user.Password);
    // console.log(isMatch, "is match");
    if (!isMatch) {
      return other(res, req, "Invalid credentials");
    }

    const payload = {
      user: {
        id: user.ID,
        email: user.Email,
        name: user.UserName,
        role_id: user.RoleID,
        referenceID: user.ReferenceID,
      },
    };

    var token = jwt.sign(payload, config.get("jwtSecret"), {
      expiresIn: "24h",
    });

    Role.findOne({ where: { ID: user.RoleID } }).then((role) => {
      sequelize
        .query(
          `
        select * from(SELECT ID,concat("group-",ID) as ID1,SeqNo,MenuGroup,null as PATH,NULL as Parent_id,  Icon FROM Menu_Group WHERE IsActive = 1 
          UNION 
        SELECT ID, concat("sub-",ID),SeqNo,MenuName,Link,concat("group-",MenuGroupID), '' FROM Menu_Master WHERE IsActive = 1) a order by SeqNo
        `
        )
        .then((result) => {
          let tempArr = [];

          for (let menu of result[0]) {
            var isTrueArray = [];
            if (menu.Parent_id) {
              var menuPermissions = role.Permission
                ? JSON.parse(role.Permission)[JSON.stringify(menu.ID)]
                : null;
              if (menuPermissions) {
                Object.entries(menuPermissions).map((item) => {
                  isTrueArray.push(item[1]);
                });
                //console.log(menuPermissions.view, "this is view...");

                if (isTrueArray && isTrueArray.includes(true)) {
                  menu.permissions = menuPermissions;
                  tempArr.push(menu);
                }
              }
            } else {
              tempArr.push(menu);
            }
          }

          let where = { RoleID: user.RoleID, Read: 0 };
          if (user.RoleID == ROLE_ID.SUPPLIER) {
            where.SupplierID = user.ReferenceID;
          }
          Notification.count({ where }).then((notificationCount) => {
            let data = {
              token,
              menu: tempArr,
              user: {
                id: user.ID,
                email: user.Email,
                name: user.UserName,
                role_id: user.RoleID,
                reference_id: user.ReferenceID,
                notificationCount,
              },
            };
            successResponse(res, req, data, "Login successful");
          });
        });
    });
  } catch (error) {
    return serverError(res, req, error);
  }
});


//customer login
router.post("/customer", async (req, res) => {
  try {
    const { Email, Password, cartData } = req.body;

    const user = await User.findOne({ where: [{ Email }, { RoleID: ROLE_ID.CUSTOMER }] });
    if (!user) {
      return other(res, req, "Invalid credentials");
    }
    // console.log(user, "this is user");

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return other(res, req, "Invalid credentials");
    }

    //insert random code to customer table's UserCode field
    var RandomCode = Math.random().toString(36).slice(-8);
    await Customer.update(
      { UserCode: RandomCode },
      { where: { ID: user.ReferenceID } }
    )
      .then((dt) => {
        console.log("UserCode added...");
      })
      .catch((err) => {
        console.log("error in UserCode add");
      });
    await Customer.findOne({ where: { ID: user.ReferenceID }, raw: true })
      .then(async(customer) => {
        let isAdmin = !!user.CustomerAdmin
        const payload = {
          user: {
            id: user.ID,
            email: user.Email,
            name: user.UserName,
            role_id: user.RoleID,
            reference_id: user.ReferenceID,
            user_code: RandomCode,
            isAdmin,
            CustomerName: customer.CustomerName
          },
        };

        var token = jwt.sign(payload, config.get("jwtSecret"), {
          expiresIn: "24h",
        });

        let userData = {
          id: user.ID,
          email: user.Email,
          name: user.UserName,
          role_id: user.RoleID,
          reference_id: user.ReferenceID,
          isAdmin,
          CustomerName: customer.CustomerName
        };

        // const t = await sequelize.transaction();
        await UserCart.findAll({ where: { UserID: user.ID }, raw: true })
          .then(async (cartProducts) => {
            let arr = [];
            if (cartData.items.length) {
              for await (let item of cartData.items) {
                const existingCartItemIndex = cartProducts.findIndex(
                  (singleItem) => singleItem.ProductID === item.ID
                );

                if (existingCartItemIndex > -1) {
                  arr = [...cartProducts];
                  let info = JSON.parse(arr[existingCartItemIndex].Info);
                  info.quantity = item.quantity;
                  arr[existingCartItemIndex].Info = JSON.stringify(info);
                } else {
                  let obj = {
                    UserID: user.ID,
                    ProductID: item.ID,
                    Info: JSON.stringify(item),
                  };
                  arr = [...cartProducts, obj];
                }
              }
            } else {
              arr = cartProducts;
            }

            await UserCart.destroy({ where: { UserID: user.ID } })
              .then(async (data) => {
                await UserCart.bulkCreate(arr)
                  .then((userCartCreated) => {
                    successResponse(
                      res,
                      req,
                      { token, user: userData, cart: userCartCreated },
                      "Customer Login Successfull"
                    );
                  })
                  .catch((err) => serverError(res, req, err));
              })
              .catch((err) => serverError(res, req, err));
          })
          .catch((err) => serverError(res, req, err));
      })
      .catch((err) => serverError(res, req, err));
  } catch (error) {
    console.log(error);
    t.rollback();
    return serverError(res, req, "Server error");
  }
});


//customer logout
router.post("/logoutCustomer", auth, async (req, res) => {
  try {
    // console.log(req.body.reference_id);
    await Customer.update(
      { UserCode: null },
      { where: { ID: req.user.reference_id } }
    )
      .then((data) => {
        successResponse(res, req, data, "customer logged out");
      })
      .catch((err) => serverError(res, req, err));
  } catch (err) {
    console.log(err);
  }
});

//checkpassword for customer
router.post("/checkPassword", auth, async (req, res) => {
  console.log(req);

  await User.findOne({
    where: { ReferenceID: req.user.reference_id },
    raw: true,
  }).then(async (data) => {
    const isMatch = await bcrypt.compare(req.body.password, data.Password);
    console.log(isMatch);
    if (!isMatch) {
      return other(res, req, "The password you entered was incorrect");
    }
    successResponse(res, req, "", "Password Matched");
  });
});

//Change Password for customer
router.post("/changePassword", auth, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  let pwd = await bcrypt.hash(req.body.Password, salt);
  console.log(pwd);
  await User.update({ Password: pwd }, { where: { ID: req.body.ID } })
    .then((data) => {
      req.logger.info(
        `[Auth][changePassword(post)][${currentTime}], Login successfull`
      );
      successResponse(res, req, data, "Password changed successfully");
    })
    .catch((err) => {
      req.logger.error(`[Auth][changePassword(post)][${currentTime}], ${err}`);
      console.log(err);
    });
});

//checkpassword for supplier
router.post("/supplierCheckPassword", auth, async (req, res) => {
  await User.findOne({
    where: { ReferenceID: req.user.referenceID },
    raw: true,
  }).then(async (data) => {
    const isMatch = await bcrypt.compare(req.body.password, data.Password);
    console.log(isMatch);
    if (!isMatch) {
      return other(res, req, "The password you entered was incorrect");
    }
    successResponse(res, req, "", "Password Matched");
  });
});

//Change Password for supplier
router.post("/supplierChangePassword_New", auth, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  let pwd = await bcrypt.hash(req.body.Password, salt);
  console.log(pwd);
  await User.update({ Password: pwd }, { where: { ID: req.body.ID } })
    .then((data) => {
      req.logger.info(
        `[Auth][changePassword(post)][${currentTime}], Login successfull`
      );
      successResponse(res, req, data, "Password changed successfully");
    })
    .catch((err) => {
      req.logger.error(`[Auth][changePassword(post)][${currentTime}], ${err}`);
      console.log(err);
    });
});

//Change Password for supplier
router.post("/supplierChangePassword", auth, async (req, res) => {
  const { user, Password } = req.body;
  if (user.email) {
    await Supplier.findOne({ where: { Email: user.email } })
      .then(async (data) => {
        const salt = await bcrypt.genSalt(10);
        let pwd = await bcrypt.hash(Password, salt);
        await User.update(
          { ReferenceID: data.ID, Password: pwd },
          { where: { ID: user.id } }
        )
          .then((data1) => {
            if (data1[0]) {
              successResponse(
                res,
                req,
                { passwordChanged: true, referenceID: data.ID },
                "Password changed successfully"
              );
            }
          })
          .catch((err) => {
            req.logger.error(
              `[Auth][changePassword(post)][${currentTime}], ${err}`
            );
            console.log(err);
          });
      })
      .catch((err) => {
        req.logger.error(
          `[Auth][changePassword(post)][${currentTime}], ${err}`
        );
        console.log(err);
      });
  }
});

//forgot password

router.post("/forgotPassword", async (req, res) => {
  const { Email } = req.body;
  await User.findOne({ where: { Email } }).then(async (user) => {
    //console.log(user);
    if (!user) {
      return notFound(res, req, "User not found with that email");
    }
    var newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    let pwd = await bcrypt.hash(newPassword, salt);
    console.log(pwd, "this is password");

    fs.readFile(
      "template/forgotPassword.html",
      { encoding: "utf8" },
      function (err, html) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          var template = handleBars.compile(html);
          var replacements = {
            email: Email,
            password: newPassword,
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: process.env.SENDER_EMAIL_ID,
            to: Email,
            subject: "New password",
            html: htmlToSend,
          };
          nodemailerTransporter.sendMail(
            mailOptions,
            async function (err, response) {
              if (err) {
                console.log(err);
              } else {
                await User.update(
                  { Password: pwd },
                  { where: { Email: Email } }
                ).then((data) => {
                  successResponse(res, req, "", `Mail sent to ${Email}`);
                  console.log(response);
                });
              }
            }
          );
        }
      }
    );
  });
});

router.post("/forgotPassword_bk", async (req, res) => {
  const { Email } = req.body;
  await User.findOne({ where: { Email } }).then(async (user) => {
    //console.log(user);
    if (!user) {
      return notFound(res, req, "User not found with that email");
    }
    var newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    let pwd = await bcrypt.hash(newPassword, salt);
    // console.log(pwd, "this is password");

    fs.readFile(
      "template/forgotPassword.html",
      { encoding: "utf8" },
      function (err, html) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          var template = handleBars.compile(html);
          var replacements = {
            password: newPassword,
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: process.env.SENDER_EMAIL_ID,
            to: Email,
            subject: "New password",
            html: htmlToSend,
          };
          smtpTransport.sendMail(mailOptions, async function (err, response) {
            if (err) {
              console.log(err);
            } else {
              await User.update(
                { Password: pwd },
                { where: { Email: Email } }
              ).then((data) => {
                successResponse(res, req, "", `Mail sent to ${Email}`);
                console.log(response);
              });
            }
          });
        }
      }
    );
  });
});

//store a fresh token while redirecting
router.get("/userRedirecting", auth, async (req, res) => {
  //console.log("called...userRedirecting...............", req.header("Authorization"), req.user.id);

  await User.update(
    { token: req.header("Authorization") },
    { where: { ID: req.user.id } }
  )
    .then((user) =>
      successResponse(res, req, user, "Token updated succesfully")
    )
    .catch((err) => serverError(res, req, err));
});

//get latest token from db
router.get("/redirectedUser/:id", async (req, res) => {
  await User.findByPk(req.params.id)
    .then((user) => {
      Role.findOne({ where: { ID: user.RoleID } }).then((role) => {
        sequelize
          .query(
            `
        select * from(SELECT ID,concat("group-",ID) as ID1,SeqNo,MenuGroup,null as PATH,NULL as Parent_id,  Icon FROM Menu_Group WHERE IsActive = 1 
          UNION 
        SELECT ID, concat("sub-",ID),SeqNo,MenuName,Link,concat("group-",MenuGroupID), '' FROM Menu_Master WHERE IsActive = 1) a order by SeqNo
        `
          )
          .then((result) => {
            // console.log(result[0], "this is result");
            let tempArr = [];
            // console.log(role.Permission, role);
            // for (let menu of result[0]) {
            //   // console.log(JSON.parse(role.Permission)[JSON.stringify(menu.ID)]);
            //   if (menu.Parent_id) {
            //     if (JSON.parse(role.Permission)[JSON.stringify(menu.ID)]) {
            //       tempArr.push(menu);
            //     }
            //   } else {
            //     tempArr.push(menu);
            //   }
            // }

            for (let menu of result[0]) {
              var isTrueArray = [];
              if (menu.Parent_id) {
                var menuPermissions = JSON.parse(role.Permission)[
                  JSON.stringify(menu.ID)
                ];
                if (menuPermissions) {
                  Object.entries(menuPermissions).map((item) => {
                    isTrueArray.push(item[1]);
                  });

                  if (isTrueArray && isTrueArray.includes(true)) {
                    menu.permissions = menuPermissions;
                    tempArr.push(menu);
                  }
                }
              } else {
                tempArr.push(menu);
              }
            }

            let data = {
              token: user.token,
              menu: tempArr,
              user: {
                id: user.ID,
                email: user.Email,
                name: user.UserName,
                role_id: user.RoleID,
                reference_id: user.ReferenceID,
              },
            };
            successResponse(res, req, data, "Redirect successful");
            User.update({ token: null }, { where: { ID: req.params.id } });
          });
      });
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
