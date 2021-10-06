module.exports = (sequelize, DataType) => {
    const InquirySuppliers = sequelize.define(
      "Inquiry_Suppliers",
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
        SupplierID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        DataSend: {
          type: DataType.STRING,
          allowNull: true,
        },
        QoatationID: {
          type: DataType.STRING,
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
    return InquirySuppliers;
  };
  