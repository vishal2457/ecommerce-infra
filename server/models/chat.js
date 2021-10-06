module.exports = (sequelize, DataType) => {
    const Chat = sequelize.define(
      "Chat",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        CustomerID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        SupplierID:{
            type: DataType.INTEGER,
            allowNull: true
        },
        RoomID: {
          type: DataType.STRING,
          allowNull: false
        }
      },
      {
        freezeTableName: true,
        
      }
    );
    return Chat;
  };
  