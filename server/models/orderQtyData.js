module.exports = (sequelize, DataType) => {
    const OrderQtyData = sequelize.define(
      "Order_Qty_Data",
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
        PoDetailID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        WarehouseID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        Quantity: {
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
    return OrderQtyData;
  };
  