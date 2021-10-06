module.exports = (sequelize, DataType) => {
  const Customer = sequelize.define(
    "Customer",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      CustomerName: {
        type: DataType.STRING,
        allowNull: true,
      },
      Number: {
        type: DataType.STRING,
        allowNull: true,
      },
      Address: {
        type: DataType.STRING,
        allowNull: true,
      },

      LandMark: {
        type: DataType.STRING,
        allowNull: true,
      },
      ZipCode: {
        type: DataType.STRING,
        allowNull: true,
      },
      CityID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      StateID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      CountryID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      Phone: {
        type: DataType.STRING,
        allowNull: true,
      },
      Email: {
        type: DataType.STRING,
        allowNull: true,
      },
      Currency: {
        type: DataType.STRING,
        allowNull: true,
      },
      Industry: {
        type: DataType.STRING,
        allowNull: true,
      },
      PaymentMethod: {
        type: DataType.ENUM({
          values: ["InternationalShipping"],
        }),
        allowNull: true,
      },
      Vat_Tax_No: {
        type: DataType.STRING,
        allowNull: true,
      },
      Latitude: {
        type: DataType.STRING,
        allowNull: true,
      },
      Longitude: {
        type: DataType.STRING,
        allowNull: true,
      },
      InConsortium: {
        type: DataType.BOOLEAN,
        default: 0,
      },
      UserCode: {
        type: DataType.STRING,
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
  return Customer;
};
