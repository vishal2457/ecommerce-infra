const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const fs = require("fs");
const handleBars = require("handlebars");

const Op = sequelize.Op;
const {
  User,
  Supplier,
  State,
  City,
  Country,
  Notification,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const {
  successResponse,
  serverError,
  alreadyExist,
} = require("../../helpers/response");
const {
  sendEmail,
  nodemailerTransporter,
  notificationTypes,
  ClientUrl,
  NOTIFICATION_KEY,
  ROLE_ID,
} = require("../../helpers/commonHelper");

// define foreign key for the supplier table
const include = [
  { model: State, attributes: ["State", "ID"] },
  { model: City, attributes: ["City", "ID"] },
  { model: Country, attributes: ["Country", "ID"] },
];

/**
 *
 * TODO: Supplier registeration flow and approval
 */

//seller registeration
//updated 24-12-2020, vishal acharya
router.post("/register", async (req, res) => {
  //console.log("OK...", req.body);
  let user;
  const supplier = await Supplier.findOne({ where: { Email: req.body.Email } });
  if (!supplier) {
    user = await User.findOne({ where: { Email: req.body.Email } });
  }

  if (supplier || user) return alreadyExist(res, req, "Email already exists");

  await Supplier.create(req.body)
    .then(async (supplier) => {
      if (supplier) {
        //get all admins
        await User.findAll({
          where: { RoleID: ROLE_ID.ADMIN, IsActive: 1, IsDelete: 0 },
        }).then(async (admins) => {
          if (admins) {
            //notifications for admin
            await Notification.create({
              UserID: null,
              RoleID: 1,
              NotificationType: notificationTypes.SupplierRegistration,
              Description: `${req.body.SupplierName} from ${req.body.City}, ${req.body.State}, ${req.body.Country}`,
              Title: "New Supplier Registered",
              Reference: JSON.stringify({
                for: "Admin",
              }),
            }).then(async (notification) => {
              fs.readFile(
                "template/supplierRegistered.html",
                { encoding: "utf8" },
                function (err, html) {
                  if (err) {
                    console.log(err);
                    throw err;
                  } else {
                    var template = handleBars.compile(html);
                    var replacements = {
                      supplierName: req.body.SupplierName,
                      supplierID: supplier.ID,
                      supplierEmail: req.body.Email,
                      ClientUrl: ClientUrl,
                    };

                    var htmlToSend = template(replacements);

                    // multiple admins
                    for (let singleAdmin of admins) {
                      var mailOptions = {
                        from: process.env.SENDER_EMAIL_ID,
                        to: singleAdmin.dataValues.Email,
                        subject: "Supplier Registration",
                        html: htmlToSend,
                      };

                      nodemailerTransporter.sendMail(
                        mailOptions,
                        async function (err, response) {
                          if (err) {
                            console.log(
                              "supplier registerded Mail ERROR--- ",
                              err
                            );
                          } else {
                            console.log("Mail Response = ", response);
                          }
                        }
                      );
                    }
                  }
                }
              );
            });
            Notification.findAndCountAll({
              where: { RoleID: 1, Read: 0 },
              group: ["NotificationType"],
              limit: 1,
            }).then((notification) => {
              req.io.emit(NOTIFICATION_KEY, {
                notificationCount: notification.count.length,
                msg: `${req.body.SupplierName} from ${req.body.City}, ${req.body.State}, ${req.body.Country}`,
                title: "New Supplier registered",
              });
              successResponse(
                res,
                req,
                supplier,
                "Supplier registered successfully"
              );
            });
          }
        });
      }
    })
    .catch((err) => serverError(res, req, err));
});

// get supplier data with filters combine filter + getdata + pagination
// hasmukh (6/1/2021)
router.post("/getSupplier", async (req, res) => {
  const { filter, page, limit } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = include;
  let modelOption = [{ IsDelete: 0 }];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(Supplier.rawAttributes).includes(key1)) {
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
          }
        }
      } else {
        for (let key3 of includeOption) {
          key3.where && key3.where[key1] && delete key3.where;
        }
      }
    }
  }
  //console.log("includeOption === ", includeOption);

  await Supplier.findAndCountAll({
    where: modelOption,
    offset,
    limit,
    include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, `Supplier Data`))
    .catch((err) => serverError(res, req, err));
});

//get non-approved supplier list
router.get("/nonApproved", auth, async (req, res) => {
  await Supplier.findAndCountAll({
    where: { IsApproved: 0, IsActive: 1, IsDelete: 0 },
    attributes: [
      "ID",
      "SupplierName",
      "Industry",
      "ContactPersonName",
      "Email",
      [
        sequelize.fn(
          "date_format",
          sequelize.col("Supplier.createdAt"),
          "%d-%m-%Y %h:%m"
        ),
        "createdAt",
      ],
    ],
    order: [["ID", "DESC"]],
    include,
  })
    .then((data) => successResponse(res, req, data, "All suppliers"))
    .catch((err) => serverError(res, req, err));
});

// ! supplier approval helper function
const supplierApproval = async (req, res, supp_id) => {
  //console.log("supplier Approval called....");

  var id = null;
  if (supp_id) {
    id = supp_id;
  } else {
    id = req.params.id;
  }
  //console.log("ID = ", id);
  await Supplier.update(
    { IsApproved: 1 },
    {
      where: { ID: id },
      returning: true,
      plain: true,
    }
  )
    .then(() => {
      return Supplier.findByPk(id);
    })
    .then(async (supplierData) => {
      if (supplierData) {
        var generatedPassword = Math.random().toString(36).slice(-8);

        if (generatedPassword) {
          const salt = await bcrypt.genSalt(10);
          let pwd = await bcrypt.hash(generatedPassword, salt);

          const userData = {
            UserName: supplierData.SupplierName,
            ReferenceID: supplierData.ID,
            Email: supplierData.Email,
            Password: pwd,
            RoleID: 2,
            OldID: 0,
          };

          // console.log("userData = ", userData);

          // ! checking supplier user soft deleted or not

          await User.findOne({ where: { Email: userData.Email } })
            .then(async (supp_data) => {
              if (supp_data) {
                await User.update(
                  { IsActive: 1, IsDelete: 0 },
                  {
                    where: { Email: userData.Email },
                  }
                )
                  .then((up_sup_data) => {
                    console.log("Update Supplier...");
                  })
                  .catch((err) => console.log(err));
              } else {
                await User.create(userData)
                  .then(async (uData) => {
                    fs.readFile(
                      "template/supplierApproval.html",
                      { encoding: "utf8" },
                      function (err, html) {
                        if (err) {
                          console.log(err);
                          throw err;
                        } else {
                          var template = handleBars.compile(html);
                          var replacements = {
                            supplierName: supplierData.SupplierName,
                            password: generatedPassword,
                            email: supplierData.Email,
                            ClientUrl: ClientUrl,
                          };
                          var htmlToSend = template(replacements);
                          var mailOptions = {
                            from: process.env.SENDER_EMAIL_ID,
                            to: supplierData.Email,
                            subject: "Approval",
                            html: htmlToSend,
                          };
                          nodemailerTransporter.sendMail(
                            mailOptions,
                            async function (err, response) {
                              if (err) {
                                console.log("supplier approval ERROR--- ", err);
                              } else {
                                console.log("Mail Response = ", response);
                              }
                            }
                          );
                        }
                      }
                    );

                    return true;
                  })
                  .catch((err) => serverError(res, req, err));
              }
            })
            .catch((err) => console.log(err));
        }
      }
    })
    .catch((err) => serverError(res, req, err));
};

// ! supplier decline helper function
const supplierDecline = async (id) => {
  let sup_email = null;
  console.log("decline ID ==== ", id);

  await Supplier.findOne({ where: { ID: id } })
    .then((sup_data) => {
      sup_email = sup_data.Email;
    })
    .catch((err) => {
      console.log(err);
    });

  if (sup_email) {
    await Supplier.update({ IsApproved: 0 }, { where: { ID: id } })
      .then(async (data) => {
        await User.update(
          { IsActive: 0, IsDelete: 1 },
          { where: { Email: sup_email, RoleID: 2 } }
        )
          .then(() => {
            console.log("Supplier user soft deleted...");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("email not found");
    return false;
  }
};

//admin gives Approval to Supplier using helper function
router.get("/approval/:id", auth, async (req, res) => {
  await supplierApproval(req, res);
  console.log("Approved...");
  successResponse(res, req, [], "Supplier Approved");
});

// add supplier by admin
// hasmukh(31/12/2020)
router.post("/addSupplier", auth, async (req, res) => {
  //console.log("body =========== ", req.body);

  const { supplierData, addressData, otherData } = req.body;

  let user;
  const supplier = await Supplier.findOne({
    where: { Email: supplierData.Email },
  });
  if (!supplier) {
    user = await User.findOne({ where: { Email: supplierData.Email } });
  }

  if (supplier || user) return alreadyExist(res, req, "Email already exists");

  await Supplier.create({
    ...supplierData,
    ...addressData,
    ...otherData,
    ByAdmin: 1,
    Number: "S-1111",
    OldID: 0,
  })
    .then(async (supp_data) => {
      //console.log("supp============= ", supp_data);

      //! checking approved or not
      if (otherData.IsApproved) {
        console.log("Need to call helper function ### supplierApproval ####");
        await supplierApproval(req, res, supp_data.ID);
      }
      console.log("No need to call helper function ### supplierApproval #### ");
      await getSingleSupplier(supp_data.ID)
        .then((sigleSupplier) => {
          successResponse(
            res,
            req,
            sigleSupplier,
            "Supplier added successfully"
          );
        })
        .catch((err) => {
          serverError(res, req, err);
        });
    })
    .catch((err) => serverError(res, req, err));
});

// edit supplier by admin
// change by hasmukh(1/1/2020)

router.post("/editSupplier/:id", auth, async (req, res) => {
  //console.log("body =========== ", req.body);

  const { supplierData, addressData, otherData } = req.body;

  // var id = req.body.ID;
  var id = req.params.id;
  var is_approve_new = otherData.IsApproved;

  await Supplier.findOne({ where: { ID: id } })
    .then(async (supp_data) => {
      //console.log("supp============= ", supp_data);
      var is_approve_old = supp_data.IsApproved;

      //! checking admin changes or not for apporve or dis-apporve
      if (is_approve_new == is_approve_old) {
        console.log(
          "No need to call helper function ### supplierApproval #### "
        );
        // await Supplier.update({ ...req.body }, { where: { ID: id } })
        //   .then(async (update_data) => {
        //     successResponse(res, req, update_data, "Supplier Updated");
        //   })
        //   .catch((err) => serverError(res, req, err));
      } else {
        console.log(
          "Need to call helper function ### supplierApproval OR supplierDecline #### "
        );
        //! checking admin apporve or dis-apporve
        if (is_approve_new) {
          await supplierApproval(req, res, id);
          console.log("Approved...");
        } else {
          await supplierDecline(id);
          console.log("Decline...");
        }
      }
      await Supplier.update(
        { ...supplierData, ...addressData, ...otherData },
        { where: { ID: id } }
      )
        .then(async (update_data) => {
          await getSingleSupplier(id)
            .then((sigleSupplier) => {
              successResponse(
                res,
                req,
                sigleSupplier,
                "Supplier updated successfully"
              );
            })
            .catch((err) => {
              serverError(res, req, err);
            });
        })
        .catch((err) => serverError(res, req, err));
    })
    .catch((err) => serverError(res, req, err));
});

// delete supplier
router.get("/delete/:id", auth, async (req, res) => {
  await Supplier.update(
    { IsActive: 0, IsDelete: 1 },
    {
      where: { ID: req.params.id },
    }
  )
    .then(async (data) => {
      await supplierDecline(req.params.id);
      var newData = {
        ID: req.params.id,
      };
      successResponse(res, req, newData, "Supplier Deleted");

      // if (data) {
      //   const mailData = {
      //     sender: "youremail@gmail.com",
      //     receiver: "myfriend@yahoo.com",
      //     subject: "Sending Email using Node.js",
      //     text: "Deleted",
      //   };

      //   sendEmail(mailData);
      //   successResponse(res, req, data, "Supplier Deleted");
      // }
    })
    .catch((err) => serverError(res, req, err));
});

//get supplier by id
router.get("/singleSupplier/:id", auth, async (req, res) => {
  await Supplier.findByPk(req.params.id)
    .then((data) => {
      if (data) {
        successResponse(res, req, data.dataValues, "single supplier");
      } else {
        successResponse(res, req, null, "No data found");
      }
    })
    .catch((err) => serverError(res, req, err));
});

// get single supplier by id
// 1-1-2021
// hasmukh
const getSingleSupplier = (id) => {
  console.log(id, "get single Supplier");

  return Supplier.findOne({
    where: { ID: id },
    include,
  });
};

module.exports = router;
