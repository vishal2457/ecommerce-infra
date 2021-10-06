module.exports = (sequelize, DataType) => {
  const UserCart = sequelize.define(
    "User_Cart",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      Unit: {
        type: DataType.STRING,
        allowNull: false,
      },
      Info: {
        type: DataType.TEXT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return UserCart;
};
