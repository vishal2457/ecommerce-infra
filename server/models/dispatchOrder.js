module.exports = (sequelize, DataType) => {
  const DispatchOrder = sequelize.define(
    "Dispatch_Order",
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
      DispatchOrderNo: {
        type: DataType.STRING,
        allowNull: false,
      },
      PoID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      CustomerID: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Address: {
        type: DataType.STRING,
        allowNull: false,
      },
      ZipCode: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      DispatchTotal: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      DeliveryCharges: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      OtherCharges: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      DispatchDate: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      PoDate: {
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
      },
      SubTotal: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      DispatchStatus: {
        type: DataType.ENUM({
          values: ["draft", "confirm", "cancel", "delivered"],
        }),
        defaultValue: "draft",
      },
      ConfirmationDate: {
        type: DataType.DATE,
        allowNull: true,
      },
      Transporter: {
        type: DataType.STRING,
        allowNull: true,
      },
      VehicleNo: {
        type: DataType.STRING,
        allowNull: true,
      },
      Comments: {
        type: DataType.STRING,
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
  return DispatchOrder;
};
