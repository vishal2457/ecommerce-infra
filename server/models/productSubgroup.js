//Product sub group
module.exports = (sequelize, DataType) => {
    const ProductSubgroup = sequelize.define(
      "Product_Subgroup",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        ProductSubgroup: {
          type: DataType.STRING,
          allowNull: false,
        },
        Code: {
          type: DataType.STRING,
          allowNull: false,
        },
        Description: {
          type: DataType.TEXT,
          allowNull: true,
        },
        GroupID:{
            type: DataType.INTEGER,
            allowNull: false
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
    return ProductSubgroup;
  };