const express = require("express");
const {
  successResponse,
  serverError,
  other,
} = require("../../helpers/response");
const router = express.Router();
const {
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
  Notification,
  Customer,
  CustomerAddress,
  DispatchOrder,
  DispatchOrderDetail,
  Sequelize,
  OrderStatusLog,
  SupplierWarehouse,
  DoDetailQuantity,
  WarehouseProducts,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const {
  ORDER_STATUS,
  DISPATCH_STATUS,
  UOM_TYPES,
  rollType,
} = require("../../helpers/commonHelper");

/**
 *
 * @param {Number} totalDispatchQuantity
 * @param {Number} orderPrice
 * @param {Number} orderQuantity
 * @returns price for dispatched quantity
 */
const determineSingleDispatchPrice = (
  totalDispatchQuantity,
  orderPrice,
  orderQuantity
) => {
  let total = 0;
  if (totalDispatchQuantity) {
    total =
      (parseInt(totalDispatchQuantity) * parseFloat(orderPrice)) /
      parseInt(orderQuantity);
  }
  return total;
};

/**
 * @param {Number} totalQuantity Total dispatch quantity
 * @param {Number} quantity Total order quantity
 */
const determinePoDetailStatus = (RemainingQuantity) => {
  let status = ORDER_STATUS.confirm;
  if (RemainingQuantity == 0) {
    status = ORDER_STATUS.dispatched;
  } else if (RemainingQuantity != null) {
    status = ORDER_STATUS.partialDispatch;
  }
  console.log(status, "this is status");
  return status;
};

/**
 * @param {[]} arr determine arr
 * @returns
 */
const determineOrderStatus = (arr) => {
  let status = ORDER_STATUS.confirm;
  if (arr.length == 1) {
    status = arr[0];
  } else {
    if (
      arr.includes(ORDER_STATUS.partialDispatch) ||
      (arr.includes(ORDER_STATUS.dispatched) &&
        arr.includes(ORDER_STATUS.confirm))
    ) {
      //if array includes partial dispatch or dispatch and confirm
      status = ORDER_STATUS.partialDispatch;
    } else if (
      arr.includes(ORDER_STATUS.dispatched) && //if array includes dispatched
      !arr.includes(ORDER_STATUS.partialDispatch) &&
      !arr.includes(ORDER_STATUS.confirm)
    ) {
      status = ORDER_STATUS.dispatched;
    }
  }

  return status;
};

/**
 * @return totalDispatchQuantity and total dispatch amount
 */
const getSumOfDispatch = async ({ PoDetailID }) => {
  return DispatchOrderDetail.findAll({
    where: {
      PoDetailID,
      DispatchStatus: { [Sequelize.Op.not]: DISPATCH_STATUS.cancel },
    },
    attributes: [
      [
        sequelize.fn("sum", sequelize.col("TotalDispatchQuantity")),
        "TotalDispatchQuantity",
      ],
      [
        sequelize.fn("sum", sequelize.col("CurrentDispatchAmount")),
        "CurrentDispatchAmount",
      ],
    ],
    group: ["PoDetailID"],
    raw: true,
  });
};

/**
 * @Subtract_Warehouse_Quantiy
 */
const subtractWarehouseQty = async (
  singlePoDetail,
  singleOrderDetail,
  childItem,
  res,
  req
) => {
  await WarehouseProducts.findOne({
    where: {
      ProductID: singlePoDetail.ProductID,
      WarehouseID: childItem.WarehouseID,
    },
    order: [["createdAt", "DESC"]],
    raw: true,
  }).then(async (data) => {
    let MinusQuantity = childItem.DispatchQuantity;
    let orderedUom = singlePoDetail.Uom;
    //check for ordered uom
    if (orderedUom == UOM_TYPES.sheets || orderedUom == UOM_TYPES.rolls) {
      MinusQuantity = childItem.DispatchQuantity;
    } else {
      MinusQuantity = childItem.DispatchQuantity * singlePoDetail.PrimaryUomQty;
    }

    if (!data) return other(res, req, "You have no stock available");
    if (data.StockQuantity - MinusQuantity < 0)
      return other(res, req, "Stock cannot be negative");
    return WarehouseProducts.create({
      ProductID: singlePoDetail.ProductID,
      StockQuantity: data.StockQuantity - MinusQuantity,
      WarehouseID: childItem.WarehouseID,
      MinusQuantity,
      SupplierID: singleOrderDetail.Purchase_Order.SupplierID,
    });
  });
};

/**
 * @Add_New_Dispatch_Order
 */
router.post("/newDispatch", auth, async (req, res) => {
  let {
    DispatchQuantityDetail,
    dispatchDetail,
    singleOrderDetail,
    subTotal,
    dispatchQuantityPerPoDetail,
    singlePoDetail,
  } = req.body;

  /**
   * @Destructure_Dispatch_Detail_Property
   */
  let {
    DispatchOrderNo,
    Transporter,
    VehicleNo,
    Comments,
    Address,
    DispatchDate,
    DeliveryCharges,
    OtherCharges,
    ZipCode,
  } = dispatchDetail;

  /**
   * @Global_Variables
   */
  var DispatchID;

  const t = await sequelize.transaction();

  /**
   * @Creating_Dispatch_Order
   */
  await DispatchOrder.create({
    DispatchOrderNo,
    Transporter,
    VehicleNo,
    Comments,
    Address,
    DispatchDate,
    DeliveryCharges,
    OtherCharges,
    ZipCode,
    PoID: singleOrderDetail.ID,
    PurchaseOrderNo: singleOrderDetail.PurchaseOrderNo,
    CustomerID: singleOrderDetail.CustomerID,
    SupplierID: singleOrderDetail.SupplierID,
    PoDate: singleOrderDetail.createdAt,
    DispatchTotal: subTotal,
  })
    /**
     * @Add_Dispatch_Detail
     */
    .then(async (data) => {
      //Assigning dispatch variable to global variable
      let result = data.get({ plain: true });
      DispatchID = result.ID;
      if (!Object.keys(dispatchQuantityPerPoDetail).length)
        return other(res, req, "Something went wrong!");

      for await (let headItem of Object.keys(dispatchQuantityPerPoDetail)) {
        /**
         * @Getting_Previous_Sum and updating remaining quantity
         */
        getSumOfDispatch({ PoDetailID: headItem }).then(
          async (previousDispatchDetails) => {
            let totalDisQuantity = dispatchQuantityPerPoDetail[headItem];
            if (previousDispatchDetails.length) {
              totalDisQuantity =
                previousDispatchDetails[0].TotalDispatchQuantity +
                dispatchQuantityPerPoDetail[headItem];
            }
            PurchaseOrderDetail.update(
              {
                RemainingQuantity:
                  singlePoDetail[headItem].Quantity - totalDisQuantity,
              },
              { where: { ID: headItem } }
            );
          }
        );

        /**
         * @Create_a_dispatch_Order_Detail
         */
        let TotalDispatchQuantity = dispatchQuantityPerPoDetail[headItem];

        DispatchOrderDetail.create({
          PoID: singleOrderDetail.ID,
          DispatchID,
          PoDetailID: headItem,
          TotalDispatchQuantity,
          CurrentDispatchAmount: determineSingleDispatchPrice(
            TotalDispatchQuantity,
            singlePoDetail[headItem].Amount,
            singlePoDetail[headItem].Quantity
          ),
        }).then(async (result) => {
          /**
           * @Create_a_dispatch_Order_Quantity
           */
          let newDispatchDetail = result.get({ plain: true });
          if (!Object.keys(DispatchQuantityDetail).length) return;
          let arr = [];
          for await (let item of Object.keys(DispatchQuantityDetail)) {
            for (let singleItem of DispatchQuantityDetail[item]) {
              let obj = {
                PoID: singleOrderDetail.ID,
                DispatchID,
                PoDetailID: item,
                DispatchOrderDetailID: newDispatchDetail.ID,
                WarehouseID: singleItem.WarehouseID,
                DispatchQuantity: singleItem.Quantity,
              };
              if (item == headItem) {
                arr.push(obj);
              }
            }
          }
          /**
           * @Bulking_Creating_DispatchOrder_Quantity
           */
          return DoDetailQuantity.bulkCreate(arr);
        });
      }
    })

    .then(async (result) => {
      successResponse(res, req, result, "Updated");
      t.commit();
    })
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

/**
 * @Get_Purchase_Order_Detail_On_Add
 */
router.get("/getOrderDetail/:id/:type", auth, async (req, res) => {
  if (!req.params.id) return other(res, req, "Order Id is invalid");
  await PurchaseOrderDetail.findAll({
    where: {
      PoID: req.params.id,
      OrderStatus: {
        [Sequelize.Op.or]: [
          ORDER_STATUS.confirm,
          ORDER_STATUS.partialDispatch,
          ORDER_STATUS.delivered,
        ],
      },
    },
    include: [
      {
        model: ProductMaster,
        include: {
          model: MeasurementUnit,
          attributes: ["MeasurementUnit", "ID"],
        },
      },
      {
        model: DispatchOrderDetail,
        where: {
          DispatchStatus: { [Sequelize.Op.not]: DISPATCH_STATUS.cancel },
        },
        required: false,
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
      "PrimaryUomQty",
    ],
    // group: ["ID"],
    order: [[DispatchOrderDetail, "ID", "DESC"]],
  })
    .then((orderDetail) =>
      successResponse(res, req, orderDetail, "Order Detail")
    )
    .catch((err) => serverError(res, req, err));
});

/**
 * @Get_All_Dispatch_Order
 */
router.post("/allDispatchOrder", auth, async (req, res) => {
  console.log(req.user, "this is socket id");

  const { page, limit, filter } = req.body; //destructuring body
  let offset = (page - 1) * limit; //calculating offset
  let filterObj = filter ? JSON.parse(filter) : null; //filter object
  let modelOption = [
    { IsActive: 1, IsDelete: 0, SupplierID: req.user.referenceID },
  ]; //initial where condition

  //initial joins
  let includeOption = [
    { model: Customer, attributes: ["CustomerName", "Email"] },
    {
      model: PurchaseOrder,
      include: [
        {
          model: CustomerAddress,
          attributes: [
            "ZipCode",
            "PaymentMethod",
            "Phone",
            "Address",
            "LandMark",
          ],
        },
      ],
    },
  ];

  if (filterObj) {
    for (let key1 of Object.keys(filterObj)) {
      if (filterObj[key1]) {
        if (Object.keys(DispatchOrder.rawAttributes).includes(key1)) {
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

  await DispatchOrder.findAndCountAll({
    where: modelOption,
    attributes: [
      "DispatchOrderNo",
      "ID",
      "DispatchDate",
      "ZipCode",
      "PurchaseOrderNo",
      "VehicleNo",
      "Comments",
      "Transporter",
      "DeliveryCharges",
      "OtherCharges",
      "PoID",
      "DispatchTotal",
      "DispatchStatus",
      [
        sequelize.literal(
          "COALESCE(DispatchTotal, 0) + COALESCE(DeliveryCharges, 0) + COALESCE(OtherCharges, 0)"
        ),
        "GrandTotal",
      ],
    ],
    include: includeOption,
    limit,
    offset,
    raw: true,
    nest: true,
    order: [["createdAt", "Desc"]],
  })
    .then((result) => successResponse(res, req, result, "All dispatches"))
    .catch((err) => serverError(res, req, err));
});

/**
 * @Single_Dispatch_Order
 */
router.get(
  "/getSingleDispatchOrder/:id/:dispatchID",
  auth,
  async (req, res) => {
    if (!req.params.id) return other(res, req, "Order Id is invalid");
    await PurchaseOrderDetail.findAll({
      where: { PoID: req.params.id },
      include: [
        {
          model: DispatchOrderDetail,
          where: { DispatchID: req.params.dispatchID },
        },
        { model: ProductMaster },
        { model: RegularPrice },
        {
          model: DoDetailQuantity,
          where: { DispatchID: req.params.dispatchID },
          include: [{ model: SupplierWarehouse }],
        },
      ],
      attributes: [
        "ID",
        "Quantity",
        "Uom",
        "Amount",
        "OrderStatus",
        "CustExpectsDelivery",
        "ProductID",
        "RemainingQuantity",
        "PricingID",
        "PrimaryUomQty",
      ],
      order: [[DispatchOrderDetail, "ID", "DESC"]],
    })
      .then((result) => {
        successResponse(res, req, result, "all order");
      })
      .catch((err) => serverError(res, req, err));
  }
);

/**
 * @Update_Dispatch_Order
 */
router.post("/updateDispatchOrder/:id", auth, async (req, res) => {
  let {
    DispatchQuantity,
    singleOrderDetail,
    dispatchDetail,
    subTotalOfDispatch,
    dispatchQuantityPerPoDetail,
    singlePoDetail,
  } = req.body;

  /**
   * @Global_Variables
   */
  var PoID = singleOrderDetail.Purchase_Order.ID;

  /**
   * @Destructure_Dispatch_Detail_Property
   */
  let {
    DispatchOrderNo,
    Transporter,
    VehicleNo,
    Comments,
    Address,
    DispatchDate,
    DeliveryCharges,
    OtherCharges,
    ZipCode,
  } = dispatchDetail;

  //update the dispatch detail
  const t = await sequelize.transaction();

  /**
   * @updating_Dispatch_Order
   */
  await DispatchOrder.update(
    {
      DispatchOrderNo,
      Transporter,
      VehicleNo,
      Comments,
      Address,
      DispatchDate,
      DeliveryCharges,
      OtherCharges,
      ZipCode,
      PoID,
      PurchaseOrderNo: singleOrderDetail.Purchase_Order.PurchaseOrderNo,
      CustomerID: singleOrderDetail.Purchase_Order.CustomerID,
      SupplierID: singleOrderDetail.Purchase_Order.SupplierID,
      PoDate: singleOrderDetail.Purchase_Order.createdAt,
      DispatchTotal: parseFloat(subTotalOfDispatch).toFixed(3),
    },
    { where: { ID: req.params.id } },
    { transaction: t }
  )
    /**
     * @Destroy_Do_Detail_Quantity
     */
    .then(async (data) => {
      return DoDetailQuantity.destroy(
        { where: { DispatchID: req.params.id } },
        { transaction: t }
      );
    })
    /**
     * @Destroy_Dispatch_Order_Detail of a single dispatch order.
     */
    .then(async (data) => {
      return DispatchOrderDetail.destroy(
        {
          where: { DispatchID: req.params.id },
        },
        { transaction: t }
      );
    })
    /**
     * @Create_Dispatch_Order and dispatch order detail
     */
    .then(async (result) => {
      if (!Object.keys(dispatchQuantityPerPoDetail).length)
        return other(res, req, "Something went wrong!");
      for await (let singleItem of Object.keys(dispatchQuantityPerPoDetail)) {
        /**
         * @Getting_Previous_Sum and updating remaining quantity
         */
        getSumOfDispatch({ PoDetailID: singleItem }).then(
          async (previousDispatchDetails) => {
            console.log(previousDispatchDetails, "this are previous values");
            let totalDisQuantity = dispatchQuantityPerPoDetail[singleItem];
            if (previousDispatchDetails.length) {
              totalDisQuantity =
                previousDispatchDetails[0].TotalDispatchQuantity +
                dispatchQuantityPerPoDetail[singleItem];
            }
            PurchaseOrderDetail.update(
              {
                RemainingQuantity:
                  singlePoDetail[singleItem].Quantity - totalDisQuantity,
              },
              { where: { ID: singleItem } }
            );
          }
        );

        let TotalDispatchQuantity = dispatchQuantityPerPoDetail[singleItem];

        DispatchOrderDetail.create({
          PoID: singleOrderDetail.ID,
          DispatchID: req.params.id,
          PoDetailID: singleItem,
          TotalDispatchQuantity,
          CurrentDispatchAmount: determineSingleDispatchPrice(
            TotalDispatchQuantity,
            singlePoDetail[singleItem].Amount,
            singlePoDetail[singleItem].Quantity
          ),
        })
          /**
           * @Create_a_dispatch_Order_Quantity
           */
          .then(async (result) => {
            let newDispatchDetail = result.get({ plain: true });
            if (!Object.keys(DispatchQuantity).length)
              return other(res, req, "Cannot get Dispatch Quantity");
            //initializing empty array;
            let arr = [];
            //Declaring head index varibles for parent while loop
            var index = 0,
              len = Object.keys(DispatchQuantity).length;
            let DispatchQuantityArr = Object.keys(DispatchQuantity);
            /**
             * @Parent_While_Loop
             */
            while (index < len) {
              //Declaring sub index varibles for child while loop

              let subIndex = 0,
                subLen = DispatchQuantity[DispatchQuantityArr[index]].length;

              /**
               * @Child_While_Loop
               */
              while (subIndex < subLen) {
                let obj = {
                  PoID,
                  DispatchID: req.params.id,
                  PoDetailID: DispatchQuantityArr[index],
                  DispatchOrderDetailID: newDispatchDetail.ID,
                  WarehouseID:
                    DispatchQuantity[DispatchQuantityArr[index]][subIndex]
                      .WarehouseID,
                  DispatchQuantity:
                    DispatchQuantity[DispatchQuantityArr[index]][subIndex]
                      .DispatchQuantity,
                };
                if (singleItem == DispatchQuantityArr[index]) {
                  arr.push(obj);
                }
                //incrementing child index
                subIndex++;
              }
              //incrementing parent index
              index++;
            }
            /**
             * @Bulking_Creating_DispatchOrderDetail
             */
            return DoDetailQuantity.bulkCreate(arr);
          });
      }
    })
    /**
     * @Sending_Success_Response
     */
    .then(async (result) => {
      successResponse(res, req, result, "Updated");
      t.commit();
    })
    /**
     * @Handling_error
     */
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

/**
 * @Confirm_Dispatch_Order
 */
router.post("/confirmDispatch/:id", auth, async (req, res) => {
  let {
    DispatchQuantity,
    singleOrderDetail,
    dispatchDetail,
    subTotalOfDispatch,
    dispatchQuantityPerPoDetail,
    singlePoDetail,
  } = req.body;

  var PoID = singleOrderDetail.Purchase_Order.ID;

  /**
   * @Destructure_Dispatch_Detail_Property
   */
  let {
    DispatchOrderNo,
    Transporter,
    VehicleNo,
    Comments,
    Address,
    DispatchDate,
    DeliveryCharges,
    OtherCharges,
    ZipCode,
  } = dispatchDetail;

  //update the dispatch detail
  const t = await sequelize.transaction();

  /**
   * @updating_Dispatch_Order
   */
  await DispatchOrder.update(
    {
      DispatchOrderNo,
      Transporter,
      VehicleNo,
      Comments,
      Address,
      DispatchDate,
      DeliveryCharges,
      OtherCharges,
      ZipCode,
      PoID,
      DispatchStatus: DISPATCH_STATUS.confirm,
      PurchaseOrderNo: singleOrderDetail.Purchase_Order.PurchaseOrderNo,
      CustomerID: singleOrderDetail.Purchase_Order.CustomerID,
      SupplierID: singleOrderDetail.Purchase_Order.SupplierID,
      PoDate: singleOrderDetail.Purchase_Order.createdAt,
      DispatchTotal: subTotalOfDispatch,
    },
    { where: { ID: req.params.id } },
    { transaction: t }
  )
    /**
     * @Destroy_Do_Detail_Quantity
     */
    .then(async (data) => {
      return DoDetailQuantity.destroy(
        { where: { DispatchID: req.params.id } },
        { transaction: t }
      );
    })
    /**
     * @Destroy_Dispatch_Order_Detail of a single dispatch order.
     */
    .then(async (data) => {
      return DispatchOrderDetail.destroy(
        {
          where: { DispatchID: req.params.id },
        },
        { transaction: t }
      );
    })
    /**
     * @Create_Dispatch_Order and dispatch order detail
     */
    .then(async (result) => {
      if (!Object.keys(dispatchQuantityPerPoDetail).length) return;
      // return new Promise(async (resolve, reject) => {
      let head = 0;
      let headLen = Object.keys(dispatchQuantityPerPoDetail).length;
      while (head < headLen) {
        let singleItem = Object.keys(dispatchQuantityPerPoDetail)[head];

        /**
         * @Getting_Previous_Sum and updating remaining quantity
         */
        getSumOfDispatch({ PoDetailID: singleItem }).then(
          async (previousDispatchDetails) => {
            let totalDisQuantity = dispatchQuantityPerPoDetail[singleItem];
            if (previousDispatchDetails.length) {
              totalDisQuantity =
                previousDispatchDetails[0].TotalDispatchQuantity +
                dispatchQuantityPerPoDetail[singleItem];
            }
            PurchaseOrderDetail.update(
              {
                RemainingQuantity:
                  singlePoDetail[singleItem].Quantity - totalDisQuantity,
              },
              { where: { ID: singleItem } }
            );
          }
        );

        let TotalDispatchQuantity = dispatchQuantityPerPoDetail[singleItem];

        DispatchOrderDetail.create({
          PoID,
          DispatchID: req.params.id,
          PoDetailID: singleItem,
          TotalDispatchQuantity,
          DispatchStatus: DISPATCH_STATUS.confirm,
          CurrentDispatchAmount: determineSingleDispatchPrice(
            TotalDispatchQuantity,
            singlePoDetail[singleItem].Amount,
            singlePoDetail[singleItem].Quantity
          ),

          // });
        })
          /**
           * @Create_a_dispatch_Order_Quantity
           */
          .then(async (result) => {
            let newDispatchDetail = result.get({ plain: true });
            if (!Object.keys(DispatchQuantity).length)
              return other(res, req, "Cannot get Dispatch Quantity");
            //initializing empty array;
            let arr = [];
            //Declaring head index varibles for parent while loop
            var index = 0,
              len = Object.keys(DispatchQuantity).length;
            let DispatchQuantityArr = Object.keys(DispatchQuantity);
            /**
             * @Parent_While_Loop
             */
            while (index < len) {
              //Declaring sub index varibles for child while loop

              let subIndex = 0,
                subLen = DispatchQuantity[DispatchQuantityArr[index]].length;

              /**
               * @Child_While_Loop
               */
              while (subIndex < subLen) {
                let childItem =
                  DispatchQuantity[DispatchQuantityArr[index]][subIndex];
                let obj = {
                  PoID,
                  DispatchID: req.params.id,
                  PoDetailID: DispatchQuantityArr[index],
                  DispatchOrderDetailID: newDispatchDetail.ID,
                  ProductID: singlePoDetail[singleItem].ProductID,
                  WarehouseID: childItem.WarehouseID,
                  DispatchQuantity: childItem.DispatchQuantity,
                };
                if (singleItem == DispatchQuantityArr[index]) {
                  arr.push(obj);
                }

                // /**
                //  * @Stock_Minus_From_Warehouse stock updation in warehouse
                //  */
                // await subtractWarehouseQty(
                //   singlePoDetail[singleItem],
                //   singleOrderDetail,
                //   childItem,
                //   res,
                //   req
                // );

                //increment child index
                subIndex++;
              }
              //incrementing parent index
              index++;
            }
            /**
             * @Bulking_Creating_DispatchOrderDetail
             */
            return DoDetailQuantity.bulkCreate(arr);
          });
        //increment head index
        head++;
      }
    })

    /**
     * @Get_Podetail_Info
     */
    .then(async (result) => {
      return PurchaseOrderDetail.findAll({
        where: { PoID, OrderStatus: {[Sequelize.Op.not] : ORDER_STATUS.reject} },
        raw: true,
        nest: true,
      });
    })
    /**
     * @Status_Updation updating status of podetail and po.
     */
    .then(async (result) => {
      let statusArr = [];
      let index = 0,
        len = result.length;
      while (index < len) {
        //Passing total Dispatch quantity and total order quantity;
        let singlePoDetail = result[index];

        let status = determinePoDetailStatus(singlePoDetail.RemainingQuantity);

        statusArr.push(status);
        if (status != singlePoDetail.OrderStatus) {
          PurchaseOrderDetail.update(
            { OrderStatus: status },
            { where: { ID: singlePoDetail.ID } }
          ).then((result) => {
            OrderStatusLog.create({
              ReferenceTable: "Purchase_Order_Detail",
              PoDetailID: singlePoDetail.ID,
              OrderStatus: status,
            });
          });
        }

        index++;
      }

      let latestStatus = determineOrderStatus(statusArr);

      if (latestStatus != singleOrderDetail.Purchase_Order.OrderStatus) {
        PurchaseOrder.update(
          { OrderStatus: latestStatus },
          { where: { ID: PoID } }
        ).then(() => {
          OrderStatusLog.create({
            ReferenceTable: "Purchase_Order",
            PoID,
            OrderStatus: latestStatus,
          });
        });
      }

      successResponse(res, req, result, "Updated");
      t.commit();
    })
    /**
     * @error_handler_for_all_thens
     */
    .catch(async (err) => {
      await t.rollback();
      serverError(res, req, err);
    });
});

/**
 * @Cancel_Dispatch_Order
 */
router.post("/cancelDispatch/:dispatchID", auth, async (req, res) => {
  if (!req.params.dispatchID || req.params.dispatchID == "undefined") {
    return other(res, req, "Dispatch id not valid");
  }

  const { dispatchQuantityPerPoDetail } = req.body;

  /**
   * @Global_variables
   */
  let DispatchID = req.params.dispatchID;

  /**
   * @updating_dispatch_Order_Status
   */
  await DispatchOrder.update(
    { DispatchStatus: DISPATCH_STATUS.cancel },
    { where: { ID: req.params.dispatchID } }
  )
    /**
     * @updating_Dispaatch_Order_Detail
     */
    .then((result) => {
      return DispatchOrderDetail.update(
        { DispatchStatus: DISPATCH_STATUS.cancel },
        { where: { DispatchID } }
      );
    })
    .then((result) => {
      let headIndex = 0;
      let len = Object.keys(dispatchQuantityPerPoDetail).length;
      while (headIndex <= len) {
        let singlePoDetail = Object.keys(dispatchQuantityPerPoDetail)[
          headIndex
        ];

        PurchaseOrderDetail.findOne({
          where: { ID: singlePoDetail },
          attributes: ["RemainingQuantity"],
          raw: true,
        })
          /**
           * @Update_Dispatch_Order_Remaining_Quantity
           */
          .then((poDetail) => {
            PurchaseOrderDetail.update(
              {
                RemainingQuantity:
                  dispatchQuantityPerPoDetail[singlePoDetail] +
                  poDetail.RemainingQuantity,
              },
              { where: { ID: singlePoDetail } }
            );
          });
        headIndex++;
      }

      successResponse(res, req, null, "Dispatch canceled");
    })
    .catch((err) => serverError(res, req, err));
});

/**
 * @Order_Recieved
 */

router.post("/orderReceived", auth, async (req, res) => {
  let { DispatchID, PoID, PoDetailID, PoStatus, PoDetailStatus } = req.body;
  await DispatchOrder.update(
    { DispatchStatus: DISPATCH_STATUS.delivered },
    { where: { ID: DispatchID } }
  )
    /**
     * @Update_Status_Of_DoDetail
     */
    .then((result) => {
      return DispatchOrderDetail.update(
        { DispatchStatus: DISPATCH_STATUS.delivered },
        { where: { PoDetailID, DispatchID } }
      );
    })
    /**
     * @get_PoDetail_Dispatch_status
     */
    .then((result) => {
      return DispatchOrderDetail.findAll({
        where: { PoDetailID },
        attributes: ["DispatchStatus", "RemainingQuantity"],
        raw: true,
      });
    })
    /**
     * @udpate_PoDetail_status
     */
    .then((result) => {
      let len = result.length;
      let index = 0;
      let status = ORDER_STATUS.delivered;
      while (index < len) {
        if (
          result[index].DispatchStatus == DISPATCH_STATUS.confirm ||
          result[index].RemainingQuantity
        ) {
          //order is partially delivered if any dispatch is still in confirm status
          status = ORDER_STATUS.partialDelivery;
        }

        index++;
      }

      if (PoDetailStatus != status) {
        OrderStatusLog.create({
          ReferenceTable: "Purchase_Order_Detail",
          PoDetailID,
          OrderStatus: status,
        });
      }

      return PurchaseOrderDetail.update(
        { OrderStatus: status },
        { where: { ID: PoDetailID } }
      );
    })
    /**
     * @get_ALl_PO_Detail_status
     */
    .then((result) => {
      return PurchaseOrderDetail.findAll({
        where: { PoID },
        attributes: ["OrderStatus"],
        raw: true,
      });
    })
    /**
     * @update_purchase_order_status
     */
    .then((result) => {
      let len = result.length;
      let index = 0;
      let status = ORDER_STATUS.delivered;
      while (index < len) {
        if (
          result[index].OrderStatus != ORDER_STATUS.delivered ||
          result[index].OrderStatus != ORDER_STATUS.reject
        ) {
          //order is partially delivered if any detail order is still in partially delivered status
          status = ORDER_STATUS.partialDelivery;
        }
        index++;
      }
      if (PoStatus != status) {
        OrderStatusLog.create({
          ReferenceTable: "Purchase_Order",
          PoID,
          OrderStatus: status,
        });
      }
      return PurchaseOrder.update(
        { OrderStatus: status },
        { where: { ID: PoID } }
      );
    })
    /**
     * @send_Response_To_Server
     */
    .then((result) => {
      successResponse(res, req, null, "Confirmed successfully");
    })
    .catch((err) => {
      serverError(res, req, err);
    });
});

module.exports = router;
