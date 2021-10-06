const express = require("express");
const {
  successResponse,
  serverError,
  other,
} = require("../../helpers/response");
const router = express.Router();
const {
  State,
  City,
  Country,
  PurchaseOrder,
  PurchaseOrderDetail,
  sequelize,
  ProductMaster,
  ProductImages,
  Supplier,
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
  Customer,
  CustomerAddress,
  OrderStatusLog,
  Sequelize,
  DispatchOrderDetail,
  DispatchOrder,
  WarehouseProducts,
  SupplierWarehouse,
  Notification,
  ReservedQuantity,
  OrderQtyData,
  InquiryMaster,
  QuotationMaster,
  User,
  QuotationDetails,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const {
  ORDER_STATUS,
  DISPATCH_STATUS,
  notificationTypes,
  ROLE_ID,
  NOTIFICATION_KEY,
  UOM_TYPES,
  NOTIFICATION_KEY_CUSTOMER,
} = require("../../helpers/commonHelper");

/**
 * @param {number} supplierID reference id from the user master table
 * @Create_and_emit_notification for supplier
 */
const emitNotification = (SupplierID, req) => {
  Notification.create({
    NotificationType: notificationTypes.NewOrder, //from common helper
    Title: "New order recieved",
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
        title: "New order recieved",
        RefID: SupplierID, //id from user master
      });
    });
};

/**
 * @param {Object} orderData order data from order master table
 * @Create_and_emit_notification for customer
 */
const emitNotificationToCustomer = (orderData, latestStatus, req) => {
  const { CustomerID, UserID, PurchaseOrderNo } = orderData;

  console.log("orderData ==== ", orderData);

  Notification.create({
    NotificationType: notificationTypes.OrderUpdate, //from common helper
    Title: `Order ${latestStatus}`,
    CustomerID, //reference id from the user master table
    SupplierID: req.user.referenceID, //reference id from the user master table
    RoleID: ROLE_ID.CUSTOMER, //from commonhelper
    Reference: JSON.stringify({ for: "Customer" }),
    Description: `Order No : ${PurchaseOrderNo}`,
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
        msg: `order ${latestStatus}`,
        title: `Order ${latestStatus}`,
        RefID: CustomerID, //id from order master
      });
    });
};

/**
 * @param {number} PoID purchase order id
 * @Update_Po_Status in order status log
 */
const updatePoStatus = (PoID) => {
  OrderStatusLog.create({
    ReferenceTable: "Purchase_Order",
    PoID,
    OrderStatus: ORDER_STATUS.pending,
  });
};

/**
 * @Calculate_Total
 */
const getTotal = async (arr) => {
  let total = 0;
  for await (let item of arr) {
    total += item.Price;
  }
  return total;
};

const makeOrder = async (req, res, next) => {
  let { items } = req.body;
  let orderObj = {};

  /**
   * @Dividing_Order_Supplier_Wise
   */
  for await (let item of items) {
    let values = [];
    if (Object.keys(orderObj).includes(item.SupplierID.toString())) {
      values = orderObj[item.SupplierID].Products;
      values.push(item);
    } else {
      values.push(item);
      let obj = {
        Products: values,
      };
      orderObj[item.SupplierID] = obj;
    }
  }

  res.locals.orders = orderObj;
  next();
};

//new order from a customer
router.post("/newOrder", [auth, makeOrder], async (req, res) => {
  let { AddressID } = req.body;
  let { orders } = res.locals;

  // defaultPricing

  //check if object is empty
  if (!Object.keys(orders).length) {
    return other(res, req, "Something went wrong !");
  }
  for await (let singleOrder of Object.keys(orders)) {
    let t = await sequelize.transaction();
    try {
      var date = new Date();
      var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ];
      /**
       * @Global_Variables
       */
      var uniqueNumber = components.join("");
      let SupplierID = singleOrder;
      let subTotal = await getTotal(orders[singleOrder].Products);
      let PoID;

      /**
       * @Create_Purchase_Order
       */
      await PurchaseOrder.create(
        {
          PurchaseOrderNo: uniqueNumber,
          CustomerID: req.user.reference_id,
          AddressID,
          SubTotal: subTotal,
          SupplierID,
          UserID: req.user.id,
        },
        { transaction: t }
      )
        /**
         * @Creating_Purchase_Order_Detail
         */
        .then(async (result) => {
          PoID = result.dataValues.ID;

          updatePoStatus(PoID); //update po status

          let length = orders[singleOrder].Products.length;
          let index = 0;

          while (index < length) {
            let item = orders[singleOrder].Products[index];
            let PrimaryUomQty = null;
            if (item.Pricings) {
              let { PackagingUnitPallete, PackagingUnitRies } = item.Pricings;

              if (item.BuyIn == UOM_TYPES.ries) {
                PrimaryUomQty = PackagingUnitRies;
              } else if (item.BuyIn == UOM_TYPES.pallete) {
                PrimaryUomQty = PackagingUnitPallete;
              }

              let obj = {
                PoID,
                ProductID: item.ID,
                SupplierID: item.SupplierID,
                Quantity: item.quantity,
                Uom: item.BuyIn,
                CustExpectsDelivery: item.ExpectedDeliveryDate,
                Amount: item.Price,
                PricingID: item.Pricings ? item.Pricings.ID : null,
                InquiryID: item.InquiryID,
                QuotationID: item.QuotationID,
                QuotationDetailID: item.QuotationDetailID,
                PrimaryUomQty,
                DefaultPrice: item.defaultPricing,
              };

              await PurchaseOrderDetail.create({ ...obj }, { transaction: t })
                .then(async (poDetail) => {
                  let result = poDetail.get({ plain: true });
                  let quantity = item.quantity;
                  let ReservedQty = PrimaryUomQty
                    ? PrimaryUomQty * quantity
                    : quantity;
                  await ReservedQuantity.create(
                    {
                      PoID,
                      PoDetailID: result.ID,
                      ReservedQuantity: ReservedQty,
                      ProductID: item.ID,
                    },
                    { transaction: t }
                  ).catch((err) => {
                    throw Error(err);
                  });

                  await ProductMaster.findOne({
                    where: { ID: item.ID },
                    attributes: ["StockQuantity"],
                    raw: true,
                  })
                    .then((result) => {
                      //calculate stocks
                      let calcStock = result.StockQuantity - ReservedQty;
                      console.log(
                        calcStock,
                        ReservedQty,
                        result.StockQuantity,
                        "this is stock"
                      );
                      if (calcStock < 0) throw Error("Stock not available");
                      //update product stock
                      ProductMaster.update(
                        { StockQuantity: calcStock },
                        { where: { ID: item.ID } }
                      ).catch((err) => {
                        throw Error(err);
                      });
                    })
                    .catch((err) => {
                      throw Error(err);
                    });

                  //create new order status for detail
                  OrderStatusLog.create(
                    {
                      ReferenceTable: "Purchase_Order_Detail",
                      PoDetailID: result.ID,
                      OrderStatus: ORDER_STATUS.pending,
                    },
                    { transaction: t }
                  ).catch((err) => {
                    throw Error(err);
                  });
                })
                .catch((err) => {
                  throw Error(err);
                });

              index++;
            }
            //  return PurchaseOrderDetail.bulkCreate(arr);
          }
        })
        .catch((err) => {
          throw Error(err);
        });
      emitNotification(SupplierID, req); //emit notification
      t.commit();
    } catch (error) {
      t.rollback();
      other(res, req, error.message);
      break;
    }
  }

  successResponse(res, req, [], "order created");
});

//get customers order
router.post("/getCustomerOrders", auth, async (req, res) => {
  const { limit, page } = req.body;
  let offset = (page - 1) * limit;

  await PurchaseOrder.findAndCountAll({
    where: { CustomerID: req.user.reference_id },
    include: [
      {
        model: DispatchOrder,
        where: {
          DispatchStatus: {
            [Sequelize.Op.or]: [
              DISPATCH_STATUS.confirm,
              DISPATCH_STATUS.delivered,
            ],
          },
        },
        required: false,
        attributes: ["PoId", "DispatchTotal", "DispatchStatus"],
      },
      {
        model: Supplier,
        include: [
          { model: State, attributes: ["State", "ID"] },
          { model: City, attributes: ["City", "ID"] },
          { model: Country, attributes: ["Country", "ID"] },
        ],
      },
      {
        model: CustomerAddress,
        include: [
          { model: State, attributes: ["State", "ID"] },
          { model: City, attributes: ["City", "ID"] },
          { model: Country, attributes: ["Country", "ID"] },
        ],
      },
      { model: Customer, attributes: ["Email", "CustomerName"] },
      { model: OrderStatusLog },
      { model: User, attributes: ["UserName", "Email"] },
    ],
    limit,
    offset,
    order: [["updatedAt", "Desc"]],
  }).then((allOrders) => {
    successResponse(res, req, allOrders, "This are all customer Orders");
  });
});

//get all supplier orders
router.post("/getSuppliersOrders/:type", auth, async (req, res) => {
  const { limit, page, filter } = req.body;
  let offset = (page - 1) * limit;
  let type = req.params.type;
  if (type == ORDER_STATUS.pending) {
    OrderStatus = ORDER_STATUS.pending;
  }
  if (type == ORDER_STATUS.confirm) {
    OrderStatus = {
      [Sequelize.Op.or]: [ORDER_STATUS.confirm, ORDER_STATUS.partialDispatch],
    };
  }

  if (type == ORDER_STATUS.reject) {
    OrderStatus = ORDER_STATUS.reject;
  }

  let includeOption = [
    { model: CustomerAddress },
    { model: Customer, attributes: ["Email", "CustomerName"] },
  ];
  let filterObj = filter ? JSON.parse(filter) : null;
  let modelOption = [
    { IsActive: 1, IsDelete: 0, SupplierID: req.user.referenceID },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(PurchaseOrder.rawAttributes).includes(key1)) {
          modelOption.push({
            [key1]: { [Sequelize.Op.like]: `%${filterObj[key1]}%` },
          });
        } else if (includeOption) {
          for (let key2 of includeOption) {
            if (key2.attributes && key2.attributes.includes(key1)) {
              key2.where = {
                [key1]: { [Sequelize.Op.like]: `%${filterObj[key1]}%` },
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
  console.log(modelOption, "model option");
  console.log(includeOption, "include option");

  await PurchaseOrder.findAndCountAll({
    where: modelOption,
    include: includeOption,
    limit,
    offset,
    raw: true,
    nest: true,
    order: [["createdAt", "Desc"]],
  })

    .then((data) => {
      successResponse(res, req, data, "Purchase order of suppliers");
    })
    .catch((err) => serverError(res, req, err));
});

// having: ['COUNT(?) >= ?', '`vobject`.`uuid`', 2]

//get purchase order detail for supplier
router.get("/getOrderDetail/:id/:type", auth, async (req, res) => {
  if (!req.params.id) return other(res, req, "Order Id is invalid");
  await PurchaseOrderDetail.findAll({
    where: {
      PoID: req.params.id,
    },
    include: [
      {
        model: ProductMaster,

        include: [
          {
            model: MeasurementUnit,
            attributes: ["MeasurementUnit", "ID"],
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
          { model: ProductImages, attributes: ["Image", "ID", "ProductID"] }, //retriving images for the product
          {
            model: RegularPrice,
            include: [{ model: Group }, { model: RegularPriceRange }],
          },

          {
            model: WarehouseProducts,
            include: [
              { model: SupplierWarehouse, attributes: ["WarehouseName", "ID"] },
            ],
          },
        ],
      },
      {
        model: OrderQtyData,
      },
      {
        model: InquiryMaster,
      },
      {
        model: QuotationMaster,
      },
      {
        model: QuotationDetails,
      },
    ],
  })
    .then((orderDetail) =>
      successResponse(res, req, orderDetail, "Order Detail")
    )
    .catch((err) => serverError(res, req, err));
});

//get single customer order
router.get("/getSingleCustomerOrder/:id", auth, async (req, res) => {
  if (!req.params.id || req.params.id == "undefined") {
    return other(res, req, "Order Id is invalid");
  }

  await PurchaseOrderDetail.findAll({
    where: { PoID: req.params.id },
    include: [
      {
        model: ProductMaster,
        include: [
          { model: ProductImages, attributes: ["Image", "ID", "ProductID"] },
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
        ],
      },

      // {
      //   model: DispatchOrderDetail,
      //   where: {
      //     DispatchStatus: {
      //       [Sequelize.Op.or]: [
      //         DISPATCH_STATUS.confirm,
      //         DISPATCH_STATUS.delivered,
      //       ],
      //     },
      //   },
      //   required: false,
      //   include: [
      //     {
      //       model: DispatchOrder,
      //       attributes: [
      //         "DispatchOrderNo",
      //         "DispatchDate",
      //         "DispatchTotal",
      //         "DeliveryCharges",
      //         "OtherCharges",
      //         "Address",
      //         "ID",
      //         "VehicleNo",
      //         "Transporter",
      //         "Comments",
      //       ],
      //     },
      //   ],
      // },
      {
        model: OrderStatusLog,
        // required: true,
      },
      {
        model: QuotationMaster,
        attributes: ["QuotationNo"],
      },
      {
        model: InquiryMaster,
        attributes: ["InquiryNo"],
      },
    ],
    attributes: [
      "ID",
      "Quantity",
      "Uom",
      "Amount",
      "OrderStatus",
      "CustExpectsDelivery",
      "PrimaryUomQty",
      "DefaultPrice",
    ],
    // group: ["Dispatch_Order_Details.ID"],
    // raw: true,
    // nest:true
    // order: [[OrderStatusLog, "createdAt", "Desc"]],
  })
    .then((data) => successResponse(res, req, data, "All Orders"))
    .catch((err) => serverError(res, req, err));
});

/**
 * @param {string[]} arr of status of podetails
 * @returns status of whole order
 */
const determineOrderStatus = (arr) => {
  let status = "Pending";
  if (arr.length == 1) {
    status = arr[0];
  } else {
    if (
      arr.includes(ORDER_STATUS.confirm) &&
      (arr.includes(ORDER_STATUS.reject) || arr.includes(ORDER_STATUS.pending))
    ) {
      status = ORDER_STATUS.partialConfirm;
    } else if (
      !arr.includes(ORDER_STATUS.reject) &&
      !arr.includes(ORDER_STATUS.pending)
    ) {
      status = ORDER_STATUS.confirm;
    } else if (
      !arr.includes(ORDER_STATUS.confirm) &&
      !arr.includes(ORDER_STATUS.pending)
    ) {
      status = ORDER_STATUS.reject;
    } else if (
      !arr.includes(ORDER_STATUS.confirm) &&
      !arr.includes(ORDER_STATUS.reject)
    ) {
      status = ORDER_STATUS.pending;
    }
  }
  return status;
};

/**
 * @DOES sum of all the rejected orders amount
 * @returns sum of all the rejected orders
 */
const getSumOfRejectedOrders = (arr) => {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
};

/**
 *
 * @param {Number} currentTotal current total value of the order
 * @param {Number} sumOfRejectedOrders current total value of the order
 * @return the total of the order after making certain calculations
 *  @determines the subtotal of the wwhole order.
 */
const determineOrderSubTotal = (currentTotal, sumOfRejectedOrders) => {
  if (typeof sumOfRejectedOrders == "number") {
    parseFloat(sumOfRejectedOrders);
  }
  if (typeof currentTotal == "number") {
    parseFloat(currentTotal);
  }
  return currentTotal - sumOfRejectedOrders;
};

/**
 * @UPDATES_New_Order order of the info after edited by the supplier
 * @returns just a message that the order has being updated
 */
router.post("/updateOrder/:id", auth, async (req, res) => {
  let { inputData } = req.body;

  let arr = [];
  let totalRejectedAmount = [];
  /**
   * @LOOP loop over object and ger purchase order id and changed status
   */
  for await (let item of Object.keys(req.body.inputData)) {
    /**
     * @makearray push order status in temp array top determine MAIN PO order status
     */
    arr.push(inputData[item].OrderStatus);
    /**
     * @GET_REJECTED_ORDERS if rejected status present then minus the value of rejected orders from the main PO
     */
    if (inputData[item].OrderStatus == ORDER_STATUS.reject) {
      PurchaseOrderDetail.findOne({ where: { ID: item }, raw: true }).then(
        (oldPoDetail) => {
          totalRejectedAmount.push(oldPoDetail.Amount);
          return oldPoDetail;
        }
      );
    }

    if (inputData[item].OrderStatus) {
      /**
       * @update_order_status_log
       */
      OrderStatusLog.create({
        ReferenceTable: "Purchase_Order_Detail",
        PoDetailID: item,
        OrderStatus: inputData[item].OrderStatus,
      });
    }

    /**
     * @update purchase order status.
     */
    PurchaseOrderDetail.update(
      { ...inputData[item] },
      { where: { ID: item } }
    ).catch(async (err) => {
      // await t.rollback();
      serverError(res, req, err);
    });
  }

  /**
   * @get subTotal current value from po master
   */
  await PurchaseOrder.findOne({
    where: { ID: req.params.id },
    attributes: [
      "ID",
      "SubTotal",
      "OrderStatus",
      "PurchaseOrderNo",
      "CustomerID",
    ],
    raw: true,
  })
    .then(async (singlePurchaseOrder) => {
      let sumOfRejectedOrders = await getSumOfRejectedOrders(
        totalRejectedAmount
      );
      /**
       * @UPDATE_MAIN_PO update main po status and total.
       */
      let latestStatus = determineOrderStatus(arr);
      if (latestStatus != singlePurchaseOrder.OrderStatus) {
        /**
         * @Updating_Order_status
         */
        OrderStatusLog.create({
          ReferenceTable: "Purchase_Order",
          PoID: singlePurchaseOrder.ID,
          OrderStatus: latestStatus,
        });
      }

      return PurchaseOrder.update(
        {
          OrderStatus: latestStatus,
          SubTotal: determineOrderSubTotal(
            singlePurchaseOrder.SubTotal,
            sumOfRejectedOrders
          ),
        },
        { where: { ID: req.params.id } }
      );
    })
    .then(async (updatedPurchaseOrder) => {
      successResponse(res, req, "data updated", "Purchase orders updated");
    })
    .catch(async (err) => {
      // await t.rollback();
      serverError(res, req, err);
    });
});

/**
 * @Get_All_Orders
 */
router.post("/getAll", auth, async (req, res) => {
  const { limit, page, filter } = req.body;
  let offset = (page - 1) * limit; //calculating offset
  let includeOption = [
    // {
    //   model: DispatchOrder,
    //   required: false,
    //   attributes: ["PoId", "DispatchTotal", "DispatchStatus"],
    // },
    { model: Supplier },
    { model: CustomerAddress },
    { model: Customer, attributes: ["Email", "CustomerName"] },
    { model: OrderStatusLog },
  ];
  let filterObj = filter ? JSON.parse(filter) : null;
  let modelOption = [
    { IsActive: 1, IsDelete: 0, SupplierID: req.user.referenceID },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(PurchaseOrder.rawAttributes).includes(key1)) {
          modelOption.push({
            [key1]: { [Sequelize.Op.like]: `%${filterObj[key1]}%` },
          });
        } else if (includeOption) {
          for (let key2 of includeOption) {
            if (key2.attributes && key2.attributes.includes(key1)) {
              key2.where = {
                [key1]: { [Sequelize.Op.like]: `%${filterObj[key1]}%` },
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
  await PurchaseOrder.findAndCountAll({
    where: modelOption,
    include: includeOption,
    limit,
    offset,
    order: [["updatedAt", "Desc"]],
  })
    .then((result) => {
      successResponse(res, req, result, "All orders");
    })
    .catch((err) => {
      serverError(res, req, err);
    });
});

/**
 * @Get_Order_Detail //api for all orders
 */
router.get("/singleOrderDetail/:poID", auth, async (req, res) => {
  if (!req.params.poID || req.params.poID == "undefined") {
    return other(res, req, "Order Id is invalid");
  }
  await PurchaseOrderDetail.findAll({
    where: { PoID: req.params.poID },
    include: [
      {
        model: ProductMaster,
        include: [
          { model: ProductImages, attributes: ["Image", "ID", "ProductID"] },
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
        ],
      },

      {
        model: DispatchOrderDetail,
        required: false,
        include: [
          {
            model: DispatchOrder,
            attributes: [
              "DispatchOrderNo",
              "DispatchDate",
              "DispatchTotal",
              "DeliveryCharges",
              "OtherCharges",
              "Address",
              "ID",
            ],
          },
        ],
      },
      {
        model: OrderStatusLog,
        // required: true,
      },
    ],
    attributes: [
      "ID",
      "Quantity",
      "Uom",
      "Amount",
      "OrderStatus",
      "CustExpectsDelivery",
      "RemainingQuantity",
    ],
    // group: ["Dispatch_Order_Details.ID"],
    // raw: true,
    // nest:true
    // order: [[OrderStatusLog, "createdAt", "Desc"]],
  })
    .then((result) => {
      successResponse(res, req, result, "Single order details");
    })
    .catch((err) => {
      serverError(res, req, err);
    });
});

/**
 * @validate order before updating status
 */
const validateOrder = async (req, res, next) => {
  try {
    let { rows, orderStatus, poDetails } = req.body;
    console.log(poDetails, "this is po details");

    let validationArr = [];

    let rowLength = Object.keys(rows).length;
    let headIndex = 0;
    while (headIndex < rowLength) {
      let singleRow = Object.keys(rows)[headIndex];

      let childLength = rows[singleRow].length;
      let childIndex = 0;

      while (childIndex < childLength) {
        let singleData = rows[singleRow][childIndex];
        await WarehouseProducts.findOne({
          where: {
            ProductID: singleData.ProductID,
            WarehouseID: singleData.WarehouseID,
          },
          include: {
            model: ProductMaster,
            attributes: ["StockQuantity"],
          },
          order: [["createdAt", "DESC"]],
          raw: true,
          nest: true,
        })
          .then(async (warehouseData) => {
            if (!warehouseData) {
              validationArr.push(singleData.WarehouseID);
            } else if (warehouseData.StockQuantity - singleData.Quantity < 0) {
              validationArr.push(singleData.WarehouseID);
            } else {
              if (orderStatus[singleRow] == ORDER_STATUS.confirm) {
                let MinusQuantity;
                if (
                  singleData.uom == UOM_TYPES.sheets ||
                  singleData.uom == UOM_TYPES.rolls
                ) {
                  MinusQuantity = singleData.Quantity;
                } else {
                  MinusQuantity =
                    singleData.Quantity * singleData.PrimaryUomQty;
                }

                WarehouseProducts.create({
                  MinusQuantity: singleData.Quantity,
                  StockQuantity: warehouseData.StockQuantity - MinusQuantity,
                  ProductID: singleData.ProductID,
                  WarehouseID: singleData.WarehouseID,
                  SupplierID: req.user.referenceID,
                }).catch(async (err) => {
                  throw Error(err);
                });
              }
            }
          })
          .catch((err) => {
            throw new Error(err);
          });

        childIndex++;
      }
      headIndex++;
    }
    res.locals.validationArr = validationArr;
    next();
  } catch (error) {
    serverError(res, req, error);
  }
};

/**
 * @update_Order latest
 */
router.post(
  "/updateOrderDetail/:id",
  [auth, validateOrder],
  async (req, res) => {
    let { rows, orderStatus, poDetails, DeliveryCharges } = req.body;
    if (res.locals.validationArr.length) {
      return other(res, req, "Stock not available");
    }
    // return;
    let len = Object.keys(orderStatus).length;
    let index = 0;
    let statusArr = [];

    while (index < len) {
      let t = await sequelize.transaction();
      try {
        let singlePurchaseOrder = Object.keys(orderStatus)[index];
        let isEditVal = 1;
        if (orderStatus[singlePurchaseOrder] == ORDER_STATUS.confirm) {
          if (!poDetails.IsEdit) {
            isEditVal = 1;
          }
        } else if (
          orderStatus[singlePurchaseOrder] == ORDER_STATUS.pending ||
          orderStatus[singlePurchaseOrder] == ORDER_STATUS.reject
        ) {
          isEditVal = 0;
        }
        statusArr.push(orderStatus[singlePurchaseOrder]);

        await PurchaseOrderDetail.update(
          { OrderStatus: orderStatus[singlePurchaseOrder], IsEdit: isEditVal },
          { where: { ID: singlePurchaseOrder } }
        )
          .then(async (result) => {
            //create order status
            await OrderStatusLog.create({
              ReferenceTable: "Purchase_Order_Detail",
              PoDetailID: singlePurchaseOrder,
              OrderStatus: orderStatus[singlePurchaseOrder],
            });

            let rowLength = Object.keys(rows).length;
            let headIndex = 0;
            while (headIndex < rowLength) {
              let singleRow = Object.keys(rows)[headIndex];
              let childLength = rows[singleRow].length;
              let childIndex = 0;
              while (childIndex < childLength) {
                let singleData = rows[singleRow][childIndex];
                if (singleRow == singlePurchaseOrder) {
                  OrderQtyData.destroy({
                    where: { PoDetailID: singlePurchaseOrder },
                  })
                    .then(async (result) => {
                      //minus stock if confirm status
                      if (
                        orderStatus[singlePurchaseOrder] ==
                          ORDER_STATUS.confirm &&
                        !poDetails.IsEdit
                      ) {
                        await ReservedQuantity.destroy({
                          where: { PoDetailID: singlePurchaseOrder },
                        }).catch((err) => {
                          throw Error(err);
                        });
                      }
                      OrderQtyData.create({
                        PoID: req.params.id,
                        PoDetailID: singlePurchaseOrder,
                        WarehouseID: singleData.WarehouseID,
                        Quantity: singleData.Quantity,
                      }).catch((err) => {
                        throw Error(err);
                      });
                    })
                    .catch(async (err) => {
                      throw Error(err);
                    });
                }

                childIndex++;
              }
              headIndex++;
            }
          })
          .catch(async (err) => {
            throw Error(err);
          });
        index++;
      } catch (error) {
        serverError(res, req, error);
        break;
      }
    }

    /**
     * @get subTotal current value from po master
     */
    await PurchaseOrder.findOne({
      where: { ID: req.params.id },
      attributes: [
        "ID",
        "SubTotal",
        "OrderStatus",
        "PurchaseOrderNo",
        "CustomerID",
        "UserID",
      ],
      raw: true,
    })
      .then(async (singlePurchaseOrder) => {
        // let sumOfRejectedOrders = await getSumOfRejectedOrders(
        //   totalRejectedAmount
        // );
        /**
         * @UPDATE_MAIN_PO update main po status and total.
         */
        let latestStatus = determineOrderStatus(statusArr);
        if (latestStatus != singlePurchaseOrder.OrderStatus) {
          // emit notification to customer
          emitNotificationToCustomer(singlePurchaseOrder, latestStatus, req);
          /**
           * @Updating_Order_status
           */
          OrderStatusLog.create({
            ReferenceTable: "Purchase_Order",
            PoID: singlePurchaseOrder.ID,
            OrderStatus: latestStatus,
          });
        }

        return PurchaseOrder.update(
          {
            OrderStatus: latestStatus,
            ShippingCharge: DeliveryCharges,
          },
          { where: { ID: req.params.id } }
        );
      })
      .then(async (updatedPurchaseOrder) => {
        successResponse(res, req, "data updated", "Purchase orders updated");
      });
  }
);

module.exports = router;
