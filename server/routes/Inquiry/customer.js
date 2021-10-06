const express = require("express");
const router = express.Router();
const {
  InquiryMaster,
  InquiryDetails,

  QuotationMaster,
  QuotationDetails,
  User,

  PurchaseOrderDetail,
  CustomerAddress,
  Country,
  State,
  City,

  sequelize,
  Customer,
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
  Notification,
  Terms,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const { successResponse, serverError } = require("../../helpers/response");
const {
  notificationTypes,
  ROLE_ID,
  NOTIFICATION_KEY,
} = require("../../helpers/commonHelper");
const foriegnKeys = ["InquiryID", "ProductID", "SupplierID"];

/**
 * @param {number} supplierID reference id from the user master table
 * @Create_and_emit_notification
 */
const emitNotification = (SupplierID, req) => {
  Notification.create({
    NotificationType: notificationTypes.NewInquiry, //from common helper
    Title: "New Inquiry recieved",
    SupplierID, //reference id from the user master table
    RoleID: ROLE_ID.SUPPLIER, //from commonhelper
  })
    /**
     * @Get_All_Notification_Count
     */
    .then((result) => {
      return Notification.findAndCountAll({
        where: { SupplierID, Read: 0 },
        group: ["NotificationType"],
        limit: 1,
      });
    })
    /**
     * @Emit_Notification and send success response
     */
    .then(async (notification) => {
      //emit notification to relevant user
      req.io.emit(NOTIFICATION_KEY, {
        notificationCount: notification.count.length,
        msg: `new order`,
        title: "New Inquiry recieved",
        RefID: SupplierID, //id from user master
      });
    });
};

//add new inquiry
//vishal 25 Feb 2021
router.post("/newIquiry", auth, async (req, res) => {
  const { selectedItems, additionalInfo } = req.body;
  const { inquiryNo, ValidTill, Remarks, type, AddressID, DeliveryAddress } =
    additionalInfo;

  //console.log("req.user............", req.user);
  const t = await sequelize.transaction();
  //create new inquiry in inquiryMaster
  await InquiryMaster.create(
    {
      InquiryNo: inquiryNo,
      Date: new Date(),
      Status: type,
      CustomerID: req.user.reference_id,
      UserID: req.user.id,
      createdBy: req.user.reference_id,
      ValidTill,
      Remarks,
      AddressID,
      DeliveryAddress,
    },
    { transaction: t }
  )
    .then(async (inquiry) => {
      let supplierArr = [];
      let productDetail = [];
      for (let item of selectedItems) {
        const { ID, Quantity, PackageType, ExpectedDate, SupplierID, Remarks } =
          item;

        let obj = {
          InquiryID: inquiry.dataValues.ID,
          ProductID: ID,
          SupplierID,
          Quantity,
          Unit: PackageType,
          ExpectedDate,
          Remarks,
          createdBy: req.user.reference_id,
        };
        //unique supplier arr
        if (type == "sent") {
          if (!supplierArr.includes(SupplierID)) supplierArr.push(SupplierID);
        }

        productDetail.push(obj);
      }
      //emit notification loop for multiple suppliers
      supplierArr.map((item) => emitNotification(item, req));

      //store product details of this inquiry in detail table
      await InquiryDetails.bulkCreate(productDetail, { transaction: t })
        .then(async (inquiryDetail) => {
          successResponse(
            res,
            req,
            inquiryDetail,
            type == "draft"
              ? "Inquiry saved to draft successfully"
              : "Inquiry Sent successfully"
          );
          await t.commit();
        })
        .catch(async (err) => {
          await t.rollback();
          serverError(res, req, err);
        });
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

//get all inquiries
//vishal 26 Feb 2021
router.post("/getInquiry", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;

  await InquiryMaster.findAndCountAll({
    where: { CustomerID: req.user.reference_id, IsDelete: 0, IsActive: 1 },
    include: [{ model: Customer, attributes: ["CustomerName"] }],
    limit,
    offset,
  })
    .then((inquiries) => {
      successResponse(res, req, inquiries, "All inquiries");
    })
    .catch((err) => serverError(res, req, err));
});

router.get("/getSingleInquiry/:id", auth, async (req, res) => {
  await InquiryDetails.findAll({
    where: { InquiryID: req.params.id },
    include: [
      {
        model: ProductMaster,
        include: [
          {
            model: RegularPrice,
          },
        ],
      },
    ],
  })
    .then((inquiryDetail) =>
      successResponse(res, req, inquiryDetail, "inquiry Detail")
    )
    .catch((err) => serverError(res, req, err));
});

//update inquiry
router.post("/updateInquiry/:id", auth, async (req, res) => {
  const { selectedItems, additionalInfo } = req.body;
  const { ValidTill, Remarks, type } = additionalInfo;
  const t = await sequelize.transaction();

  await InquiryMaster.update(
    { ID: req.params.id },
    {
      Status: type,
      //CustomerID: req.user.reference_id,
      updatedBy: req.user.reference_id,
      ValidTill,
      Remarks,
    }
  )
    .then(async (result) => {
      await InquiryDetails.destroy({ where: { InquiryID: req.params.id } })
        .then(async (data) => {
          let productDetail = [];
          for (let item of selectedItems) {
            const { ID, Quantity, PackageType, ExpectedDate, SupplierID } =
              item;
            let obj = {
              InquiryID: req.params.id,
              ProductID: ID,
              SupplierID,
              Quantity,
              Unit: PackageType,
              ExpectedDate,
              createdBy: req.user.reference_id,
            };
            productDetail.push(obj);
          }

          //store product details of this inquiry in detail table
          await InquiryDetails.bulkCreate(productDetail, { transaction: t })
            .then(async (inquiryDetail) => {
              successResponse(
                res,
                req,
                inquiryDetail,
                type == "draft"
                  ? "Inquiry saved to draft successfully"
                  : "Inquiry Sent successfully"
              );
              await t.commit();
            })
            .catch(async (err) => {
              await t.rollback();
              serverError(res, req, err);
            });
        })
        .catch(async (err) => {
          await t.rollback();
          serverError(res, req, err);
        });
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

//get all inquiries of the customer
//hasmukh 19/04/2021
router.post("/getCustomerInquiries", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;

  await InquiryMaster.findAndCountAll({
    where: { CustomerID: req.user.reference_id, IsDelete: 0, IsActive: 1 },
    include: [
      { model: QuotationMaster, where: { Status: "sent" }, required: false },
      {
        model: CustomerAddress,
        raw: true,
        include: [
          { model: Country, attributes: ["Country"] },
          { model: State, attributes: ["State"] },
          { model: City, attributes: ["City"] },
        ],
      },
      { model: User },
      { model: Customer },
    ],

    order: [["ID", "DESC"]],
    limit,
    offset,
  })
    .then((inquiries) => {
      successResponse(res, req, inquiries, "All inquiries of the customer");
    })
    .catch((err) => serverError(res, req, err));
});

//get single inquiry of the customer
//hasmukh 20/04/2021

router.post("/getSingleCustomerInquiry", auth, async (req, res) => {
  const { InquiryID, QuotationID } = req.body;
  let supplierArr = [];
  //console.log("QuotationID......", QuotationID);

  if (InquiryID) {
    await InquiryDetails.findAll({
      where: { InquiryID, IsDelete: 0, IsActive: 1 },
      include: [
        {
          model: ProductMaster,
          include: [
            {
              model: RegularPrice,
            },
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
          ],
        },
        {
          model: Supplier,
          include: [
            { model: Country, attributes: ["Country"] },
            { model: State, attributes: ["State"] },
            { model: City, attributes: ["City"] },
          ],
        },
      ],
    })
      .then(async (inquiryDetail) => {
        for (let i = 0; i < inquiryDetail.length; i++) {
          supplierArr.push(inquiryDetail[i].dataValues.Supplier.dataValues);
        }
        if (QuotationID && QuotationID.length) {
          await QuotationDetails.findAll({
            where: { QuotationID: [...QuotationID] },
            include: [
              {
                model: PurchaseOrderDetail,
                attributes: [
                  "ID",
                  "QuotationID",
                  "QuotationDetailID",
                  "InquiryID",
                  "Uom",
                ],
              },
              { model: Terms },
            ],
          })

            .then((quotationDetail) => {
              for (let i = 0; i < inquiryDetail.length; i++) {
                inquiryDetail[i].dataValues.QuotationDetails = {};
                for (let j = 0; j < quotationDetail.length; j++) {
                  if (
                    inquiryDetail[i].dataValues.ProductID ===
                      quotationDetail[j].dataValues.ProductID &&
                    inquiryDetail[i].dataValues.Unit ===
                      quotationDetail[j].dataValues.Unit
                  ) {
                    inquiryDetail[i].dataValues.QuotationDetails =
                      quotationDetail[j].dataValues;
                  }
                }
              }
            })
            .catch((err) => serverError(res, req, err));
        }

        successResponse(
          res,
          req,
          {
            inquiryDetail,
            supplierArr: supplierArr.filter(
              (v, i, a) => a.findIndex((t) => t.ID === v.ID) === i
            ),
          },
          "inquiry Detail"
        );
      })
      .catch((err) => serverError(res, req, err));
  } else {
    successResponse(res, req, [], "No Data");
  }
});

// update single inquiry Master by customer
// hasmukh(23/04/2021)

router.post("/updateInquiryMaster/:id", auth, async (req, res) => {
  const t = await sequelize.transaction();

  await InquiryMaster.update(
    {
      ...req.body.postData,
      updatedBy: req.user.reference_id,
    },
    { where: { ID: req.params.id } }
  )
    .then(async (result) => {
      successResponse(res, req, result, "inquiry master updated");
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

// update single inquiry item by customer
// hasmukh(23/04/2021)

router.post("/updateInquiryItem/:id", auth, async (req, res) => {
  await InquiryDetails.update(
    {
      ...req.body.postData,
      updatedBy: req.user.reference_id,
    },
    { where: { ID: req.params.id } }
  )
    .then(async (result) => {
      successResponse(res, req, result, "inquiry item updated");
    })
    .catch(async (err) => {
      serverError(res, req, err);
    });
});

// update status "sent" of inquiry by customer
// hasmukh(23/04/2021)

router.post("/updateInquiryStatusSent", auth, async (req, res) => {
  const t = await sequelize.transaction();

  //console.log(req.body);

  const { InquiryID, supplierArr } = req.body;

  await InquiryMaster.update(
    {
      Status: "sent",
      updatedBy: req.user.reference_id,
    },
    { where: { ID: InquiryID } }
  )
    .then(async (result) => {
      //emit notification loop for multiple suppliers
      supplierArr.map((item) => emitNotification(item, req));
      successResponse(res, req, result, "inquiry status(sent) updated");
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

// update status "cancel" of inquiry by customer
// hasmukh(23/04/2021)

router.post("/cancelInquiryStatusCancel/:id", auth, async (req, res) => {
  const t = await sequelize.transaction();

  await InquiryMaster.update(
    {
      Status: "cancel",
      updatedBy: req.user.reference_id,
    },
    { where: { ID: req.params.id } }
  )
    .then(async (result) => {
      successResponse(res, req, result, "inquiry status(cancel) updated");
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

// delete inquiry item by customer
// hasmukh(23/04/2021)

router.post("/deleteInquiryItem/:id", auth, async (req, res) => {
  const t = await sequelize.transaction();

  await InquiryDetails.findAll({ where: { ID: req.params.id } }).then(
    async (singleData) => {
      let InquiryID = singleData[0].dataValues.InquiryID;
      let ProductID = singleData[0].dataValues.ProductID;
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

      await InquiryDetails.destroy({ where: { ID: req.params.id } })
        .then(async (data) => {
          InquiryDetails.create({
            ...singleData[0].dataValues,
            InquiryID,
            ProductID,
            SupplierID,
            IsActive: 0,
            IsDelete: 1,
            createdBy: req.user.referenceID,
          });

          var newData = {
            ID: req.params.id,
          };

          successResponse(res, req, newData, "Inquiry Item Deleted");
        })
        .catch(async (err) => {
          // check for foreign constraint error
          if (err.original && err.original.errno == 1451) {
            res.status(422).send({ msg: "Foriegn key constraint" });
          } else {
            await t.rollback();
            serverError(res, req, err);
          }
        });
    }
  );
});

module.exports = router;
