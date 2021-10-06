const config = require("config");
require("dotenv").config();
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const fs = require("fs");
const handleBars = require("handlebars");
const { env } = require("../models");
const CustomConfig = require(__dirname + "/../config/config.json")[env];
let ClientUrl = CustomConfig.client;
let NOTIFICATION_KEY = "PAPERBIRD_NOTIFICATION";
const NOTIFICATION_KEY_CUSTOMER = "PAPERBIRD_CUSTOMER_NOTIFICATION";

const { validationResult } = require("express-validator");

/**
 * @fixedIdList for paperbird database
 */
const fixedIdList = {
  groupStandardId: 1,
  groupConsortiumId: 2,
};

// mail setup //
const nodemailerTransporter = nodemailer.createTransport({
  //service: "gmail",
  host: process.env.SENDER_EMAIL_HOST,
  port: process.env.SENDER_EMAIL_PORT,
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

codeGenerator = () => {
  let randomCode = Math.floor(100000 + Math.random() * 900000);
  return randomCode;
};

encryptData = (code) => {
  let codeHash = code.toString();
  var ciphertext = crypto.AES.encrypt(
    codeHash,
    config.get("secret")
  ).toString();
  return ciphertext;
};

// function encrypt(msg) {
//   var salt = CryptoJS.lib.WordArray.random(128 / 8);

//   var key = CryptoJS.PBKDF2(config.get("secret"), salt, {
//     keySize: keySize / 32,
//     iterations: iterations,
//   });

//   var iv = CryptoJS.lib.WordArray.random(128 / 8);

//   var encrypted = CryptoJS.AES.encrypt(msg, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC,
//   });

//   // salt, iv will be hex 32 in length
//   // append them to the ciphertext for use  in decryption
//   var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
//   return transitmessage;
// }

// decryptData = (data) => {
//   var bytes = crypto.AES.decrypt(data, config.get("secret"));
//   var decryptedData = bytes.toString(crypto.enc.Utf8);
//   return decryptedData;
// };

// var serviceAccount = notoficationCredentials;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://orient-244de.firebaseio.com",
// });

// sendNotificationToDevice = function (
//   registrationTokensArray,
//   payLoadObj,
//   isUpdateAfterResult = false
// ) {
//   // console.log(registrationTokensArray,payLoadObj, "check this");
//   if (registrationTokensArray.length > 999) {
//     var chunk = 999;
//     var tempArray = [];
//     var executeOnce = false;
//     for (let i = 0; i < registrationTokensArray.length; i += chunk) {
//       tempArray = registrationTokensArray.slice(i, i + chunk);
//       const message = {
//         notification: payLoadObj,
//         tokens: tempArray,
//       };
//       admin
//         .messaging()
//         .sendMulticast(message)
//         .then((res) => {
//           console.log(res, "this is responce");
//         });
//     }
//   } else {
//     if (registrationTokensArray.length) {
//       const message = {
//         notification: payLoadObj,
//         tokens: registrationTokensArray,
//       };

//       admin
//         .messaging()
//         .sendMulticast(message)
//         //  admin.messaging().send(message)
//         .then((response) => {
//           console.log(response, "this is response");
//           if (!response.responses[0].success) {
//             console.log(response.responses[0].error);
//           }
//           console.log("Successfully sent message");
//           return response;
//         })
//         .catch((error) => {
//           console.log("Error sending message:", error);
//         });
//     }
//   }
// };

// 5 digit code
//Math.floor(Math.random()*90000) + 10000;

// 8 digit password
const generatePassword = (length, chars) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

//send mail with html file
const sendEmailHTML = async (mailData) => {
  //console.log("mail options == ", mailData);

  fs.readFile(
    `template/${mailData.htmlFile}.html`,
    { encoding: "utf8" },
    function (err, html) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        var template = handleBars.compile(html);

        var htmlToSend = template(mailData.replacements);
        var mailOptions = {
          from: process.env.SENDER_EMAIL_ID,
          to: mailData.receiver,
          subject: mailData.subject,
          html: htmlToSend,
        };
        //console.log("mail options == ", mailOptions);
        smtpTransport.sendMail(mailOptions, async function (err, response) {
          if (err) {
            console.log("ERROR == ", err);
            return false;
          } else {
            console.log("Responce == ", response);
            return true;
          }
        });
      }
    }
  );
};

//send mail without html
const sendEmail = (mailData) => {
  let mailOptions = {
    from: mailData.sender,
    to: mailData.receiver,
    subject: mailData.subject,
    text: mailData.text,
  };

  //console.log("Mail Object ... ", mailOptions);

  nodemailerTransporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("MAIL ERROR: ----- ", error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

//Paperbird admin routes
let paperbirdAdminRoutes = {
  paperClass: `paperClass`,
  paperColor: `paperColor`,
  strength: `strength`,
  ries: `ries`,
  uom: `uom`,
  profile: `profile`,
  productGroup: `productGroup`,
  supplier: `supplier`,
  customer: `customer`,
  product: `product`,
  country: `country`,
  state: `state`,
  city: `city`,
  productSubGroup: `productSubGroup`,
  paperPrintibility: `paperPrintibility`,
  runningDirection: `runningDirection`,
  warehouses: `warehouses`,
  groups: `groups`,
  ordersPending: `orders/pending`,
  allOrders: `orders/all`,
  inquiry_: `inquiry_`,
  bInquiry: `bInquiry`,
  paperQuality: `paperQuality`,
  paperGsm: `paperGsm`,
  paperGrain: `paperGrain`,
  conversions: `conversions`,
  offermaster: `offermaster`,
  pricing: `pricing`,
  role: `role`,
  adminusers: `adminusers`,
  ordersNew: `orders/new`,
  dashboardSupplier: `dashboard/supplierdashboard`,
  target_: `target_`,
  customerTarget: `customerTarget`,
  payments_: `payments_`,
  creditPolicy: `creditPolicy`,
  distanceMatrix: `distanceMatrix`,
  supplierTarget: `customerTargets`,
  targetYear: `targetYear`,
  notification: `notification`,
};

let PaperbirdRoutes = {
  CustomerRoutes: "MyOrders",
  InquiryRoutes: "MyInquiries",
  MyInquiryRoutes: "MyInquiries",
};

/**
 * @Notification types String before - is message and string after - is redirect path of frontend
 */

const notificationTypes = {
  SupplierRegistration: `New Supplier Registered-${paperbirdAdminRoutes.supplier}`,
  Chat: "New Messages-chatWindow",
  NewOrder: `New Order Recieved-${paperbirdAdminRoutes.ordersNew}`,
  NewInquiry: `New Inquiry Recieved-${paperbirdAdminRoutes.bInquiry}`,
  OrderUpdate: `Order Update-${PaperbirdRoutes.CustomerRoutes}`,
  InquiryUpdate: `Inquiry Update-${PaperbirdRoutes.InquiryRoutes}`,
  Quotation: `New Quotation Received-${PaperbirdRoutes.MyInquiryRoutes}`,
};

//order status
const ORDER_STATUS = {
  pending: "Pending",
  confirm: "Confirm",
  reject: "Reject",
  inProgress: "InProgress",
  dispatched: "Dispatched",
  delivered: "Delivered",
  canceled: "Canceled",
  partialConfirm: "PartialConfirm",
  partialDispatch: "PartialDispatch",
  partialDelivery: "PartialDelivery",
};

//dispatch order status
const DISPATCH_STATUS = {
  draft: "draft",
  confirm: "confirm",
  cancel: "cancel",
  delivered: "delivered",
};

//type of uoms for product
const UOM_TYPES = {
  sheets: "Sheets",
  ries: "Ries",
  pallete: "Pallete",
  rolls: "Rolls",
  carton: "Carton", //only for display when Rolls
};

//rolltype if uom is rolls
let rollType = {
  rolls: "rolls",
  kg: "kg",
};

//role id of users
const ROLE_ID = {
  ADMIN: 1,
  SUPPLIER: 2,
  CUSTOMER: 3,
};

const QUOTATION_STATUS = {
  SENT: "sent",
  DRAFT: "draft",
};

const TERMS = {
  payment: "PaymentTerms",
  delivery: "DeliveryTerms",
};


const SOCKET_KEYS = {
  CHECK_USER_STATUS: 'CHECK_USER_STATUS',
  SEND_STATUS_UPDATE: 'SEND_STATUS_UPDATE',
  JOIN: 'JOIN',
  SEND_MESSAGE: "SEND_MESSAGE",
  MESSAGE: "MESSAGE",
  TYPING: "TYPING",
  ON_TYPING: "ON_TYPING",
  STOP_TYPING: "STOP_TYPING",
  ON_STOP_TYPING: "ON_STOP_TYPING"
}

const CHAT_TYPES = {
  CUSTOMER:"Customer",
  SUPPLIER: "Supplier"
}
const MODELNAME = {
  country: "Country",
  state: "State",
  city: "City",
  productGroup: "Product_Group",
  productSubgroup: "Product_Subgroup",
  color: "Paper_Color",
  class: "Paper_Class",
  printibility: "Paper_Printibility",
  quality: "Paper_Quality",
  GSM: "Paper_Gsm",
  grain: "Paper_Grain"
}

/**
 * @customValidationFunction check validate or not
 * @param {Array} validations pass all validation field list
 * @returns check validate or not (validate if true then return to the original fun else return status code 422)
 */
const customValidationFun = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(422)
      .send({ status: 0, errors: errors.array(), msg: errors.array()[0].msg });
  };
};

const checkUnique = async (req, res, model) => {

  const common = { IsDelete: 0 };

  switch (model.name) {
    case MODELNAME.country:
      return await model
        .findAndCountAll({ where: { Country: req.body.Country, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.state:
      return await model
        .findAndCountAll({
          where: {
            State: req.body.State,
            CountryID: req.body.CountryID,
            ...common,
          },
        })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.city:
      return await model
        .findAndCountAll({
          where: {
            City: req.body.City,
            StateID: req.body.StateID,
            CountryID: req.body.CountryID,
            ...common,
          },
        })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.productGroup:
      return await model
        .findAndCountAll({ where: { ProductGroup: req.body.ProductGroup, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.productSubgroup:
      return await model
        .findAndCountAll({
          where: {
            ProductSubgroup: req.body.ProductSubgroup,
            GroupID: req.body.GroupID,
            ...common,
          },
        })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.color:
      return await model
        .findAndCountAll({ where: { PaperColor: req.body.PaperColor, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });
    
    case MODELNAME.class:
      return await model
        .findAndCountAll({ where: { PaperClass: req.body.PaperClass, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });
        
    case MODELNAME.printibility:
      return await model
        .findAndCountAll({ where: { PaperPrintibility: req.body.PaperPrintibility, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.quality:
      return await model
        .findAndCountAll({ where: { PaperQuality: req.body.PaperQuality, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.GSM:
      return await model
        .findAndCountAll({ where: { PaperGsm: req.body.PaperGsm, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });

    case MODELNAME.grain:
      return await model
        .findAndCountAll({ where: { PaperGrain: req.body.PaperGrain, ...common } })
        .then((result) => {
          if (result.count) return true;
          else return false;
        }, (err) => { return true });


    default:
      return false;
  }
};

// excel file formats stored in server
const FILENAMES = {
  pricing: 'product_pricing.xlsx',
  pricingCopy: 'product_pricing_copy.xlsx',
};


module.exports = {
  codeGenerator,
  sendEmail,
  sendEmailHTML,
  generatePassword,
  notificationTypes,
  ORDER_STATUS,
  ClientUrl,
  NOTIFICATION_KEY,
  DISPATCH_STATUS,
  ROLE_ID,
  fixedIdList,
  customValidationFun,
  UOM_TYPES,
  rollType,
  NOTIFICATION_KEY_CUSTOMER,
  nodemailerTransporter,
  checkUnique,
  TERMS,
  FILENAMES,
  SOCKET_KEYS,
  CHAT_TYPES
};
