module.exports = (sequelize, DataType) => {
  const User_Master = sequelize.define(
    "User_Master",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      UserName: {
        type: DataType.STRING,
        allowNull: false,
      },
      ReferenceID:{
        type: DataType.INTEGER,
        allowNull: true,
      },
      CustomerAdmin: {
        type: DataType.BOOLEAN,
        defaultValue: 0
      },
      Email: {
        type: DataType.STRING,
        allowNull: false,
      },
      Password: {
        type: DataType.STRING,
        allowNull: true,
      },
      RoleID:{
        type: DataType.INTEGER,
      },
      token: {
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
  return User_Master;
};
