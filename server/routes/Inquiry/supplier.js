const express = require("express");
const { successResponse, serverError } = require("../../helpers/response");
const router = express.Router();
const auth = require("../../middlewares/jwtauth");

const { getWhereCondition } = require("../../helpers/createQuery");
const {
  Supplier,
  sequelize,
  ProductMaster,
  Sequelize,
  InquiryDetails,
  QuotationMaster,
  QuotationDetails,
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
  Terms,
  Group
} = require("../../models");
const { TERMS } = require("../../helpers/commonHelper");

//get all supplier inq
router.post("/getInquiries", auth, async (req, res) => {
  let { limit, page, filter } = req.body;
  let offset = (page - 1) * limit;
  let filterObj = filter ? JSON.parse(filter) : null;

  let where = "1=1";
  isPending = false;
  let myFilter = {
    "Inquiry_Master.IsDelete": 0,
    "Inquiry_Master.IsActive": 1,
    "Inquiry_Master.Status != ": "'draft'",
  };

  filterObj["InquiryNo"]
    ? (myFilter["Inquiry_Master.InquiryNo LIKE"] =
        " '%" + filterObj["InquiryNo"] + "%'")
    : "";
  filterObj["CustomerName"]
    ? (myFilter["Customer.CustomerName LIKE"] =
        " '%" + filterObj["CustomerName"] + "%'")
    : "";
  filterObj["InqStatus"]
    ? (myFilter["Inquiry_Master.Status"] = " '" + filterObj["InqStatus"] + "'")
    : "";

  filterObj["Date"]
    ? (myFilter["DATE(Inquiry_Master.Date)"] = " '" + filterObj["Date"] + "'")
    : "";
  filterObj["ValidTill"]
    ? (myFilter["DATE(Inquiry_Master.ValidTill)"] =
        " '" + filterObj["ValidTill"] + "'")
    : "";

  if (filterObj["InqStatus"]) {
    // check filter for inquiry-status
    if (filterObj["InqStatus"] == "sent") {
      myFilter["Inquiry_Master.Status"] = " '" + filterObj["InqStatus"] + "'";
    } else if (filterObj["InqStatus"] == "cancel") {
      myFilter["Inquiry_Master.Status"] = " '" + filterObj["InqStatus"] + "'";
    }
  }

  if (filterObj["QuoStatus"]) {
    // check filter for quotation-status
    if (filterObj["QuoStatus"] == "sent" || filterObj["QuoStatus"] == "draft") {
      myFilter["Quotation_Master.Status"] = " '" + filterObj["QuoStatus"] + "'";
    } else if (filterObj["QuoStatus"] == "cancel") {
      myFilter["Inquiry_Master.Status"] = " '" + filterObj["QuoStatus"] + "'";
    } else if (filterObj["QuoStatus"] == "pending") {
      // quotation status filter is pending
      myFilter["Quotation_Master.Status IS NULL "] = "";
      isPending = true;
    }
  }

  let myWhere = getWhereCondition(myFilter);

  if (myWhere) {
    // use the mywhere condtions
    where = `${myWhere} AND FIND_IN_SET(Inquiry_Master.ID, (SELECT GROUP_CONCAT(DISTINCT InquiryID) AS InquiryID FROM Inquiry_Details AS Inquiry_Details 
    WHERE Inquiry_Details.SupplierID = ${req.user.referenceID} AND Inquiry_Details.IsDelete = 0 AND Inquiry_Details.IsActive = 1
    GROUP BY SupplierID))`;
  }

  if (isPending) {
    //quotation status filter is pending
    if (myWhere) {
      where = `${myWhere} AND FIND_IN_SET(Inquiry_Master.ID, (SELECT GROUP_CONCAT(DISTINCT InquiryID) AS InquiryID FROM Inquiry_Details AS Inquiry_Details 
      WHERE Inquiry_Details.SupplierID = ${req.user.referenceID} AND Inquiry_Details.IsDelete = 0 AND Inquiry_Details.IsActive = 1 AND Inquiry_Details.IsQuoted = 0
      GROUP BY SupplierID))`;
    }

  }


  sequelize
    .query(
      `SELECT Inquiry_Master.*, Inquiry_Master.ID AS InqID, Inquiry_Master.Status AS InqStatus, Customer.CustomerName, Customer.Email AS CustEmail, Customer.Address AS CustAddress, Customer.ZipCode AS CustZipCode, Quotation_Master.ID AS QuoID, Quotation_Master.Status AS QuoStatus, (SELECT COUNT(Inquiry_Master.ID) FROM Inquiry_Master WHERE ${where}) AS TotalCount 
      FROM Inquiry_Master 

      INNER JOIN Customer ON Inquiry_Master.CustomerID = Customer.ID 
      LEFT JOIN Quotation_Master ON Inquiry_Master.ID = Quotation_Master.InquiryID AND Quotation_Master.SupplierID = ${req.user.referenceID}
      
      WHERE ${where} ORDER BY Inquiry_Master.ID DESC LIMIT ${offset}, ${limit}`,

      {
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    .then((inquiries) => {
      successResponse(res, req, inquiries, "All inquiries");
    })
    .catch((err) => serverError(res, req, err));
});

//get single inquiry
router.get("/singleInquiry/:id", auth, async (req, res) => {
  try {
    await InquiryDetails.findAll({
      where: { InquiryID: req.params.id, SupplierID: req.user.referenceID },
      //include: [{ model: Supplier }, { model: ProductMaster }],
      include: [
        { model: Supplier },
        {
          model: ProductMaster,
          include: [
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

            {
              model: RegularPrice,
              include: [{model: Group}, { model: RegularPriceRange }],
              where: { IsActive: 1 },
            },
          ],
        },
      ],
    })
      .then(async (singleInquiry) => {
        //console.log(singleInquiry);
        await QuotationMaster.findAll({
          where: { InquiryID: req.params.id, SupplierID: req.user.referenceID },

          include: [
            {
              model: QuotationDetails,
              include: [
                { model: Terms, attributes: ["ID", "Description", "Code"] },
              ],
            },
          ],
        })
          .then((quotation) => {
            const finalRes = { singleInquiry, quotation };

            successResponse(res, req, finalRes, "single Inquiry");
          })
          .catch((err) => serverError(res, req, err));
      })
      .catch((err) => serverError(res, req, err));
  } catch (error) {
    serverError(res, req, error);
  }
});

//get all terms for perticular supplier
router.get("/getAllTerms", auth, async (req, res) => {
  await Terms.findAndCountAll({
    where: {
      SupplierID: req.user.referenceID,
      IsDelete: 0,
      IsActive: 1,
      Type: TERMS.payment,
    },

    order: [["ID", "DESC"]],
  })
    .then((inquiries) => {
      successResponse(res, req, inquiries, "All terms of the supplier");
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
