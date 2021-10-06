module.exports = (sequelize, DataType) => {
    const ChatMessages = sequelize.define(
      "Chat_Messages",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        ChatID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        Username: {
          type: DataType.STRING,
          allowNull: false
        },
        ChatRoom: {
          type: DataType.STRING,
          allowNull: false
        },
        UserID:{
            type: DataType.INTEGER,
            allowNull: false
        },
        Message: {
            type:DataType.TEXT,
            allowNull: false
        },
        Read: {
            type:DataType.INTEGER,
            defaultValue: 0
        },
        Type: {
          type: DataType.ENUM({
            values: [
              "Customer",
              "Supplier"
            ],
          }),
          defaultValue: "Customer"
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
          },
      },
      {
        freezeTableName: true,
        
      }
    );
    return ChatMessages;
  };
  