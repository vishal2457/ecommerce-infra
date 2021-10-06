module.exports = (sequelize, DataType) => {
    const Group = sequelize.define(
      "Group",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        SupplierID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        GroupName: {
          type: DataType.STRING,
          allowNull: false,
        },
        GroupDescription: {
            type: DataType.STRING,
            allowNull: false,
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
    return Group;
  };
  