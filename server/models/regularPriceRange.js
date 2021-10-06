module.exports = (sequelize, DataType) => {
  const RegularPriceRange = sequelize.define(
    "Price_Range",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Quantity: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Price: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Percentage: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      PricingPerUnit: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      MinQty: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      PricingPerUnitRies: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      PricingPerUnitPallete: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      PriceID: {
        type: DataType.INTEGER,
        allowNull: false,
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
    },
    {
      freezeTableName: true,
    }
  );
  return RegularPriceRange;
};
