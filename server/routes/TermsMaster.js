var express = require("express");
var router = express.Router();
const { Sequelize, Terms } = require("../models");
const { successResponse, serverError } = require("../helpers/response");
const auth = require("../middlewares/jwtauth");
const { check } = require("express-validator");
const { customValidationFun } = require("../helpers/commonHelper");
const Op = Sequelize.Op;
const errorMessage = "This field is required";

const foriegnKeys = ["SupplierID"];

/**
 * required fields validation
 */
const requiredFields = [
  check("Code", errorMessage).not().isEmpty(),
  check("Description", errorMessage).not().isEmpty(),
  check("Type", errorMessage).not().isEmpty(),
];

/**
 * @GEL_ALL_TERMS_WITH_FILTERS
 */
router.post("/getTerms", auth, async (req, res) => {
  const { filter, page, limit } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = null;
  let modelOption = [
    {
      IsDelete: 0,
      SupplierID: req.user.referenceID,
    },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(Terms.rawAttributes).includes(key1)) {
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

  await Terms.findAndCountAll({
    where: modelOption,
    offset,
    limit,
    // include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, `All Terms`))
    .catch((err) => serverError(res, req, err));
});

/**
 * @CREATE_TERMS
 */
router.post(
  "/createTerms",
  auth,
  customValidationFun(requiredFields),
  async (req, res, next) => {
    const { Code, Description, Type, IsActive } = req.body;
    let terms = await Terms.build({
      Code,
      Description,
      Type,
      IsActive,
      SupplierID: req.user.referenceID,
      createdBy: req.user.referenceID,
    });
    terms
      .save()
      .then((result) => {
        successResponse(res, req, result, "Terms created successfully");
      })
      .catch((err) => {
        serverError(res, req, err);
      });
  }
);

/**
 * @udpate_terms
 */
router.post(
  "/updateTerms/:id",
  auth,
  customValidationFun(requiredFields),
  async (req, res) => {
    await Terms.update(
      { ...req.body, updatedBy: req.user.referenceID },
      { where: { ID: req.params.id } }
    )
      .then((result) => {
        successResponse(res, req, result, "terms updated");
      })
      .catch((err) => {
        serverError(res, req, err);
      });
  }
);

/**
 * @delete_term
 */
router.delete("/deleteTerms/:id", auth, async (req, res) => {
  await Terms.findAll({ where: { ID: req.params.id } }).then(
    async (singleData) => {
      let SupplierID = singleData[0].dataValues.SupplierID;

      let obj = {};
      //if foriegn keys then add them for reference
      if (foriegnKeys) {
        for (let key of foriegnKeys) {
          obj[key] = singleData[0].dataValues[key];
          singleData[0].dataValues[key] = null;
        }
      }
      obj.OldID = singleData[0].dataValues.ID;
      //store stingified data in old id
      singleData[0].dataValues.OldID = JSON.stringify(obj);
      delete singleData[0].dataValues.ID;

      await Terms.destroy({ where: { ID: req.params.id } })
        .then(async (data) => {
          //Create a new entry of old deleted data
          Terms.create({
            ...singleData[0].dataValues,
            SupplierID,
            IsActive: 0,
            IsDelete: 1,
            createdBy: req.user.referenceID,
          });

          var newData = {
            ID: req.params.id,
          };

          successResponse(res, req, newData, "Deleted successfully");
        })
        .catch((err) => {
          // check for foreign constraint error
          if (err.original && err.original.errno == 1451) {
            res.status(422).send({ msg: "Foriegn key constraint" });
          } else {
            serverError(res, req, err);
          }
        });
    }
  );
});

/**
 * @GEL_ALL_TERMS
 */
router.get("/getAllTerms", auth, async (req, res) => {
  await Terms.findAll({
    where: { IsActive: 1, IsDelete: 0, SupplierID: req.user.referenceID },
    order: [["ID", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, `All Terms`))
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
