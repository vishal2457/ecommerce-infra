module.exports = (sequelize, DataType) => {
    const PoDelStatus = sequelize.define(
      "Po_Del_Status",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        POID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        StageStatus: {
            type: DataType.STRING,
            allowNull: false,
          },
          Date: {
            type: DataType.DATE,
            allowNull: false,
          },
          CustomerID: {
            type: DataType.INTEGER,
            allowNull: false,
          },
          SupplierID: {
            type: DataType.INTEGER,
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
    return PoDelStatus;
  };
  