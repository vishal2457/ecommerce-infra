module.exports = (sequelize, DataType) => {
  const InquiryDetails = sequelize.define(
    "Inquiry_Details",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      InquiryID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: false
      },
      Quantity: {
        type: DataType.FLOAT,
        allowNull: true,
      },
      Unit: {
        type: DataType.STRING,
        allowNull: true,
      },
      Remarks: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
      },
      ExpectedDate: {
        type: DataType.DATE,
        allowNull: false,
      },
      IsQuoted: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
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
  return InquiryDetails;
};
