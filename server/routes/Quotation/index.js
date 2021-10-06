const express = require("express");
const { successResponse, serverError } = require("../../helpers/response");
const router = express.Router();
const auth = require("../../middlewares/jwtauth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const {
  sequelize,
  QuotationMaster,
  QuotationDetails,
  InquiryDetails,
  Notification,
} = require("../../models");
const {
  notificationTypes,
  ROLE_ID,
  NOTIFICATION_KEY_CUSTOMER,
} = require("../../helpers/commonHelper");
/**
 * @param {Object} inquiryData inquiry data from inquiry master table
 * @Create_and_emit_notification for customer
 */
const emitNotification = (inquiryData, req) => {
  const { CustomerID, UserID, InquiryNo } = inquiryData;


  Notification.create({
    NotificationType: notificationTypes.Quotation, //from common helper
    Title: "New quotation recieved",
    CustomerID, //reference id from the user master table
    SupplierID: req.user.referenceID, //reference id from the user master table
    RoleID: ROLE_ID.CUSTOMER, //from commonhelper
    Reference: JSON.stringify({ for: "Customer" }),
    Description: `Inquiry No : ${InquiryNo}`,
  })
    /**
     * @Get_All_Notification_Count
     */
    .then((result) => {
      return Notification.findAndCountAll({
        where: {
          SupplierID: req.user.referenceID,
          CustomerID,
          Read: 0,
        },
        group: ["NotificationType"],
        limit: 1,
      });
    })
    /**
     * @Emit_Notification and send success response
     */
    .then(async (notification) => {
      //emit notification to relevant user

      console.log("NOTIFICATION COUNT === ", notification.count.length);

      console.log("MY SOCKET === ", req.sockets.get(UserID.toString()));

      let socketID = req.sockets.get(UserID.toString());

      req.io.to(socketID).emit(NOTIFICATION_KEY_CUSTOMER, {
        notificationCount: notification.count.length,
        msg: `new quotation`,
        title: "New Quotation Recieved",
        RefID: CustomerID, //id from inquiry master
      });
    });
};

//add new Quotation
//hasmukh 01/04/2021
router.post("/addQuotation", auth, async (req, res) => {
  const { quotationData, inquiryDetails, inquiryData, Status } = req.body;

  //console.log("req.body.......", req.user);

  const t = await sequelize.transaction();
  //create new quotation in quotationMaster
  await QuotationMaster.create(
    {
      SupplierID: req.user.referenceID,
      QuotationNo: quotationData.QuotationNo,
      InquiryID: inquiryData.InqID,
      Status,
      createdBy: req.user.referenceID,
    },
    { transaction: t }
  )
    .then(async (quotation) => {
      let productDetail = [];
      let productDetailIds = [];
      for (let item of inquiryDetails) {
        const {
          ID,
          ProductID,
          Quantity,
          Price,
          Terms,
          Remarks,
          Unit,
          ExpectedDeliveryDate,
          Amount
        } = item;
        let obj = {
          QuotationID: quotation.dataValues.ID,
          ProductID,
          Quantity,
          Price,
          Unit,
          ExpectedDeliveryDate,
          Terms,
          Remarks,
          createdBy: req.user.referenceID,
          Amount
        };

        productDetailIds.push(ID);

        productDetail.push(obj);
      }

      console.log("productDetailIds......", productDetailIds);

      /**
       * update inquiry details table item wise IsQuoted = 1
       */

      //store product details of this quotation in detail table
      await QuotationDetails.bulkCreate(productDetail, { transaction: t })
        .then(async (quotationDetail) => {
          await InquiryDetails.update(
            { IsQuoted: 1 },
            { where: { ID: { [Op.in]: productDetailIds } } }
          )
            .then(async (updateInqIsQuoted) => {
              if (Status == "sent") {
                //console.log("Status === ", Status);
                emitNotification(inquiryData, req);
              }

              successResponse(
                res,
                req,
                quotationDetail,
                Status == "draft"
                  ? "Quotation saved to draft successfully"
                  : "Quotation Sent successfully"
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

//get all quotations
//hasmukh 01/04/2021
router.post("/getAllQuotations", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;

  //console.log("supplier ..............", req.user);

  await QuotationMaster.findAndCountAll({
    where: { SupplierID: req.user.referenceID, IsDelete: 0, IsActive: 1 },
    //include: [{ model: Customer, attributes: ["CustomerName"] }],
    limit,
    offset,
  })
    .then((quotations) => {
      successResponse(res, req, quotations, "All Quotations");
    })
    .catch((err) => serverError(res, req, err));
});

//get single quotation
//hasmukh 01/04/2021

router.get("/getSingleQuotation/:id", auth, async (req, res) => {
  await QuotationDetails.findAll({
    where: { QuotationID: req.params.id },
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
    .then((quotationDetail) =>
      successResponse(res, req, quotationDetail, "quotation Detail")
    )
    .catch((err) => serverError(res, req, err));
});

//update quotation
//hasmukh 01/04/2021
router.post("/updateQuotation/:id", auth, async (req, res) => {
  const { inquiryDetails, quotationData, Status, inquiryData } = req.body;

  const t = await sequelize.transaction();

  await QuotationMaster.update(
    {
      QuotationNo: quotationData.QuotationNo,
      Status,
      updatedBy: req.user.referenceID,
    },
    { where: { ID: req.params.id } }
  )
    .then(async (result) => {
      await QuotationDetails.destroy({ where: { QuotationID: req.params.id } })
        .then(async (data) => {
          let productDetail = [];
          let productDetailIds = [];
          for (let item of inquiryDetails) {
          
            const {
              ID,
              ProductID,
              Quantity,
              Price,
              Terms,
              Remarks,
              Unit,
              ExpectedDeliveryDate,
              Amount
            } = item;
            let obj = {
              QuotationID: req.params.id,
              ProductID,
              Quantity,
              Price,
              Unit,
              ExpectedDeliveryDate,
              Terms,
              Remarks,
              Amount,
              updatedBy: req.user.referenceID,
            };
            productDetailIds.push(ID);
            productDetail.push(obj);
          }

          //store product details of this quotation in detail table
          await QuotationDetails.bulkCreate(productDetail, { transaction: t })
            .then(async (quotationDetail) => {
              await InquiryDetails.update(
                { IsQuoted: 1 },
                { where: { ID: { [Op.in]: productDetailIds } } }
              )
                .then(async (updateInqIsQuoted) => {
                  if (Status == "sent") {
                    //console.log("Status === ", Status);
                    emitNotification(inquiryData, req);
                  }
                  successResponse(
                    res,
                    req,
                    quotationDetail,
                    Status == "draft"
                      ? "Quotation saved to draft successfully"
                      : "Quotation Sent successfully"
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
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

module.exports = router;
