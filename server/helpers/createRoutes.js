const {
  successResponse,
  serverError,
  requiredFieldsEmpty,
  alreadyExist,
} = require("./response");
const { validationResult, check } = require("express-validator");
const auth = require("../middlewares/jwtauth");
const Sequelize = require("sequelize");
const { checkUnique } = require("./commonHelper");
const Op = Sequelize.Op;
/**
 * ! Logic Component make changes cautiously
 */
//common methods
//ADD
const addData = async (req, res, model) => {
  // console.log(req.body, "THIS IS BODY");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return requiredFieldsEmpty(res, req, errors.array());
  }

  let result = await checkUnique(req, res, model);  // check value already exist or not

  console.log(result);
  if(result) return alreadyExist(res, req, "Already Exist");
  else {  //if result return false
    await model
      .create({ ...req.body, createdBy: req.user.referenceID })
      .then((data) => {
        successResponse(res, req, data, `Data added`);
      })
      .catch((err) => {
        console.log(err);
        serverError(res, req, err);
      });
  }
 
  // await model
  //   .create({ ...req.body, createdBy: req.user.referenceID })
  //   .then((data) => {
  //     successResponse(res, req, data, `Data added`);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     serverError(res, req, err);
  //   });
};

//update data
const updateData = async (req, res, model) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return requiredFieldsEmpty(res, req, errors.array());
  }
  await model
    .update(
      { ...req.body, updatedBy: req.user.referenceID },
      { where: { ID: req.params.id } }
    )
    .then((data) => successResponse(res, req, data, ` Updated`))
    .catch((err) => serverError(res, req, err));
};

// get all data with filters combine filter + getdata + pagination
// hasmukh (6/1/2021)
const getData = async (req, res, model, include) => {
  const { filter, page, limit } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = include;
  let modelOption = [{ IsDelete: 0 }];

  // if (filterObj) {
  //   for (let key1 of Object.keys(filterObj)) {
  //     if (key1 !== "") {
  //       if (Object.keys(model.rawAttributes).includes(key1)) {
  //         modelOption.push({
  //           [key1]: { [Op.like]: `%${filterObj[key1]}%` },
  //         });
  //       } else if (includeOption) {
  //         for (let key2 of includeOption) {
  //           if (key2.attributes.includes(key1)) {
  //             key2.where = {
  //               [key1]: { [Op.like]: `%${filterObj[key1]}%` },
  //             };
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(model.rawAttributes).includes(key1)) {
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

  await model
    .findAndCountAll({
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
};

//get all data
// set order by dynamic by hasmukh (24/12/2020)
const getAllData = async (req, res, model) => {
  var name = req.params.name;
  try {
    req.redis.get(model.name, async (err, value) => {
      // console.log(err, "error", value, "value");
      if (err) {
        await model
          .findAll({
            where: { IsActive: 1, IsDelete: 0 },
            order: [[`${name}`, "ASC"]],
          })
          .then((data) => {
            req.redis.set(model.name, JSON.stringify(data), (err, value) => {
              console.log("values successfully stored in redis");
            });
            console.log("values served from db");
            successResponse(res, req, data, `All data`);
          })
          .catch((err) => serverError(res, req, err));
      }
      if (value) {
        console.log("Values returned from redis");
        return successResponse(res, req, JSON.parse(value), `All data`);
      } else {
        await model
          .findAll({
            where: { IsActive: 1, IsDelete: 0 },
            order: [[`${name}`, "ASC"]],
          })
          .then((data) => {
            req.redis.set(model.name, JSON.stringify(data), (err, value) => {
              console.log("values successfully stored in redis");
            });
            console.log("values served from db");
            successResponse(res, req, data, `All data`);
          })
          .catch((err) => serverError(res, req, err));
      }
    });
  } catch (error) {
    await model
      .findAll({
        where: { IsActive: 1, IsDelete: 0 },
        order: [[`${name}`, "ASC"]],
      })
      .then((data) => {
        console.log("values served from db");
        successResponse(res, req, data, `All data`);
      })
      .catch((err) => serverError(res, req, err));
  }
};

//delete data
const deleteData = async (req, res, model, foriegnKeys) => {
  await model
    .findAll({ where: { ID: req.params.id } })
    .then(async (singleData) => {
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
      //Destroy data
      await model
        .destroy({ where: { ID: req.params.id } })
        .then((data) => {
          //Create a new entry od deleted data
          model.create({ ...singleData[0].dataValues, IsDelete: 1 });
          successResponse(res, req, data, "Deleted successfully");
        })
        .catch((err) => {
          //check for foreign constraint error
          if (err.original && err.original.errno == 1451) {
            res.status(422).send({ msg: "Foriegn key constraint" });
          } else {
            serverError(res, req, err);
          }
        });
    });
};

/**
 *
 * @param  arr //properties array that has models info and endpoints
 * @param  router //router object by express
 */

//CREATING ROUTES
const createRoutes = async (arr, router) => {
  return arr.map((singleRoute) => {
    router
      //add new data
      .post(
        `/add${singleRoute.endPoint}`,
        singleRoute.requiredFields,
        auth,
        async (req, res) => {
          await addData(req, res, singleRoute.model);
        }
      )
      //update data
      .post(
        `/update${singleRoute.endPoint}/:id`,
        singleRoute.requiredFields,
        auth,
        async (req, res) => {
          await updateData(req, res, singleRoute.model);
        }
      )
      //get paginated data
      .post(`/get${singleRoute.endPoint}`, auth, async (req, res) => {
        await getData(
          req,
          res,
          singleRoute.model,
          singleRoute.include ? singleRoute.include : null
        );
      })
      //delete data
      .delete(`/delete${singleRoute.endPoint}/:id`, auth, async (req, res) => {
        await deleteData(
          req,
          res,
          singleRoute.model,
          singleRoute.foreignKeys ? singleRoute.foreignKeys : null
        );
      })
      //get all data
      //change by hasmukh(24/12/2020)-> add name parameter for order by
      .get(`/getAll${singleRoute.endPoint}/:name`, async (req, res) => {
        await getAllData(req, res, singleRoute.model);
      });
  });
};

module.exports = { createRoutes };
