module.exports = (sequelize, DataType) => {
  const DispatchOrderDetail = sequelize.define(
    "Dispatch_Order_Detail",
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
      DispatchID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      PoDetailID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      ProductUnit: {
        type: DataType.STRING,
        allowNull: true,
      },
      RemainingQuantity: {
        type: DataType.FLOAT,
        allowNull: true
      },
      TotalDispatchQuantity: {
        type: DataType.FLOAT,
        allowNull: true
      },
      CurrentDispatchAmount: {
        type: DataType.FLOAT,
        allowNull: true
      },
      DispatchStatus: {
        type: DataType.ENUM({
          values: ["draft", "confirm", "cancel", "delivered"],
        }),
        defaultValue: "draft",
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
  return DispatchOrderDetail;
};
