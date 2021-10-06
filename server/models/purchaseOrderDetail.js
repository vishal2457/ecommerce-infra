module.exports = (sequelize, DataType) => {
  const PurchaseOrderDetail = sequelize.define(
    "Purchase_Order_Detail",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      PoID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      PricingID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      QuotationDetailID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      WarehouseID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      IsEdit: {
        type: DataType.BOOLEAN,
        defaultValue: 0
      },
      Quantity: {
        type: DataType.STRING,
        allowNull: true,
      },
      DefaultPrice: {
        type: DataType.STRING,
        allowNull: true
      },
      InquiryID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      QuotationID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      Uom: {
        type: DataType.STRING,
        allowNull: false,
      },
      PrimaryUomQty: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      Discount: {
        type: DataType.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      Amount: {
        type: DataType.FLOAT,
        allowNull: false,
      },
      RemainingQuantity: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      DispatchTotal: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      CustExpectsDelivery: {
        type: DataType.DATE,
        defaultValue: null,
      },
      ExpectedDeliveryDate: {
        type: DataType.DATE,
        defaultValue: null,
      },
      StatusChangedOn: {
        type: DataType.DATE,
        allowNull: true,
      },
      ProductUomQuantity: {
        type: DataType.STRING,
        allowNull: true,
      },
      OrderStatus: {
        type: DataType.ENUM({
          values: [
            "Pending",
            "Confirm",
            "Reject",
            "InProgress",
            "Dispatched",
            "Delivered",
            "Canceled",
            "PartialConfirm",
            "PartialDispatch",
            "PartialDelivery",
          ],
        }),
        defaultValue: "Pending",
        allowNull: false,
      },
      // Tax1: {
      //   type: DataType.INTEGER,
      //   allowNull: true,
      // },
      // Tax2: {
      //   type: DataType.INTEGER,
      //   allowNull: true,
      // },
      // Freight: {
      //   type: DataType.STRING,
      //   allowNull: false,
      // },
      // OtherCharges: {
      //   type: DataType.INTEGER,
      //   allowNull: false,
      // },
      // TotalValue: {
      //   type: DataType.INTEGER,
      //   allowNull: false,
      // },
      // CreditDays: {
      //   type: DataType.INTEGER,
      //   allowNull: false,
      // },
      // PaymentTerms: {
      //   type: DataType.STRING,
      //   allowNull: false,
      // },
      // DeliveryTerms: {
      //   type: DataType.STRING,
      //   allowNull: false,
      // },
      // Remarks: {
      //   type: DataType.STRING,
      //   allowNull: true,
      // },
      // InquiryDetailID: {
      //   type: DataType.INTEGER,
      //   allowNull: true,
      // },
      // QuotationDetailID: {
      //   type: DataType.INTEGER,
      //   allowNull: true,
      // },
      // OfferID: {
      //   type: DataType.INTEGER,
      //   allowNull: true,
      // },
      // PRD_EXP_DEL_Date: {
      //   type: DataType.DATE,
      //   allowNull: true,
      // },
      IsActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1,
      },
      OldID: {
        type: DataType.TEXT,
        allowNull: true,
      },
      IsDelete: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
      },
      createdBy: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PurchaseOrderDetail;
};
