module.exports = (sequelize, DataType) => {
    const City = sequelize.define(
      "City",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        City: {
          type: DataType.STRING,
          allowNull: false,
        },
        StateID:{
            type: DataType.INTEGER,
            allowNull: true
        },
        CountryID:{
            type: DataType.INTEGER,
            allowNull: true
        },
        IsActive: {
          type: DataType.BOOLEAN,
         default: 1
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
    return City;
  };
  