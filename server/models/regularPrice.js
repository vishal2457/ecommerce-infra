//consortium prices
module.exports = (sequelize, DataType) => {
  const RegularPrice = sequelize.define(
    "Pricing",
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
      ProductUom: {
        type: DataType.STRING,
        allowNull: false
      },
      GroupID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      MinQty: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      OrderingUnit: {
        type: DataType.STRING,
        allowNull: true,
      },
      PackagingUnitRies: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      PackagingUnitPallete: {
        type: DataType.INTEGER,
        allowNull: true,
      },

      PricingUnit: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      rollType: {
        type: DataType.ENUM({
          values: ["rolls", "kg"],
        }),
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
    },
    {
      freezeTableName: true,
    }
  );
  return RegularPrice;
};
