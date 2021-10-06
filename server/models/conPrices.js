//consortium prices
module.exports = (sequelize, DataType) => {
    const ConsortiumPrices = sequelize.define(
      "Consortium_Prices",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        ProductID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        MinQty: {
            type: DataType.INTEGER,
            allowNull: false,
          },
          MaxOty: {
            type: DataType.STRING,
            allowNull: false,
          },
          PricePu: {
            type: DataType.STRING,
            allowNull: false,
          },
          SupplierID: {
            type: DataType.INTEGER,
            allowNull: false,
          },
          WarehouseID: {
            type: DataType.INTEGER,
            allowNull: false,
          },
        IsActive: {
          type: DataType.BOOLEAN,
         defaultValue: 1
        },
        OldID: {
          type: DataType.TEXT,
          allowNull: true
        },
        IsDelete: {
          type: DataType.BOOLEAN,
          defaultValue: 0
        },
        createdBy: {
          type: DataType.INTEGER,
          allowNull: true
        },
        updatedBy: {
          type: DataType.INTEGER,
          allowNull: true
        }
      },
      {
        freezeTableName: true,
      }
    );
    return ConsortiumPrices;
  };
  