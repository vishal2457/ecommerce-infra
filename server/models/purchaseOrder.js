module.exports = (sequelize, DataType) => {
  const PurchaseOrder = sequelize.define(
    "Purchase_Order",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      PurchaseOrderNo: {
        type: DataType.STRING,
        allowNull: false,
      },
      CustomerID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      UserID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      OrderStatus: {
        type: DataType.ENUM({
          values: [
            "Pending",
            "Confirm",
            "PartialConfirm",
            "PartialDispatch",
            "InProgress",
            "Dispatched",
            "Delivered",
            "Canceled",
            "Reject",
            "PartialDelivery",
          ],
        }),
        defaultValue: "Pending",
        allowNull: true,
      },
      AddressID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Total: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      SubTotal: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      ShippingCharge: {
        type: DataType.FLOAT,
        allowNull: true,
      },

      //Expected delivery date
      ExpDelDate: {
        type: DataType.DATE,
        allowNull: true,
      },
      DesiredDate: {
        type: DataType.DATE,
        allowNull: true,
      },
      ConfirmationDate: {
        type: DataType.DATE,
        allowNull: true,
      },
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
  return PurchaseOrder;
};
