module.exports = (sequelize, DataType) => {
  const Notification = sequelize.define(
    "Notification",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      CustomerID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      RoleID: {
        //
        type: DataType.INTEGER,
        allowNull: false,
      },
      NotificationType: {
        type: DataType.STRING,
        allowNull: true,
      },
      Reference: {
        type: DataType.STRING,
        allowNull: true,
      },
      Read: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
      },
      Title: {
        type: DataType.TEXT,
        allowNull: false,
      },
      Description: {
        type: DataType.TEXT,
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
  return Notification;
};
