module.exports = (sequelize, DataType) => {
  const ProductMaster = sequelize.define(
    "Product_Master",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ProductNo: {
        type: DataType.STRING,
        allowNull: false,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ProductName: {
        type: DataType.STRING,
        allowNull: false,
      },
      ProductDescription: {
        type: DataType.STRING,
        allowNull: false,
      },
      GrammageAndFormat: {
        type: DataType.STRING,
        allowNull: true,
      },
      RPT: {
        // Recommended Printing Technology
        type: DataType.STRING,
        allowNull: true,
      },
      StockQuantity: {
        type: DataType.INTEGER,
        defaultValue: null,
      },
      PaymentTerms: {
        type: DataType.STRING,
      },

      DeliveryTerms: {
        type: DataType.STRING,
      },
      GroupID: {
        type: DataType.INTEGER,
      },
      SubGroupID: {
        type: DataType.INTEGER,
      },
      PaperClassID: {
        type: DataType.INTEGER,
      },
      PaperQualityID: {
        type: DataType.INTEGER,
      },
      PaperPrintibilityID: {
        type: DataType.INTEGER,
      },
      UomID: {
        type: DataType.INTEGER,
      },
      GsmID: {
        type: DataType.INTEGER,
      },
      GrainID: {
        type: DataType.INTEGER,
      },
      ColorID: {
        type: DataType.INTEGER,
      },
      RunningDirectionID: {
        type: DataType.INTEGER,
      },
      RiesID: {
        type: DataType.INTEGER,
      },
      StrengthID: {
        type: DataType.INTEGER,
      },
      Thickness: {
        type: DataType.FLOAT,
      },
      Width: {
        type: DataType.FLOAT,
      },
      Height: {
        type: DataType.FLOAT,
      },
      Weight: {
        type: DataType.FLOAT,
      },
      IsActive: {
        type: DataType.INTEGER,
        defaultValue: 1,
      },
      HasPricing: {
        type: DataType.INTEGER,
        defaultValue: 0,
      },
      IsPublished: {
        type: DataType.INTEGER,
        defaultValue: 0,
      },
      Search: {
        type: DataType.STRING,
        allowNull: true,
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
  return ProductMaster;
};
