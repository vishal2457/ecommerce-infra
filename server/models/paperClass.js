module.exports = (sequelize, DataType) => {
    const PaperClass = sequelize.define(
      "Paper_Class",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        PaperClass: {
          type: DataType.STRING(250),
          allowNull: false,
        },
        Description: {
          type: DataType.TEXT,
          allowNull: true,
        },
        IsActive: {
          type: DataType.BOOLEAN,
          defaultValue: 1
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
    return PaperClass;
  };
  