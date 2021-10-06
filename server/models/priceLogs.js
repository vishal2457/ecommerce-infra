module.exports = (sequelize, DataType) => {
    const PriceLogs = sequelize.define(
      "Price_Logs",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        SupplierID:{
          type: DataType.INTEGER,
          allowNull: true,
        },
        UpdatedProducts:{
          type: DataType.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        AddedProducts:{
          type: DataType.INTEGER,
          allowNull: true,
          defaultValue: 0,
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
    return PriceLogs;
  };
  