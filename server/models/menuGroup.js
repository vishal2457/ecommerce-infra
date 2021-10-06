module.exports = (sequelize, DataType) => {
  const Menu_Group = sequelize.define(
    "Menu_Group",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      MenuGroup: {
        type: DataType.STRING,
        allowNull: false,
      },
      Icon: {
        type: DataType.STRING,
        allowNull: false,
      },
      SeqNo: {
        type: DataType.STRING,
        allowNull: true,
      },
      IsActive: {
        type: DataType.INTEGER,
        default: 0,
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
  return Menu_Group;
};
