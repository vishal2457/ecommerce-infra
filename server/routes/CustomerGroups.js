const express = require("express");
const router = express.Router();
const {
  Sequelize,
  sequelize,
  Group,
  Supplier,
  CustomerGroup,
} = require("../models");
const Op = Sequelize.Op;

const { check } = require("express-validator");
const { createRoutes } = require("../helpers/createRoutes");
const {
  successResponse,
  serverError,
  requiredFieldsEmpty,
} = require("../helpers/response");
const auth = require("../middlewares/jwtauth");
const { validationResult } = require("express-validator");
const { fixedIdList, customValidationFun } = require("../helpers/commonHelper");
let errorMessage = "This field is required";

// define foreign key for the group table
const include = [{ model: Supplier, attributes: ["SupplierName", "ID"] }];

const customerGroup = [
  {
    endPoint: "cg",
    model: Group,
    requiredFields: [check("GroupName", errorMessage).not().isEmpty()],
  },
];

createRoutes(customerGroup, router);

//hasmukh(25/1/2021)
// add Group
router.post(
  "/addGroup",
  auth,
  customValidationFun([
    check("GroupName", "This field is required").not().isEmpty(),
  ]),
  async (req, res) => {
    console.log(req.body, "THIS IS BODY");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return requiredFieldsEmpty(res, req, errors.array());
    }
    await Group.create({
      ...req.body,
      createdBy: req.user.referenceID,
      SupplierID: req.user.referenceID,
    })
      .then((data) => successResponse(res, req, data, `Group added`))
      .catch((err) => {
        console.log(err);
        serverError(res, req, err);
      });
  }
);

// get all Groups for grid data belongs to particular supplier
router.post("/getGroups", auth, async (req, res) => {
  const { filter, page, limit } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = include;
  let modelOption = [
    {
      IsDelete: 0,
      SupplierID: req.user.referenceID,
      ID: {
        [Op.notIn]: [
          fixedIdList.groupStandardId,
          fixedIdList.groupConsortiumId,
        ],
      },
    },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(Group.rawAttributes).includes(key1)) {
          modelOption.push({
            [key1]: { [Op.like]: `%${filterObj[key1]}%` },
          });
        } else if (includeOption) {
          for (let key2 of includeOption) {
            if (key2.attributes.includes(key1)) {
              key2.where = {
                [key1]: {
                  [Op.like]: `%${filterObj[key1]}%`,
                },
              };
            }
          }
        }
      } else if (includeOption) {
        for (let key3 of includeOption) {
          key3.where && key3.where[key1] && delete key3.where;
        }
      }
    }
  }

  //console.log("modelOption === ", modelOption);

  await Group.findAndCountAll({
    where: modelOption,
    offset,
    limit,
    include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) =>
      successResponse(res, req, data, `All ${req.route.path} data`)
    )
    .catch((err) => serverError(res, req, err));
});

// get all Groups for grid data belongs to particular supplier for admin to view
router.post("/getGroupsAdmin", auth, async (req, res) => {
  const { filter, page, limit, supplierId } = req.body;

  //console.log("req.body./.........", req.body);
  if (supplierId) {
    let offset = (page - 1) * limit;
    let filterObj = filter ? JSON.parse(filter) : null;
    let includeOption = include;
    let modelOption = [{ IsDelete: 0, SupplierID: supplierId }];

    if (filterObj) {
      for (let key1 of Object.keys(filterObj)) {
        if (filterObj[key1]) {
          if (Object.keys(Group.rawAttributes).includes(key1)) {
            modelOption.push({
              [key1]: { [Op.like]: `%${filterObj[key1]}%` },
            });
          } else if (includeOption) {
            for (let key2 of includeOption) {
              if (key2.attributes.includes(key1)) {
                key2.where = {
                  [key1]: {
                    [Op.like]: `%${filterObj[key1]}%`,
                  },
                };
              }
            }
          }
        } else if (includeOption) {
          for (let key3 of includeOption) {
            key3.where && key3.where[key1] && delete key3.where;
          }
        }
      }
    }

    //console.log("includeOption === ", includeOption);

    await Group.findAndCountAll({
      where: modelOption,
      offset,
      limit,
      include: includeOption,
      order: [["ID", "DESC"]],
    })
      .then((data) =>
        successResponse(res, req, data, `All ${req.route.path} data`)
      )
      .catch((err) => serverError(res, req, err));
  }
});

// get all Group for supplier groupings
router.get("/getAllGroups_bk", auth, async (req, res) => {
  await Group.findAll({
    where: [{ IsActive: 1, IsDelete: 0, SupplierID: req.user.referenceID }],
  })
    .then((data) => {
      //data.unshift({ ID: 1, GroupName: "Standard" });
      successResponse(res, req, data, "All groups");
    })
    .catch((err) => serverError(res, req, err));
});

// get all Group for supplier groupings
router.get("/getAllGroups", auth, async (req, res) => {
  sequelize
    .query(
      "SELECT * FROM `Group` WHERE SupplierID = " +
        req.user.referenceID +
        " AND IsActive = 1 AND IsDelete = 0 OR ID = " +
        fixedIdList.groupStandardId +
        " OR ID = " +
        fixedIdList.groupConsortiumId,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    .then((data) => {
      //data.unshift({ ID: 1, GroupName: "Standard" });
      successResponse(res, req, data, "All groups");
    })
    .catch((err) => serverError(res, req, err));
});

// get all Group for supplier groupings
router.get("/getAllGroupsForCustomer", auth, async (req, res) => {
  //console.log(req.user);
  await CustomerGroup.findAll({
    where: { CustomerID: req.user.reference_id },
  })
    .then((data) => {
      successResponse(res, req, data, "All customer groups");
    })
    .catch((err) => serverError(res, req, err));
});

//get all customer groups for supplier inquiries
router.get("/getAllGroupsForSupplier/:id", auth, async(req, res) => {
  await CustomerGroup.findAll({
    where: { CustomerID: req.params.id },
  })
    .then((data) => {
      successResponse(res, req, data, "All customer groups");
    })
    .catch((err) => serverError(res, req, err));
})

module.exports = router;
