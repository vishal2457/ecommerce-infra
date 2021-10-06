module.exports = (sequelize, DataType) => {
    const TargetYear = sequelize.define(
      "Target_Year",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
   
        targetYear: {
          type: DataType.STRING(250),
          allowNull: false,
        },
        from: {
          type: DataType.DATE,
          allowNull: false,
        },
        to: {
          type: DataType.DATE,
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
    return TargetYear;
  };
  