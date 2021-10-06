const Sequelize = require("sequelize");

const env = require("../environment");
const config = require(__dirname + "/../config/config.json")[env];
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
//
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};
db.env = env;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

let files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

for (let file of files) {
  let parsedFileName = path.parse(file).name;
  let model = parsedFileName.charAt(0).toUpperCase() + parsedFileName.slice(1);
  db[model] = require(path.join(__dirname, file))(
    sequelize,
    Sequelize.DataTypes
  );
}

// Belongs to
db.MenuMaster.belongsTo(db.MenuGroup);
//Regions
db.State.belongsTo(db.Country, { foreignKey: "CountryID" });
db.User.belongsTo(db.Role, { foreignKey: "RoleID" });
db.City.belongsTo(db.State, { foreignKey: "StateID" });
db.City.belongsTo(db.Country, { foreignKey: "CountryID" });

//customer
db.Customer.belongsTo(db.Country, { foreignKey: "CountryID" });
db.Customer.belongsTo(db.City, { foreignKey: "CityID" });
db.Customer.belongsTo(db.State, { foreignKey: "StateID" });

//customer address
db.CustomerAddress.belongsTo(db.Country, { foreignKey: "CountryID" });
db.CustomerAddress.belongsTo(db.City, { foreignKey: "CityID" });
db.CustomerAddress.belongsTo(db.State, { foreignKey: "StateID" });
db.CustomerAddress.belongsTo(db.Customer, { foreignKey: "CustomerID" });

//supplier
db.Supplier.belongsTo(db.Country, { foreignKey: "CountryID" });
db.Supplier.belongsTo(db.City, { foreignKey: "CityID" });
db.Supplier.belongsTo(db.State, { foreignKey: "StateID" });

//Supplier warehouse
db.SupplierWarehouse.belongsTo(db.Country, { foreignKey: "CountryID" });
db.SupplierWarehouse.belongsTo(db.City, { foreignKey: "CityID" });
db.SupplierWarehouse.belongsTo(db.State, { foreignKey: "StateID" });
db.SupplierWarehouse.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

db.ProductSubgroup.belongsTo(db.ProductGroup, { foreignKey: "GroupID" });

//*****************PRODUCT PROPERTIES *********************************** */
db.ProductMaster.belongsTo(db.ProductSubgroup, { foreignKey: "SubGroupID" });
db.ProductMaster.belongsTo(db.ProductGroup, { foreignKey: "GroupID" });
db.ProductMaster.belongsTo(db.PaperClass, { foreignKey: "PaperClassID" });
db.ProductMaster.belongsTo(db.PaperPrintibility, {
  foreignKey: "PaperPrintibilityID",
});
db.ProductMaster.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.ProductMaster.belongsTo(db.PaperQuality, { foreignKey: "PaperQualityID" });
db.ProductMaster.belongsTo(db.MeasurementUnit, { foreignKey: "UomID" });
db.ProductMaster.belongsTo(db.PaperGsm, { foreignKey: "GsmID" });
db.ProductMaster.belongsTo(db.PaperGrain, { foreignKey: "GrainID" });
db.ProductMaster.belongsTo(db.PaperColor, { foreignKey: "ColorID" });
db.ProductMaster.belongsTo(db.PaperRies, { foreignKey: "RiesID" });
db.ProductMaster.belongsTo(db.PaperStrength, { foreignKey: "StrengthID" });
db.ProductMaster.belongsTo(db.RunningDirection, {
  foreignKey: "RunningDirectionID",
});
//*****************PRODUCT PROPERTIES *********************************** */

//con price
db.ConPrices.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });
db.ConPrices.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.ConPrices.belongsTo(db.SupplierWarehouse, { foreignKey: "WarehouseID" });

//regular price
db.RegularPrice.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });

db.OffersMaster.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });

//*****************     INQUIRY  *********************************** */
db.InquiryMaster.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.InquiryDetails.belongsTo(db.InquiryMaster, { foreignKey: "InquiryID" });
db.InquiryDetails.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });
db.InquiryDetails.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.InquirySuppliers.belongsTo(db.Supplier, { foreignKey: "ProductID" });
db.InquirySuppliers.belongsTo(db.InquiryMaster, { foreignKey: "InquiryID" });
db.InquiryMaster.belongsTo(db.CustomerAddress, { foreignKey: "AddressID" });
db.InquiryMaster.belongsTo(db.User, { foreignKey: "UserID" });
//*****************     INQUIRY  *********************************** */

//supplier quotes
db.SupplierQuote.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.SupplierQuote.belongsTo(db.InquiryMaster, { foreignKey: "InquiryID" });
db.SupplierQuote.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

//quote detail
db.QuotationDetails.belongsTo(db.InquiryMaster, { foreignKey: "InquiryID" });
db.QuotationDetails.belongsTo(db.QuotationMaster, {
  foreignKey: "QuotationID",
});
db.QuotationDetails.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });
db.QuotationDetails.belongsTo(db.SupplierWarehouse, {
  foreignKey: "WarehouseID",
});

//purchase PurchaseOrder

db.PurchaseOrder.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.PurchaseOrder.belongsTo(db.User, { foreignKey: "UserID" });
db.PurchaseOrder.belongsTo(db.CustomerAddress, { foreignKey: "AddressID" });
db.PurchaseOrder.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

// db.PurchaseOrderDetail.belongsTo(db.InquiryDetails, {
//   foreignKey: "InquiryDetailID",
// });
// db.PurchaseOrderDetail.belongsTo(db.QuotationDetails, {
//   foreignKey: "QuotationDetailID",
// });
// db.PurchaseOrderDetail.belongsTo(db.OffersMaster, { foreignKey: "OfferID" });

//po deletet status
db.PoDelStatus.belongsTo(db.PurchaseOrder, { foreignKey: "POID" });
db.PoDelStatus.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.PoDelStatus.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

//po payment status
db.PoPaymentStatus.belongsTo(db.PurchaseOrder, { foreignKey: "POID" });
db.PoPaymentStatus.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.PoPaymentStatus.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.ProductImages.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });

db.RegularPriceRange.belongsTo(db.RegularPrice, { foreignKey: "PriceID" });
db.RegularPrice.belongsTo(db.Group, { foreignKey: "GroupID" });

db.Group.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.CustomerGroup.belongsTo(db.Group, { foreignKey: "GroupID" });
db.CustomerGroup.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.CustomerGroup.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

//WAREHOUSE PRODUCT
db.WarehouseProducts.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.WarehouseProducts.belongsTo(db.SupplierWarehouse, {
  foreignKey: "WarehouseID",
});
db.WarehouseProducts.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });

//USER CART
db.UserCart.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });

/**
 * @Purchase_Order_Detail
 */
//belongs to
db.PurchaseOrderDetail.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.PurchaseOrderDetail.belongsTo(db.ProductMaster, {
  foreignKey: "ProductID",
});
db.PurchaseOrderDetail.belongsTo(db.SupplierWarehouse, {
  foreignKey: "WarehouseID",
});
db.PurchaseOrderDetail.belongsTo(db.InquiryMaster, { foreignKey: "InquiryID" });
db.PurchaseOrderDetail.belongsTo(db.QuotationDetails, {
  foreignKey: "QuotationDetailID",
});

db.PurchaseOrderDetail.belongsTo(db.QuotationMaster, {
  foreignKey: "QuotationID",
});
db.PurchaseOrderDetail.belongsTo(db.RegularPrice, { foreignKey: "PricingID" });

//has many
db.PurchaseOrder.hasMany(db.PurchaseOrderDetail, { foreignKey: "PoID" });
db.ProductMaster.hasMany(db.PurchaseOrderDetail, { foreignKey: "ProductID" });
db.SupplierWarehouse.hasMany(db.PurchaseOrderDetail, {
  foreignKey: "WarehouseID",
});
db.InquiryMaster.hasMany(db.PurchaseOrderDetail, { foreignKey: "InquiryID" });
db.QuotationDetails.hasMany(db.PurchaseOrderDetail, {
  foreignKey: "QuotationDetailID",
});
db.QuotationMaster.hasMany(db.PurchaseOrderDetail, {
  foreignKey: "QuotationID",
});
db.RegularPrice.hasMany(db.PurchaseOrderDetail, { foreignKey: "PricingID" });

/**
 * @Purchase_Order_Detail_End
 */

/**
 * @DISPATCH_ORDER
 */

db.DispatchOrder.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.PurchaseOrder.hasMany(db.DispatchOrder, { foreignKey: "PoID" });
db.DispatchOrder.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.Customer.hasMany(db.DispatchOrder, { foreignKey: "CustomerID" });
db.DispatchOrder.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.Supplier.hasMany(db.DispatchOrder, { foreignKey: "SupplierID" });

/**
 * @DISPATCH_ORDER_END
 */

/**
 * @DISPATCH_ORDER_DETAIL
 */
db.DispatchOrderDetail.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.DispatchOrderDetail.belongsTo(db.PurchaseOrderDetail, {
  foreignKey: "PoDetailID",
});
db.DispatchOrderDetail.belongsTo(db.ProductMaster, {
  foreignKey: "ProductID",
});
db.DispatchOrderDetail.belongsTo(db.DispatchOrder, {
  foreignKey: "DispatchID",
});
//has many
db.ProductMaster.hasMany(db.DispatchOrderDetail, {
  foreignKey: "ProductID",
});
db.PurchaseOrder.hasMany(db.DispatchOrderDetail, { foreignKey: "PoID" });
db.PurchaseOrderDetail.hasMany(db.DispatchOrderDetail, {
  foreignKey: "PoDetailID",
});

db.DispatchOrder.hasMany(db.DispatchOrderDetail, { foreignKey: "DispatchID" });
/**
 * @DISPATCH_ORDER_DETAIL_END
 */

/**
 * @Do_Detail_Quantity
 */
//belongs to
db.DoDetailQuantity.belongsTo(db.DispatchOrderDetail, {
  foreignKey: "DispatchOrderDetailID",
});
db.DoDetailQuantity.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.DoDetailQuantity.belongsTo(db.DispatchOrder, { foreignKey: "DispatchID" });
db.DoDetailQuantity.belongsTo(db.PurchaseOrderDetail, {
  foreignKey: "PoDetailID",
});
db.DoDetailQuantity.belongsTo(db.SupplierWarehouse, {
  foreignKey: "WarehouseID",
});
db.DoDetailQuantity.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });
//has many
db.DispatchOrderDetail.hasMany(db.DoDetailQuantity, {
  foreignKey: "DispatchOrderDetailID",
});
db.PurchaseOrder.hasMany(db.DoDetailQuantity, { foreignKey: "PoID" });
db.DispatchOrder.hasMany(db.DoDetailQuantity, { foreignKey: "DispatchID" });
db.PurchaseOrderDetail.hasMany(db.DoDetailQuantity, {
  foreignKey: "PoDetailID",
});
db.SupplierWarehouse.hasMany(db.DoDetailQuantity, {
  foreignKey: "WarehouseID",
});
db.ProductMaster.hasMany(db.DoDetailQuantity, { foreignKey: "ProductID" });
/**
 * @Do_Detail_Quantity
 */

/**
 * @Reserved_Quanity
 */
//belongs to
db.ReservedQuantity.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.ReservedQuantity.belongsTo(db.PurchaseOrderDetail, {
  foreignKey: "PoDetailID",
});
db.ReservedQuantity.belongsTo(db.ProductMaster, { foreignKey: "ProductID" });
//has many
db.PurchaseOrder.hasMany(db.ReservedQuantity, { foreignKey: "PoID" });
db.PurchaseOrderDetail.hasMany(db.ReservedQuantity, {
  foreignKey: "PoDetailID",
});
db.ProductMaster.hasMany(db.ReservedQuantity, { foreignKey: "ProductID" });
/**
 * @Reserved_Quanity
 */

// Has many
db.MenuGroup.hasMany(db.MenuMaster);

db.Country.hasMany(db.State, { foreignKey: "CountryID" });

db.Role.hasMany(db.User, { foreignKey: "RoleID" });

db.State.hasMany(db.City, { foreignKey: "StateID" });
db.Country.hasMany(db.City, { foreignKey: "CountryID" });

db.Country.hasMany(db.Supplier, { foreignKey: "CountryID" });
db.City.hasMany(db.Supplier, { foreignKey: "CityID" });
db.State.hasMany(db.Supplier, { foreignKey: "StateID" });

db.Country.hasMany(db.SupplierWarehouse, { foreignKey: "CountryID" });
db.City.hasMany(db.SupplierWarehouse, { foreignKey: "CityID" });
db.State.hasMany(db.SupplierWarehouse, { foreignKey: "StateID" });
db.Supplier.hasMany(db.SupplierWarehouse, { foreignKey: "SupplierID" });

//*****************PRODUCT PROPERTIES *********************************** */
db.ProductGroup.hasMany(db.ProductMaster, { foreignKey: "GroupID" });
db.ProductSubgroup.hasMany(db.ProductMaster, { foreignKey: "SubGroupID" });
db.PaperClass.hasMany(db.ProductMaster, { foreignKey: "PaperClassID" });
db.PaperPrintibility.hasMany(db.ProductMaster, {
  foreignKey: "PaperPrintibilityID",
});
db.PaperQuality.hasMany(db.ProductMaster, { foreignKey: "PaperQualityID" });
db.MeasurementUnit.hasMany(db.ProductMaster, { foreignKey: "UomID" });
db.PaperGsm.hasMany(db.ProductMaster, { foreignKey: "GsmID" });
db.PaperGrain.hasMany(db.ProductMaster, { foreignKey: "GrainID" });
db.PaperColor.hasMany(db.ProductMaster, { foreignKey: "ColorID" });
db.PaperRies.hasMany(db.ProductMaster, { foreignKey: "RiesID" });
db.PaperStrength.hasMany(db.ProductMaster, { foreignKey: "StrengthID" });
db.RunningDirection.hasMany(db.ProductMaster, {
  foreignKey: "RunningDirectionID",
});
db.ProductMaster.hasMany(db.ProductImages, { foreignKey: "ProductID" });
//*****************PRODUCT PROPERTIES *********************************** */

db.ProductMaster.hasMany(db.ConPrices, { foreignKey: "ProductID" });
db.Supplier.hasMany(db.ConPrices, { foreignKey: "SupplierID" });
db.SupplierWarehouse.hasMany(db.ConPrices, { foreignKey: "WarehouseID" });

db.ProductMaster.hasMany(db.RegularPrice, { foreignKey: "ProductID" });
db.Supplier.hasMany(db.ProductMaster, { foreignKey: "SupplierID" });

db.ProductMaster.hasMany(db.OffersMaster, { foreignKey: "ProductID" });

db.Customer.hasMany(db.InquiryMaster, { foreignKey: "CustomerID" });

db.ProductMaster.hasMany(db.InquiryDetails, { foreignKey: "ProductID" });
db.InquiryMaster.hasMany(db.InquiryDetails, { foreignKey: "InquiryID" });
db.Supplier.hasMany(db.InquiryDetails, { foreignKey: "SupplierID" });

db.InquiryMaster.hasMany(db.InquirySuppliers, { foreignKey: "InquiryID" });
db.ProductMaster.hasMany(db.InquirySuppliers, { foreignKey: "ProductID" });

db.Customer.hasMany(db.SupplierQuote, { foreignKey: "CustomerID" });
db.InquiryMaster.hasMany(db.SupplierQuote, { foreignKey: "InquiryID" });
db.InquiryMaster.hasMany(db.QuotationMaster, { foreignKey: "InquiryID" });
db.Supplier.hasMany(db.SupplierQuote, { foreignKey: "SupplierID" });

db.InquiryMaster.hasMany(db.QuotationDetails, { foreignKey: "InquiryID" });
db.ProductMaster.hasMany(db.QuotationDetails, { foreignKey: "ProductID" });
db.SupplierWarehouse.hasMany(db.QuotationDetails, {
  foreignKey: "WarehouseID",
});

//purchase order

db.Supplier.hasMany(db.PurchaseOrder, { foreignKey: "SupplierID" });
db.Customer.hasMany(db.PurchaseOrder, { foreignKey: "CustomerID" });
db.User.hasMany(db.PurchaseOrder, { foreignKey: "UserID" });
db.CustomerAddress.hasMany(db.PurchaseOrder, { foreignKey: "AddressID" });

// db.InquiryDetails.hasMany(db.PurchaseOrderDetail, {
//   foreignKey: "InquiryDetailID",
// });
// db.QuotationDetails.hasMany(db.PurchaseOrderDetail, {
//   foreignKey: "QuotationDetailID",
// });
// db.OffersMaster.hasMany(db.PurchaseOrderDetail, { foreignKey: "OfferID" });

db.PurchaseOrder.hasMany(db.PoPaymentStatus, { foreignKey: "POID" });
db.Customer.hasMany(db.PoPaymentStatus, { foreignKey: "CustomerID" });
db.Supplier.hasMany(db.PoPaymentStatus, { foreignKey: "SupplierID" });

db.PurchaseOrder.hasMany(db.PoPaymentStatus, { foreignKey: "POID" });
db.Customer.hasMany(db.PoPaymentStatus, { foreignKey: "CustomerID" });
db.Supplier.hasMany(db.PoPaymentStatus, { foreignKey: "SupplierID" });

db.RegularPrice.hasMany(db.RegularPriceRange, { foreignKey: "PriceID" });
db.Group.hasMany(db.RegularPrice, { foreignKey: "GroupID" });
db.Customer.hasMany(db.CustomerGroup, { foreignKey: "CustomerID" });

//WAREHOUSE PRODUCTS
db.Supplier.hasMany(db.WarehouseProducts, { foreignKey: "SupplierID" });
db.ProductMaster.hasMany(db.WarehouseProducts, { foreignKey: "ProductID" });
db.SupplierWarehouse.hasMany(db.WarehouseProducts, {
  foreignKey: "WarehouseID",
});

//customer address
db.Customer.hasMany(db.CustomerAddress, { foreignKey: "CustomerID" });

//USER CART
db.ProductMaster.hasMany(db.UserCart, { foreignKey: "ProductID" });

//QUOTATION
db.QuotationMaster.hasMany(db.QuotationDetails, { foreignKey: "QuotationID" });

/**
 * @Order_Status_Log
 */
db.PurchaseOrder.hasMany(db.OrderStatusLog, { foreignKey: "PoID" });
db.PurchaseOrderDetail.hasMany(db.OrderStatusLog, { foreignKey: "PoDetailID" });
db.OrderStatusLog.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.OrderStatusLog.belongsTo(db.PurchaseOrderDetail, {
  foreignKey: "PoDetailID",
});

/**
 * @Order_Status_Log
 */

/**
 * @Notification
 */
//hasmany
db.Supplier.hasMany(db.Notification, { foreignKey: "SupplierID" });
db.Customer.hasMany(db.Notification, { foreignKey: "CustomerID" });
db.Role.hasMany(db.Notification, { foreignKey: "RoleID" });
//belongs to
db.Notification.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.Notification.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.Notification.belongsTo(db.Role, { foreignKey: "RoleID" });
/**
 * @Notification
 */

/**
 * @order_qty_data
 */
db.OrderQtyData.belongsTo(db.PurchaseOrder, { foreignKey: "PoID" });
db.OrderQtyData.belongsTo(db.PurchaseOrderDetail, { foreignKey: "PoDetailID" });
db.OrderQtyData.belongsTo(db.SupplierWarehouse, { foreignKey: "WarehouseID" });

db.PurchaseOrder.hasMany(db.OrderQtyData, { foreignKey: "PoID" });
db.PurchaseOrderDetail.hasMany(db.OrderQtyData, { foreignKey: "PoDetailID" });
db.SupplierWarehouse.hasMany(db.OrderQtyData, { foreignKey: "WarehouseID" });
/**
 * @order_qty_data
 */

/**
 * @terms START
 */
db.Terms.belongsTo(db.Supplier, { foreignKey: "SupplierID" });
db.Supplier.hasMany(db.Terms, { foreignKey: "SupplierID" });
db.QuotationDetails.belongsTo(db.Terms, { foreignKey: "Terms" });

/**
 * @terms END
 */

/**
 * @Chat
 */
db.Chat.belongsTo(db.Customer, { foreignKey: "CustomerID" });
db.Chat.belongsTo(db.Supplier, { foreignKey: "SupplierID" });

db.Customer.hasMany(db.Chat, { foreignKey: "CustomerID" });
db.Customer.hasMany(db.Chat, { foreignKey: "SupplierID" });

/**
 * @chat_Messages
 */
db.ChatMessages.belongsTo(db.Chat, { foreignKey: "ChatID" });
db.ChatMessages.belongsTo(db.User, { foreignKey: "UserID" });
//hasmany
db.Chat.hasMany(db.ChatMessages, { foreignKey: "ChatID" });
db.User.hasMany(db.ChatMessages, { foreignKey: "UserID" });

/**
 * @chat_Messages
 */

module.exports = db;
