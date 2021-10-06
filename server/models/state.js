module.exports = (sequelize, DataType) => {
    const State = sequelize.define(
      "State",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        State: {
          type: DataType.STRING,
          allowNull: false,
        },
        CountryID:{
            type: DataType.INTEGER,
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
    return State;
  };
  