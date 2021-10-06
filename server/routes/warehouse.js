const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Supplier,
  SupplierWarehouse,
  Country,
  State,
  City,
  WarehouseProducts,
  ProductImages,
  ProductGroup,
  ProductSubgroup,
  MeasurementUnit,
  PaperClass,
  PaperQuality,
  PaperPrintibility,
  PaperGrain,
  PaperGsm,
  RunningDirection,
  PaperStrength,
  PaperRies,
  PaperColor,
  RegularPrice,
  RegularPriceRange,
  Group,
  ProductMaster,
  sequelize,
} = require("../models");
const auth = require("../middlewares/jwtauth");
const { successResponse, serverError, other } = require("../helpers/response");
const { customValidationFun, UOM_TYPES } = require("../helpers/commonHelper");
const { check } = require("express-validator");
const errorMessage = "This field is required";
const file = require("../middlewares/multer");
const XLSX = require("xlsx");
const path = require("path");

/**
 * required fields validation
 */
const requiredFields = [
  check("WarehouseNumber", errorMessage).not().isEmpty(),
  check("WarehouseName", errorMessage).not().isEmpty(),
  check("Phone", errorMessage).not().isEmpty(),
  check("Email", errorMessage).not().isEmpty(),
  check("CountryID", errorMessage).not().isEmpty(),
  check("StateID", errorMessage).not().isEmpty(),
  check("CityID", errorMessage).not().isEmpty(),
];

let actionTypes = {
  add: "Add",
  minus: "Minus",
};

// define foreign key for the supplier table
const include = [
  { model: Supplier, attributes: ["SupplierName", "ID"] },
  { model: State, attributes: ["State", "ID"] },
  { model: City, attributes: ["City", "ID"] },
  { model: Country, attributes: ["Country", "ID"] },
];

const foriegnKeys = ["SupplierID", "CountryID", "StateID", "CityID"];

/**
 *
 * @param {number} quantity user input quantity
 * @param {string} action add | minus
 * @param {object} data previous data
 * @returns promise udpate sotck quantity and product stock
 */
const updateWarehouseStock = async (data, body) => {
  const { ProductID, value, warehouseID, action, SupplierID } = body;
  let quantity = parseFloat(value);
  let obj = {
    ProductID,
    WarehouseID: warehouseID,
    SupplierID,
  };
  let StockQuantity;
  let previousStockQuantity = data ? data.StockQuantity : 0;
  let previuosProductStock = data ? data.Product_Master.StockQuantity : 0;
  if (action == actionTypes.add) {
    obj.AddQuantity = quantity;
    obj.StockQuantity = previousStockQuantity
      ? quantity + previousStockQuantity
      : quantity;
    StockQuantity = previuosProductStock
      ? previuosProductStock + quantity
      : quantity;
  } else {
    obj.MinusQuantity = quantity;
    obj.StockQuantity = previousStockQuantity - quantity;
    StockQuantity = previuosProductStock - quantity;
  }
  if (obj.StockQuantity < 0 || StockQuantity < 0) return false;

  let singleProduct = await ProductMaster.findOne({
    where: { ID: ProductID },
    attributes: ["StockQuantity"],
  });
  let calcQty;
  if (action == actionTypes.add) {
    calcQty = singleProduct.StockQuantity + quantity;
  } else {
    calcQty = singleProduct.StockQuantity - quantity;
  }

  if (calcQty < 0) return false;

  await ProductMaster.update(
    { StockQuantity: calcQty },
    { where: { ID: ProductID } }
  );

  //udpare stock in warehouse
  return WarehouseProducts.create(obj);
};

//create routes
//vishal acharya
//4 1 2021
//each warehouse will belong to a supplier
router.post(
  "/addWarehouse",
  auth,
  customValidationFun(requiredFields),
  async (req, res) => {
    //console.log("warehouse called......", req.body);
    //const { warehouseForm, warehouseAddress, warehouseMap } = req.body;
    await SupplierWarehouse.create({
      // ...warehouseForm,
      // ...warehouseAddress,
      // ...warehouseMap,
      ...req.body,
      SupplierID: req.user.referenceID,
      createdBy: req.user.referenceID,
    })
      .then((data) =>
        successResponse(res, req, data, "Warehouse added successfully")
      )
      .catch((err) => {
        console.log();
        serverError(res, req, err);
      });
  }
);

// update warehouse
// hasmukh (21/1/2021)
router.post("/editWarehouse/:id", auth, async (req, res) => {
  const { warehouseForm, warehouseAddress, warehouseMap } = req.body;
  var id = req.params.id;
  console.log("updatedData == ", req.user.referenceID);

  await SupplierWarehouse.update(
    {
      ...warehouseForm,
      ...warehouseAddress,
      ...warehouseMap,
      updatedBy: req.user.referenceID,
    },
    { where: { ID: id } }
  )
    .then((data) => {
      successResponse(res, req, data, "Supplier Warehouse Updated");
    })
    .catch((err) => serverError(res, req, err));
});

// get warehouse data with filters combine filter + getdata + pagination
// hasmukh (13/1/2021)
router.post("/getWarehouses", auth, async (req, res) => {
  const { filter, page, limit, supplierId } = req.body;
  //* supplier passed through admin side supplier module **/
  //* when admin logged in then req.user.referenceID would be 0 ...so it will take supplierId(req.body) **/
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = include;
  let modelOption = [
    {
      IsDelete: 0,
      SupplierID: req.user.referenceID ? req.user.referenceID : supplierId,
    },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(SupplierWarehouse.rawAttributes).includes(key1)) {
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

  await SupplierWarehouse.findAndCountAll({
    where: modelOption,
    offset,
    limit,
    include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) =>
      successResponse(res, req, data, `Supplier's Warehouse Data`)
    )
    .catch((err) => serverError(res, req, err));
});

// delete warehouse
// hasmukh (13/1/2021)
router.post("/deleteWarehouse/:id", auth, async (req, res) => {
  //console.log("foriegnKeys............", foriegnKeys);
  await SupplierWarehouse.findAll({ where: { ID: req.params.id } }).then(
    async (singleData) => {
      let SupplierID = singleData[0].dataValues.SupplierID;
      let CountryID = singleData[0].dataValues.CountryID;
      let StateID = singleData[0].dataValues.StateID;
      let CityID = singleData[0].dataValues.CityID;
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

      //Destroy product data

      //delete warehouse products....
      await WarehouseProducts.destroy({ where: { WarehouseID: req.params.id } })
        .then(async (deletedData) => {
          console.log("warehouse products deleted....", deletedData);
        })
        .catch((err) => {
          // check for foreign constraint error
          if (err.original && err.original.errno == 1451) {
            res.status(422).send({ msg: "Foriegn key constraint" });
          } else {
            serverError(res, req, err);
          }
        });

      await SupplierWarehouse.destroy({ where: { ID: req.params.id } })
        .then(async (data) => {
          //Create a new entry of old deleted data
          SupplierWarehouse.create({
            ...singleData[0].dataValues,
            SupplierID,
            CountryID,
            StateID,
            CityID,
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

//get warehouse for dropdown
router.get("/getAll", auth, async (req, res) => {
  await SupplierWarehouse.findAll({
    where: { SupplierID: req.user.referenceID, IsActive: 1 },
  })
    .then((data) => successResponse(res, req, data, "All supplier warehouse"))
    .catch((err) => serverError(res, req, err));
});

//get All warehouse Products
//hasmukh(25/03/2021)

router.post("/getAllWarehouseProducts", auth, async (req, res) => {
  const { filters, page, limit, WarehouseID, supplierId } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filters ? filters : null;
  let includeOption = [
    {
      model: ProductSubgroup,
      attributes: ["ProductSubgroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: ProductGroup,
      attributes: ["ProductGroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperClass,
      attributes: ["PaperClass", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperColor,
      attributes: ["PaperColor", "ID"],
      where: { IsActive: 1 },
    },
    { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    { model: PaperRies, attributes: ["PaperRies", "ID"] },
    { model: PaperStrength, attributes: ["PaperStrength", "ID"] },

    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    {
      model: RunningDirection,
      attributes: ["RunningDirection", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    { model: WarehouseProducts, where: { WarehouseID }, required: false },
    {
      model: RegularPrice,
      include: [{ model: Group }, { model: RegularPriceRange }],
    },
  ];

  //* supplierId passed through admin side supplier module **/
  //* when admin logged in then req.user.referenceID would be 0 ...so it will take supplierId(req.body) **/
  let modelOption = [
    {
      SupplierID: req.user.referenceID ? req.user.referenceID : supplierId,
      IsDelete: 0,
      IsActive: 1,
    },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(ProductMaster.rawAttributes).includes(key1)) {
          modelOption.push({
            [key1]: { [Op.like]: `%${filterObj[key1]}%` },
          });
        } else if (includeOption) {
          for (let key2 of includeOption) {
            if (key2.attributes && key2.attributes.includes(key1)) {
              key2.where = {
                [key1]: { [Op.like]: `%${filterObj[key1]}%` },
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

  await ProductMaster.findAndCountAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    offset,
    limit: limit ? limit : 10,
    include: includeOption,
    distinct: true,
    order: [[WarehouseProducts, "updatedAt", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, `Supplier's Products`))
    .catch((err) => serverError(res, req, err));
});

//get all products for one supplier
//hasmukh(22/03/2021)

router.post("/getAllWarehouseProducts2", auth, async (req, res) => {
  const { page, limit, WarehouseID } = req.body;
  let offset = (page - 1) * limit;

  let includeOption = [
    {
      model: ProductSubgroup,
      attributes: ["ProductSubgroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: ProductGroup,
      attributes: ["ProductGroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperClass,
      attributes: ["PaperClass", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperColor,
      attributes: ["PaperColor", "ID"],
      where: { IsActive: 1 },
    },
    { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    { model: PaperRies, attributes: ["PaperRies", "ID"] },
    { model: PaperStrength, attributes: ["PaperStrength", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    {
      model: RunningDirection,
      attributes: ["RunningDirection", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    { model: ProductImages, attributes: ["Image", "ID", "ProductID"] }, //retriving images for the product
    {
      model: RegularPrice,
      include: [{ model: Group }, { model: RegularPriceRange }],
    },
  ];

  await WarehouseProducts.findAndCountAll({
    where: { WarehouseID, SupplierID: req.user.referenceID },
    offset,
    limit: limit ? limit : 10,
    include: [{ model: ProductMaster, include: includeOption }],
    order: [["ID", "DESC"]],
  })
    .then((data) =>
      successResponse(res, req, data, "All supplier warehouse Products")
    )
    .catch((err) => serverError(res, req, err));
});

//update stock
//hasmukh(22/03/2021)
router.post("/updateStock", auth, async (req, res) => {
  const { ProductID, value, warehouseID, action } = req.body;

  if (!action || !warehouseID) return other(res, req, "Something went wrong");

  let SupplierID = req.user.referenceID;
  await WarehouseProducts.findOne({
    where: { ProductID, WarehouseID: warehouseID },
    include: { model: ProductMaster, attributes: ["StockQuantity"] },
    order: [["createdAt", "DESC"]],
    raw: true,
    nest: true,
  }).then(async (data) => {
    if (action == actionTypes.add) {
      if (!data) {
        //update stock
        let updateStock = updateWarehouseStock(null, {
          ...req.body,
          SupplierID,
        });
        //error handler
        if (!updateStock) return other(res, req, "Stock is being used");
        //success response
        await updateStock
          .then(async (result) => {
            successResponse(
              res,
              req,
              { data: result.get({ plain: true }) },
              "Stock quantity added successfully"
            );
          })
          .catch((err) => serverError(res, req, err));
      } else {
        //update stock
        let updateStock = updateWarehouseStock(data, {
          ...req.body,
          SupplierID,
        });
        //error handler

        //success response
        console.log(updateStock, "this is updated sotck");
        await updateStock
          .then(async (result) => {
            if (!result) return other(res, req, "Stock is being used");
            successResponse(
              res,
              req,
              { data: result.get({ plain: true }) },
              "Stock quantity added successfully"
            );
          })
          .catch((err) => serverError(res, req, err));
      }
    } else if (action == actionTypes.minus) {
      if (!data) return other(res, req, "You cannot minus this stock");
      if (data.StockQuantity - parseInt(value) < 0)
        return other(res, req, "Stock cannot be negative");
      //update stock
      let updateStock = await updateWarehouseStock(data, {
        ...req.body,
        SupplierID,
      });
      //error handler
      if (!updateStock) return other(res, req, "Stock is being used");
      //success response
      await updateStock
        .then(async (result) => {
          successResponse(
            res,
            req,
            { data: result.get({ plain: true }) },
            "Stock quantity subtracted successfully"
          );
        })
        .catch((err) => serverError(res, req, err));
    }
  });
});

// delete warehouse Products
// hasmukh (25/03/2021)
router.post("/removeWarehouseProduct", auth, async (req, res) => {
  await WarehouseProducts.destroy({ where: { ID: [...req.body.list] } })
    .then(async (data) => {
      var newData = {
        ...data,
        ID: req.body.list,
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
});

//get stock of warehouse from single warehouse
router.get("/productStock/:id", auth, async (req, res) => {
  let ProductID = req.params.id;
  let SupplierID = req.user.referenceID;

  sequelize
    .query(
      `
    SELECT
        t2.*,
        (SELECT SUM(ReservedQuantity) FROM Reserved_Quantity WHERE Reserved_Quantity.ProductID = ${ProductID}) AS ReservedQuantity
    FROM
        (
        SELECT
            w.ID,
            w.WarehouseID,
            w.ProductID,
            s.WarehouseName,
            w.SupplierID,
            w.StockQuantity,
            w.AddQuantity,
            w.MinusQuantity,
            w.createdAt,
            w.updatedAt,
            RANK() OVER(
            PARTITION BY WarehouseID,
            ProductID
        ORDER BY
            id
        DESC
        ) AS rank
    FROM
        Warehouse_Products w JOIN Supplier_Warehouse s ON w.WarehouseID = s.ID
    WHERE
        w.ProductID = ${ProductID} AND w.SupplierID = ${SupplierID}) t2
    WHERE t2.rank = 1`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    )

    .then((result) => successResponse(res, req, result, "Warehouse stock"))
    .catch((err) => serverError(res, req, err));
});

/**
 * @get_all_warehouse for export list
 */
router.get("/getAllWarehouse", auth, async (req, res) => {
  await SupplierWarehouse.findAll({
    where: { SupplierID: req.user.referenceID, IsDelete: 0, IsActive: 1 },
  })
    .then((result) => {
      successResponse(res, req, result, "all warehouses");
    })
    .catch((err) => {
      serverError(res, req, err);
    });
});

/**
 * @get_Warehouses
 */
const formatWarehouse = (arr) => {
  let warehouses = [];
  for (let singleWarehouse of arr) {
    if (
      !warehouses.filter(
        (item) => singleWarehouse.dataValues.WarehouseID == item.WarehouseID
      ).length
    ) {
      warehouses.push(singleWarehouse.dataValues);
    }
  }
  return warehouses;
};

/**
 * @export warehouse stock
 */
router.get("/exportProducts", auth, async (req, res) => {
  let includeOption = [
    {
      model: ProductSubgroup,
      attributes: ["ProductSubgroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: ProductGroup,
      attributes: ["ProductGroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperClass,
      attributes: ["PaperClass", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperColor,
      attributes: ["PaperColor", "ID"],
      where: { IsActive: 1 },
    },
    { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    {
      model: WarehouseProducts,
      include: [{ model: SupplierWarehouse }],
      required: false,
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    {
      model: RegularPrice,
      include: [{ model: RegularPriceRange }],
    },
  ];

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0 },
  ];
  let attributes = [
    "ProductNo",
    "ProductName",
    "SupplierID",
    "ProductDescription",
    "PaymentTerms",
    "DeliveryTerms",
    "GroupID",
    "SubGroupID",
    "PaperClassID",
    "PaperQualityID",
    "UomID",
    "Thickness",
    "Width",
    "Height",
    "Weight",
    "ID",
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    order: [["ID", "DESC"]],
    attributes,
    order: [[WarehouseProducts, "updatedAt", "DESC"]],
  })
    .then((data) => {
      let arr = [];

      for (let singleProduct of data) {
        let {
          ProductNo,
          ProductName,
          Width,
          Height,
          Weight,
          Product_Subgroup,
          Product_Group,
          Paper_Class,
          Paper_Color,
          Paper_Quality,
          Measurement_Unit,
          ID,
        } = singleProduct.dataValues;
        let obj = {
          ID,
          ProductNo,
          ProductName,
          Width,
          Height,
          Weight,
          Group: Product_Group.ProductGroup,
          Subgroup: Product_Subgroup.ProductSubgroup,
          Class: Paper_Class.PaperClass,
          Color: Paper_Color.PaperColor,
          Quality: Paper_Quality.PaperQuality,
          Unit: `${Measurement_Unit.MeasurementUnit}${
            singleProduct.dataValues.Pricings.length &&
            singleProduct.dataValues.Pricings[0].dataValues.rollType == "kg"
              ? "(KG)"
              : ""
          }`,
        };
        for (let stock of formatWarehouse(singleProduct.Warehouse_Products)) {
          obj[
            `${stock.Supplier_Warehouse.ID}-${stock.Supplier_Warehouse.WarehouseName}`
          ] = "";
        }
        arr.push(obj);
      }

      successResponse(res, req, arr, `Product Data`);
    })
    .catch((err) => serverError(res, req, err));
});

const isDigit = (s) => {
  let c = s.charAt(0);
  return Boolean(c >= "0" && c <= "9");
};

const getID = (s) => {
  return s.substr(0, s.indexOf("-"));
};

/**
 * @add new warehouse stock
 */
router.post(
  "/addWarehouseStock",
  auth,
  file.fileUpload.single("excelFile"),
  async (req, res) => {
    try {
      let SupplierID = req.user.referenceID;
      var workbook = XLSX.readFile(
        path.join(__dirname, `../public/excelFiles/${req.file.filename}`)
      );
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      for (let i of xlData) {
        for (let childItem of Object.keys(i)) {
          if (isDigit(childItem)) {
            WarehouseProducts.findOne({
              where: {
                SupplierID,
                WarehouseID: getID(childItem),
                ProductID: i.ID,
              },
              raw: true,
            }).then(async (result) => {
              await WarehouseProducts.update(
              
                {
                  StockQuantity: result.StockQuantity + i[childItem],
                  AddQuantity: i[childItem],
                },
                {where:{ ID: result.ID },}
              );
            });
          }
        }
      }
      successResponse(res, req, null, "Warehouse stock updated");
    } catch (error) {
      console.log(error, "this is error");
    }
  }
);

module.exports = router;
