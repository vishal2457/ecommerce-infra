module.exports = (sequelize, DataType) => {
    let quotationStatus = {
      sent: 'sent',
      draft: 'draft'
    }
    const QuotationMaster = sequelize.define(
      "Quotation_Master",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        QuotationNo: {
          type: DataType.STRING,
          allowNull: false,
        },
        
        InquiryID: {
          type: DataType.INTEGER,
          allowNull: true
        },

        SupplierID: {
          type: DataType.INTEGER,
          allowNull: false
        },

        Status: {
          type: DataType.ENUM({
            values: [quotationStatus.sent, quotationStatus.draft],
          }),
          defaultValue: quotationStatus.sent
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
    return QuotationMaster;
  };
  