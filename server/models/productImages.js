module.exports = (sequelize, DataType) => {
    const ProductImages = sequelize.define(
      "Product_Image",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        Image: {
          type: DataType.STRING,
          allowNull: false,
        },
        ProductID: {
            type: DataType.INTEGER,
            allowNull: false
        }
      },
      {
        freezeTableName: true,
        
      }
    );
    return ProductImages;
  };
  