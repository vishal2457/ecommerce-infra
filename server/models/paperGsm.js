module.exports = (sequelize, DataType) => {
    const PaperGsm = sequelize.define(
      "Paper_Gsm",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        PaperGsm: {
          type: DataType.STRING,
          allowNull: false,
        },
        Description: {
          type: DataType.TEXT,
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
    return PaperGsm;
  };
  