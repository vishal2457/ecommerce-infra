module.exports = (sequelize, DataType) => {
    const OffersMaster = sequelize.define(
      "Offers_Master",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        OfferName: {
          type: DataType.STRING,
          allowNull: false,
        },
        Description: {
            type: DataType.STRING,
            allowNull: false,
          },
          DiscountType: {
            type: DataType.STRING,
            allowNull: false,
          },
          DiscountValue: {
            type: DataType.INTEGER,
            allowNull: false,
          },

          //foreign key of product id
          ProductID: {
            type: DataType.INTEGER,
            allowNull: false,
          },
          StartDate: {
            type: DataType.DATE,
            allowNull: false,
          },
          EndDate: {
            type: DataType.DATE,
            allowNull: false,
          },
          OfferStatus: {
            type: DataType.STRING,
            allowNull: false,
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
    return OffersMaster;
  };
  