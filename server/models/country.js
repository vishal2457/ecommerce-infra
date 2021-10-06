module.exports = (sequelize, DataType) => {
  const Country = sequelize.define(
    "Country",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Country: {
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
  return Country;
};
