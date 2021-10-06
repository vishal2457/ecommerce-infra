module.exports = (sequelize, DataType) => {
  const Supplier = sequelize.define(
    "Supplier",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      SupplierName: {
        type: DataType.STRING,
        allowNull: false,
      },
      Number: {
        type: DataType.STRING,
        allowNull: false,
      },
      ShortName: {
        type: DataType.STRING,
        allowNull: true,
      },
      Address: {
        type: DataType.STRING,
        allowNull: false,
      },

      LandMark: {
        type: DataType.STRING,
        allowNull: false,
      },
      ZipCode: {
        type: DataType.STRING,
        allowNull: false,
      },
      CityID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      StateID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      CountryID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Phone: {
        type: DataType.STRING,
        allowNull: true,
      },
      Email: {
        type: DataType.STRING,
        allowNull: false,
      },
      ByAdmin: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
      },
      Currency: {
        type: DataType.STRING,
        allowNull: true,
      },
      Industry: {
        type: DataType.STRING,
        allowNull: false,
      },
      PaymentTerms: {
        type: DataType.STRING,
        allowNull: true,
      },
      DeliveryTerms: {
        type: DataType.STRING,
        allowNull: true,
      },
      Vat_Tax_No: {
        type: DataType.STRING,
        allowNull: false,
      },
      Latitude: {
        type: DataType.STRING,
        allowNull: true,
      },
      Longitude: {
        type: DataType.STRING,
        allowNull: true,
      },
      DeliveryMiles: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      ContactPersonName: {
        type: DataType.STRING,
        allowNull: false,
      },
      IsApproved: {
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
  return Supplier;
};
