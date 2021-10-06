const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const XLSX = require("xlsx");
const path = require("path");
const Op = Sequelize.Op;
const {
  ProductMaster,
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
  Supplier,
  WarehouseProducts,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const file = require("../../middlewares/multer");
const {
  alreadyExist,
  serverError,
  successResponse,
  other,
} = require("../../helpers/response");
const { check } = require("express-validator");
const { customValidationFun } = require("../../helpers/commonHelper");
const errorMessage = "This field is required";

/**
 * required fields validation for product master
 */
const requiredFields = [
  check("ProductNo", errorMessage).not().isEmpty(),
  check("ProductName", errorMessage).not().isEmpty(),
  check("GroupID", errorMessage).not().isEmpty(),
  check("SubGroupID", errorMessage).not().isEmpty(),
  check("GsmID", errorMessage).not().isEmpty(),
  check("PaperClassID", errorMessage).not().isEmpty(),
  check("PaperQualityID", errorMessage).not().isEmpty(),
  check("PaperPrintibilityID", errorMessage).not().isEmpty(),
  check("ColorID", errorMessage).not().isEmpty(),
  check("GrainID", errorMessage).not().isEmpty(),
  check("UomID", errorMessage).not().isEmpty(),
  check("Width", errorMessage).not().isEmpty(),
  check("Thickness", errorMessage).not().isEmpty(),
  check("ProductDescription", errorMessage).not().isEmpty(),
];

/**
 * @myfun for check weight or height
 * @param {Object} req
 * @call validation fun accordingly
 */
const myfun = (req) => {
  const obj = req.body;

  if (!("Weight" in obj)) {
    customValidationFun([
      ...requiredFields,
      check("Weight", errorMessage).not().isEmpty(),
    ]);
  } else {
    customValidationFun([
      ...requiredFields,
      check("Height", errorMessage).not().isEmpty(),
    ]);
  }
};

// set the foreign keys for product old id ref
// hasmukh(2812/2020)
const foriegnKeys = [
  "SupplierID",
  "GroupID",
  "SubGroupID",
  "PaperClassID",
  "PaperQualityID",
  "PaperPrintibilityID",
  "UomID",
  "GsmID",
  "GrainID",
  "ColorID",
  "RunningDirectionID",
  "RiesID",
  "StrengthID",
];

// define foreign key for the product table
const include = [
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
];

// ***************** COMMON METHODS FOR PRODUCTS *********************************
// get product by id
// 28-12-2020
// hasmukh
const getSingleProduct = (id) => {
  // console.log(id, "get single Product");
  return ProductMaster.findOne({
    where: { ID: id },
    include,
  });
};

const getAllProducts = (obj) => {
  let { where, offset, limit, includeOption, order } = obj;
  // console.log(includeOption, "this are include options");

  return ProductMaster.findAndCountAll({
    where: where ? where : { IsDelete: 0, IsActive: 1 },
    offset,
    limit: limit ? limit : 10,
    include: includeOption,
    order: order ? order : [["ID", "DESC"]],
  });
};

// ***************** COMMON METHODS FOR PRODUCTS *********************************

//add product
//17-12-2020
//vishal acharya
router.post(
  "/addProduct",
  auth,
  file.imageUpload.array("files"),
  customValidationFun(requiredFields),
  async (req, res) => {
    for (let key of Object.keys(req.body)) {
      if (req.body[key] == "") {
        req.body[key] = null;
      }
      if (key == "IsActive") {
        req.body[key] == "true"
          ? (req.body[key] = true)
          : (req.body[key] = false);
      }
    }

    //console.log(req.user.referenceID, "this is reference id");
    //validate product
    await ProductMaster.findOne({
      where: {
        ProductNo: req.body.ProductNo,
        SupplierID: req.user.referenceID,
      },
    })
      .then(async (singleProduct) => {
        if (singleProduct)
          return alreadyExist(res, req, "Product No already exist");
        const {
          Width,
          GsmID,
          PaperClassID,
          PaperPrintibilityID,
          ColorID,
          GrainID,
        } = req.body;
        const PropertyCheck = {
          Width,
          GsmID,
          PaperClassID,
          PaperPrintibilityID,
          ColorID,
          GrainID,
          SupplierID: req.user.referenceID,
        };
        ProductMaster.findAll({ where: PropertyCheck })
          .then(async (products) => {
            if (products.length)
              return alreadyExist(
                res,
                req,
                "Product with that property configuration already exists"
              );
            await ProductMaster.create({
              ...req.body,
              SupplierID: req.user.referenceID,
            })
              .then(async (data) => {
                const imagesArr = [];

                req.files.map((singleFile) => {
                  imagesArr.push({
                    Image: singleFile.filename,
                    ProductID: data.dataValues.ID,
                  });
                });

                await ProductImages.bulkCreate(imagesArr)
                  .then((imageData) => {
                    getSingleProduct(data.dataValues.ID)
                      .then((sigleProduct) => {
                        successResponse(
                          res,
                          req,
                          sigleProduct,
                          "Product added successfully"
                        );
                      })
                      .catch((err) => {
                        serverError(res, req, err);
                      });
                  })
                  .catch((err) => serverError(res, req, err));
              })
              .catch((err) => serverError(res, req, err));
          })
          .catch((err) => serverError(res, req, err));
      })
      .catch((err) => serverError(res, req, err));
  }
);

// get product list
// 18-12-2020
// vishal acharya
// change by hasmukh(4/1/2021) for getting row count
// change by hasmukh(5/1/2021) add filters
// change by hasmukh(22/1/2021) filters
router.post("/getProducts", auth, async (req, res) => {
  const { filter, page, limit, supplierId } = req.body;

  //* supplierId passed through admin side supplier module **/
  //* when admin logged in then req.user.referenceID would be 0 ...so it will take supplierId(req.body) **/

  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
  let includeOption = include;
  includeOption.push({
    model: RegularPrice,
    // attributes: ["PricingUnit", "ID"],
    include: [{ model: Group }, { model: RegularPriceRange }],
    //where: { IsActive: 1 },
  });
  // includeOption.push()
  let modelOption = [
    {
      SupplierID: req.user.referenceID ? req.user.referenceID : supplierId,
      IsDelete: 0,
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
    distinct: true, //distinct add for the count proper
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    offset,
    limit: limit ? limit : 10,
    include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, `Product Data`))
    .catch((err) => serverError(res, req, err));
});

/**
 * @Get_Products_For_export
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
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
  ];

  let modelOption = [{ SupplierID: req.user.referenceID, IsDelete: 0 }];
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
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    order: [["ID", "DESC"]],
    attributes,
    raw: true,
  })
    .then((data) => successResponse(res, req, data, `Product Data`))
    .catch((err) => serverError(res, req, err));
});

//get products with pricing
router.post("/getProductsWithPricing_bk", auth, async (req, res) => {
  const { page, limit } = req.body;
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

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0, HasPricing: 1 },
  ];
  // console.log(includeOption, "this is include option");
  await ProductMaster.findAndCountAll({
    where: modelOption ? modelOption : { IsDelete: 0 },
    offset,
    limit: limit ? limit : 10,
    include: includeOption,
    // order: [["ID", "DESC"]],
  })
    .then((data) => {
      successResponse(res, req, data, `Product Data`);
    })
    .catch((err) => serverError(res, req, err));
});

//get products with pricing
router.post("/getProductsWithPricing", auth, async (req, res) => {
  const { filter, page, limit } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;
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

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0, HasPricing: 1 },
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

  // console.log(includeOption, "this is include option");
  await ProductMaster.findAndCountAll({
    distinct: true, //distinct add for the count proper
    where: modelOption ? modelOption : { IsDelete: 0 },
    offset,
    limit: limit ? limit : 10,
    include: includeOption,
    order: [["ID", "DESC"]],
  })
    .then((data) => {
      successResponse(res, req, data, `Product Data with Pricing`);
    })
    .catch((err) => serverError(res, req, err));
});

//edit product
//26-12-2020
//hasmukh
router.post(
  "/editProduct/:id",
  auth,
  file.imageUpload.array("files"),
  customValidationFun(requiredFields),
  async (req, res) => {
    //console.log(req.body, "this is body");
    let imageIDs = [];
    let condition = {};
    for (let key of Object.keys(req.body)) {
      if (req.body[key] == "" || req.body[key] == "null") {
        req.body[key] = null;
      }
      // if (key == "IsActive") {
      //   req.body[key] == "1"
      //     ? (req.body[key] = true)
      //     : (req.body[key] = false);
      // }
      if (key == "IsActive") {
        req.body[key] == "true" || req.body[key] == "1"
          ? (req.body[key] = true)
          : (req.body[key] = false);
      }
      if (key == "oldImagesArr") {
        if (typeof req.body[key] == "string") {
          imageIDs.push(JSON.parse(req.body[key]).ID);
        } else {
          for (let i of Object.keys(req.body[key])) {
            imageIDs.push(JSON.parse(req.body[key][i]).ID);
          }
        }
      }
    }
    // delete the images while update the product which images removed by supplier
    // hasmukh(29/12/2020)
    // console.log(imageIDs.length);
    if (imageIDs.length) {
      condition = {
        ID: { [Sequelize.Op.not]: imageIDs },
        ProductID: req.params.id,
      };
    } else {
      condition = {
        ProductID: req.params.id,
      };
    }

    //this is delete images query
    await ProductImages.destroy({
      where: condition,
    })
      .then((data) => {
        // console.log("some images deleted", data);
      })
      .catch((err) => {
        console.log(err);
      });

    await ProductMaster.update(
      {
        ...req.body,
      },
      { where: { ID: req.params.id } }
    )
      .then(async (data) => {
        const imagesArr = [];
        req.files.map((singleFile) => {
          imagesArr.push({
            Image: singleFile.filename,
            ProductID: req.params.id,
          });
        });

        await ProductImages.bulkCreate(imagesArr)
          .then((imageData) => {
            getSingleProduct(req.params.id)
              .then((sigleProduct) => {
                successResponse(
                  res,
                  req,
                  sigleProduct,
                  "Product upadated successfully"
                );
              })
              .catch((err) => {
                serverError(res, req, err);
              });
          })
          .catch((err) => {
            serverError(res, req, err);
          });
      })

      .catch((err) => serverError(res, req, err));
  }
);

//delete product
//28-12-2020
//hasmukh
router.post(
  "/deleteProduct/:id",
  auth,
  // file.imageUpload.array("files"),
  async (req, res) => {
    //console.log("foriegnKeys............", foriegnKeys);
    await ProductMaster.findAll({ where: { ID: req.params.id } }).then(
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

        //Destroy product images
        await ProductImages.destroy({ where: { ProductID: req.params.id } });

        //Destroy product data

        await ProductMaster.destroy({ where: { ID: req.params.id } })
          .then(async (data) => {
            //Create a new entry od deleted data
            ProductMaster.create({
              ...singleData[0].dataValues,
              SupplierID,
              IsActive: 0,
              IsDelete: 1,
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
  }
);

//get single product
//vishal 8 1 2021
router.get("/getSingleProduct/:id", auth, async (req, res) => {
  await getSingleProduct(req.params.id)
    .then((product) => successResponse(res, req, product, "Single product"))
    .catch((err) => serverError(res, req, err));
});

//publish product
//vishal 18 1 2021
router.post("/publishProduct/:id", auth, async (req, res) => {
  console.log(req.body.otherDetails.IsActive, "This is bpodyyy");
  // return
  await ProductMaster.findOne({ where: { ID: req.params.id } })
    .then(async (singleProduct) => {
      if (!singleProduct.dataValues.IsActive || !req.body.otherDetails.IsActive)
        return other(
          res,
          req,
          "Please make your product active before publishing"
        );
      let update = { IsPublished: 1 };
      if (
        !singleProduct.dataValues.IsActive &&
        req.body.otherDetails.IsActive
      ) {
        update.IsActive = 1;
      }
      await ProductMaster.update(update, {
        where: { ID: req.params.id },
      }).then((data) => successResponse(res, req, data, "Product Published"));
    })
    .catch((err) => serverError(res, req, err));
});

//unpublish product
//vihsal 19 1 2021
router.get("/unPublish/:id", auth, async (req, res) => {
  await ProductMaster.update(
    { IsPublished: 0 },
    { where: { ID: req.params.id } }
  )
    .then((data) => successResponse(res, req, data, "Product Unpublished"))
    .catch((err) => serverError(res, req, err));
});

// ********************************  APIS FOR CLIENT SIDE (NEXT JS) ***********************************

//get all products of every supplier wich has pricing wihtout authentication
router.post("/allProducts", async (req, res) => {
  let filterObj = {};
  const { page, limit, filter, format, size } = req.body;

  // console.log("BODY ====== ", req.body);
  let offset = (page - 1) * limit;
  let filterArr = filter;
  // console.log(req.body.filter);
  //modify reqbody object
  if (filterArr) {
    for (let item of filterArr) {
      let values = [];
      if (Object.keys(filterObj).includes(Object.keys(item)[0])) {
        values = filterObj[Object.keys(item)[0]];
        values.push(item[Object.keys(item)[0]]);
      } else {
        values.push(item[Object.keys(item)[0]]);
        filterObj[Object.keys(item)[0]] = values;
      }
    }
  }
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
    {
      model: PaperGsm,
      where: {
        PaperGsm: {
          [Op.between]: req.body.value,
        },
      },
    },
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
      where: { IsActive: 1 },
    },
    {
      model: Supplier,
      attributes: [
        "SupplierName",
        "Address",
        "ID",
        "ZipCode",
        "Email",
        "Industry",
        "Vat_Tax_No",
        "ContactPersonName",
      ],
      // include:[{model: State}, {model: City}, {model: Country}],
      where: { IsActive: 1, IsApproved: 1 },
    },
  ];

  if (Object.keys(filterObj).length) {
    for (let filterKey of Object.keys(filterObj)) {
      for (let singleInclude of includeOption) {
        if (
          singleInclude.attributes &&
          singleInclude.attributes.includes(filterKey)
        ) {
          singleInclude.where = {
            [filterKey]: { [Op.in]: filterObj[filterKey] },
          };
        }
      }
    }
  }
  let where = {
    HasPricing: 1,
    IsActive: 1,
    IsDelete: 0,
    IsPublished: 1,
  };
  if (size) {
    where = {
      ...where,
      Width: { [Op.between]: size.width },
      Height: { [Op.between]: size.length },
    };
  }

  if (format) {
    const { width, length } = format;
    width ? (where.Width = width) : null;
    length ? (where.Height = length) : null;
  }

  await ProductMaster.findAndCountAll({
    where,
    limit,
    offset,
    distinct: true,
    // order: [[WarehouseProducts, "ID", "DESC"]],
    include: includeOption,
  })
    .then((data) => {
      // console.log(data, "this is data");
      successResponse(res, req, data, "All products");
    })
    .catch((err) => serverError(res, req, err));
});

//get single product (published)
router.get("/getSinglePublishedProduct/:id", async (req, res) => {
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
    {
      model: PaperGsm,
    },
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
    { model: WarehouseProducts },
    {
      model: RegularPrice,
      include: [{ model: Group }, { model: RegularPriceRange }],
      where: { IsActive: 1 },
    },
    {
      model: Supplier,
      attributes: [
        "SupplierName",
        "Address",
        "ID",
        "ZipCode",
        "Email",
        "Industry",
        "Vat_Tax_No",
        "ContactPersonName",
      ],
      where: { IsActive: 1, IsApproved: 1 },
      raw: true,
      nest: true,
    },
  ];

  await ProductMaster.findOne({
    where: { ID: req.params.id },
    include: includeOption,
  })
    .then(async (data) => {
      const {
        ColorID,
        GrainID,
        PaperPrintibilityID,
        PaperQualityID,
        PaperClassID,
        GsmID,
        UomID,
        ID,
      } = data;

      let obj = {
        ColorID,
        GrainID,
        PaperPrintibilityID,
        PaperQualityID,
        PaperClassID,
        GsmID,
        UomID,
      };
      await ProductMaster.findAll({
        where: { ...obj, ID: { [Op.not]: ID } },
        order: [[WarehouseProducts, "ID", "DESC"]],
        include: includeOption,
      })
        .then(async (relatedProducts) => {
          ProductMaster.findAll({
            where: { SubGroupID: data.SubGroupID },
            include: [
              { model: PaperClass },
              { model: PaperQuality },
              { model: PaperPrintibility },
              { model: PaperColor },
              { model: PaperGrain },
            ],
            attributes: [
              Sequelize.literal(
                "DISTINCT PaperClassID AS `PaperClassID`, PaperQualityID AS PaperQualityID, PaperPrintibilityID AS PaperPrintibilityID, ColorID AS ColorID, GrainID AS GrainID"
              ),
            ],
            logging: true,
            raw: true,
            nest: true,
          }).then((result) => {
            console.log(result, "this is result");
          });

          successResponse(res, req, { data, relatedProducts }, "All products");
        })
        .catch((err) => serverError(res, req, err));
    })
    .catch((err) => serverError(res, req, err));
});

//get single product detial from property
router.post("/singleProdFromProperties", async (req, res) => {
  //  console.log(req.body, "this is body");

  const { key, value, product } = req.body;
  const {
    ColorID,
    GrainID,
    PaperPrintibilityID,
    PaperQualityID,
    PaperClassID,
    GsmID,
    UomID,
  } = product;

  let obj = {
    ColorID,
    GrainID,
    PaperPrintibilityID,
    PaperQualityID,
    PaperClassID,
    GsmID,
    UomID,
  };

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
    {
      model: PaperGsm,
      attributes: ["PaperGsm", "ID"],
    },
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
    { model: WarehouseProducts },
    {
      model: RegularPrice,
      include: [{ model: Group }, { model: RegularPriceRange }],
      where: { IsActive: 1 },
    },
    {
      model: Supplier,
      attributes: [
        "SupplierName",
        "Address",
        "ID",
        "ZipCode",
        "Email",
        "Industry",
        "Vat_Tax_No",
        "ContactPersonName",
      ],
      where: { IsActive: 1, IsApproved: 1 },
    },
  ];

  //overriding id in object from seleted value
  for (let i of Object.keys(obj)) {
    if (i == key) {
      obj[key] = value.ID;
    }
  }

  await ProductMaster.findAll({
    where: obj,
    include: includeOption,
    order: [[WarehouseProducts, "ID", "DESC"]],
  })
    .then((data) => successResponse(res, req, data, "Single Product"))
    .catch((err) => serverError(res, req, err));
});

/**
 * @Get_Products_For_export
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
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
  ];

  let modelOption = [{ SupplierID: req.user.referenceID, IsDelete: 0 }];
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
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    order: [["ID", "DESC"]],
    attributes,
    raw: true,
  })
    .then((data) => successResponse(res, req, data, `Product Data`))
    .catch((err) => serverError(res, req, err));
});

//import data
router.post(
  "/importProduct",
  auth,
  file.fileUpload.single("excelFile"),
  async (req, res) => {
    try {
      j = 0;
      var arr = {
        group: null,
        gsm: null,
        color: null,
        paperclass: null,
        quality: null,
        uom: null,
        printability: null,
        subGroup: null,
        grain: null,
        total: 0,
      };

      var notImportedProducts = [];

      // Paper_Quality.PaperQuality
      var workbook = XLSX.readFile(
        path.join(__dirname, `../../public/excelFiles/${req.file.filename}`)
      );
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      for (let i of xlData) {
        if (i.ProductNo) {
          await ProductMaster.findOne({
            where: {
              ProductNo: i.ProductNo,
              SupplierID: req.user.referenceID,
            },
          }).then(async (singleProduct) => {
            if (!singleProduct) {
              await ProductGroup.findOne({
                where: {
                  ProductGroup: { [Op.like]: i["Product_Group.ProductGroup"] },
                },
              }).then((result) =>
                result ? (arr.group = result.dataValues.ID) : (arr.group = null)
              );

              await PaperGsm.findOne({
                where: { PaperGsm: { [Op.like]: i["Paper_Gsm.PaperGsm"] } },
              }).then((result) =>
                result ? (arr.gsm = result.dataValues.ID) : (arr.gsm = null)
              );

              await PaperColor.findOne({
                where: {
                  PaperColor: { [Op.like]: i["Paper_Color.PaperColor"] },
                },
              }).then((result) =>
                result ? (arr.color = result.dataValues.ID) : (arr.color = null)
              );

              await PaperQuality.findOne({
                where: {
                  PaperQuality: { [Op.like]: i["Paper_Quality.PaperQuality "] },
                },
              }).then((result) =>
                result
                  ? (arr.quality = result.dataValues.ID)
                  : (arr.quality = null)
              );

              await ProductSubgroup.findOne({
                where: {
                  ProductSubgroup: {
                    [Op.like]: i["Product_Subgroup.ProductSubgroup"],
                  },
                },
              }).then((result) =>
                result
                  ? (arr.subGroup = result.dataValues.ID)
                  : (arr.subGroup = null)
              );

              await PaperGrain.findOne({
                where: {
                  PaperGrain: { [Op.like]: i["Paper_Grain.PaperGrain"] },
                },
              }).then((result) =>
                result ? (arr.grain = result.dataValues.ID) : (arr.grain = null)
              );

              await PaperPrintibility.findOne({
                where: {
                  PaperPrintibility: {
                    [Op.like]: i["Paper_Printibility.PaperPrintibility"],
                  },
                },
              }).then((result) =>
                result
                  ? (arr.printability = result.dataValues.ID)
                  : (arr.printability = null)
              );

              await PaperClass.findOne({
                where: {
                  PaperClass: { [Op.like]: i["Paper_Class.PaperClass"] },
                },
              }).then((result) =>
                result
                  ? (arr.paperclass = result.dataValues.ID)
                  : (arr.paperclass = null)
              );
              const { gsm, paperclass, printability, color, grain } = arr;
              const PropertyCheck = {
                Width: i.Width,
                GsmID: gsm,
                PaperClassID: paperclass,
                PaperPrintibilityID: printability,
                ColorID: color,
                GrainID: grain,
                SupplierID: req.user.referenceID,
              };

              ProductMaster.findAll({ where: PropertyCheck }).then(
                async (products) => {
                  if (!products.length) {
                    await ProductMaster.create({
                      ProductName: i.ProductName,
                      ProductNo: i.ProductNo,
                      Height: i.Height ? i.Height : 210,
                      GroupID: arr.group,
                      GsmID: arr.gsm,
                      ColorID: arr.color,
                      PaperQualityID: arr.quality,
                      PaperClassID: arr.paperclass,
                      ProductDescription: i.ProductDescription,
                      Width: i.Width,
                      Weight: i.Weight,
                      SupplierID: req.user.referenceID,
                      UomID: arr.uom ? arr.uom : 1,
                      PaperPrintibilityID: arr.printability,
                      GrainID: arr.grain,
                      SubGroupID: arr.subGroup ? arr.subGroup : 1,
                    }).then((data) => (arr.total = j++));
                  } else {
                    notImportedProducts.push(i.ProductNo);
                  }
                }
              );
            } else {
              notImportedProducts.push(i.ProductNo);
            }
          });
        } else {
          notImportedProducts.push("No Product Number");
        }
      }

      successResponse(
        res,
        req,
        {
          importedProducts: xlData.length - notImportedProducts.length,
          notImportedProducts,
          TotalProducts: xlData.length,
        },
        "data"
      );
    } catch (error) {
      console.log(error, "bulk upload");
      return serverError(res, req, error);
    }
  }
);

module.exports = router;
