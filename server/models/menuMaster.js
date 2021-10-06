module.exports = (sequelize, DataType) => {
  const Menu_Master = sequelize.define(
    "Menu_Master",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      MenuName: {
        type: DataType.STRING,
        allowNull: false,
      },
      Link: {
        type: DataType.STRING,
        allowNull: false,
      },
      Icon: {
        type: DataType.STRING,
        allowNull: true,
      },
      SeqNo: {
        type: DataType.INTEGER,
        default: 0,
      },
      MenuGroupID:{
        type: DataType.INTEGER,
      },  
      IsActive: {
          type: DataType.INTEGER,
          default: 1,
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
  return Menu_Master;
};
