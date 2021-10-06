module.exports = (sequelize, DataType) => {
  const WarehouseProducts = sequelize.define(
    "Warehouse_Products",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      WarehouseID: {
        type: DataType.INTEGER,
      },
      ProductID: {
        type: DataType.INTEGER,
      },
      SupplierID: {
        type: DataType.INTEGER,
      },
      StockQuantity: {
        type: DataType.INTEGER,
      },
      AddQuantity: {
        type: DataType.INTEGER,
      },
      MinusQuantity: {
        type: DataType.INTEGER,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return WarehouseProducts;
};
