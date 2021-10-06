module.exports = (sequelize, DataType) => {
    const Role_Master = sequelize.define(
      "Role_Master",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        RoleName: {
          type: DataType.STRING,
          allowNull: false,
        },
      Permission: {
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
    return Role_Master;
  };
  