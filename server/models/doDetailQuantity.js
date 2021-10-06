module.exports = (sequelize, DataType) => {
    const DoDetailQuantity = sequelize.define(
      "Do_Detail_Quantity",
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
        DispatchOrderDetailID: {
            type: DataType.INTEGER,
            allowNull: false
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
        WarehouseID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        ProductUnit: {
          type: DataType.STRING,
          allowNull: true,
        },
        DispatchQuantity: {
          type: DataType.FLOAT,
          allowNull: false,
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
    return DoDetailQuantity;
  };
  