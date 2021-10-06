module.exports = (sequelize, DataType) => {
    const ReservedQuantity = sequelize.define(
      "Reserved_Quantity",
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
        ProductID: {
          type: DataType.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        ReservedQuantity: {
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
    return ReservedQuantity;
  };
  