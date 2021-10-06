module.exports = (sequelize, DataType) => {
    const SupplierQuotes = sequelize.define(
      "Supplier_Quotes",
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
        CustomerID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        QuotationNo: {
          type: DataType.STRING,
          allowNull: false,
        },
        Date: {
          type: DataType.DATE,
          allowNull: false,
        },
        SupplierID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        ValidityDate: {
          type: DataType.DATE,
          allowNull: false,
        },
        GrandTotal: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        CurrencyID: {
          type: DataType.INTEGER,
          allowNull: true,
        },
        AmountInWords: {
          type: DataType.STRING,
          allowNull: false,
        },
        Remarks: {
          type: DataType.STRING,
          allowNull: false,
        },
        ApproveStatus: {
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
    return SupplierQuotes;
  };
  