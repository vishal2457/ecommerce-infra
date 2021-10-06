module.exports = (sequelize, DataType) => {
  const QuotationDetails = sequelize.define(
    "Quotation_Details",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      QuotationID: {
        type: DataType.INTEGER,
        allowNull: false,
      },

      ProductID: {
        type: DataType.INTEGER,
        allowNull: false,
      },

      Quantity: {
        type: DataType.FLOAT,
        allowNull: true,
      },

      Price: {
        type: DataType.FLOAT,
        allowNull: false,
      },
      Amount: {
        type: DataType.FLOAT,
        allowNull: true
      },
      Unit: {
        type: DataType.STRING,
        allowNull: true,
      },

      ExpectedDeliveryDate: {
        type: DataType.DATE,
        allowNull: false,
      },

      Terms: {
        type: DataType.STRING,
        allowNull: false,
      },
      
      Remarks: {
        type: DataType.STRING,
        allowNull: true,
      },
     
      IsActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1,
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
  return QuotationDetails;
};
