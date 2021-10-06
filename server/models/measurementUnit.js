module.exports = (sequelize, DataType) => {
    const MeasurementUnit = sequelize.define(
      "Measurement_Unit",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        //unit of measurment
        MeasurementUnit: {
          type: DataType.ENUM({
            values: ["Sheets", "Rolls"],
          }),
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
    return MeasurementUnit;
  };
  