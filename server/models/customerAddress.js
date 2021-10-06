module.exports = (sequelize, DataType) => {
  const Customer_Address = sequelize.define(
    "Customer_Address",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Title: {
        type: DataType.STRING,
        allowNull: false,
      },
      Address: {
        type: DataType.STRING,
        allowNull: true,
      },
      IsActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1,
      },
      CustomerID: {
        type: DataType.INTEGER,
        allowNull: false
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
      PaymentMethod: {
        type: DataType.ENUM({
          values: ["InternationalShipping"],
        }),
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
  return Customer_Address;
};
