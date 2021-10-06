module.exports = (sequelize, DataType) => {
    const Supplier_Warehouse = sequelize.define(
      "Supplier_Warehouse",
      {
        ID: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        WarehouseName: {
          type: DataType.STRING,
          allowNull: false,
        },
        SupplierID: {
            type: DataType.INTEGER,
            allowNull: false,
          },
        WarehouseNumber: {
          type: DataType.STRING,
          allowNull: false,
        },
        ShortName: {
          type: DataType.STRING,
          allowNull: false,
        },
        Address: {
          type: DataType.STRING,
          allowNull: false,
        },
        ZipCode: {
          type: DataType.STRING,
          allowNull: false,
        },
        CityID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        StateID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        CountryID: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        Phone: {
          type: DataType.STRING,
          allowNull: false,
        },
        Email: {
          type: DataType.STRING,
          allowNull: false,
        },
      
        Area: {
          type: DataType.STRING,
          allowNull: true
        },
        Industry: {
          type: DataType.STRING,
          allowNull: false,
        },
      
        Latitude: {
          type: DataType.STRING,
          allowNull: false,
        },
        Longitude: {
          type: DataType.STRING,
          allowNull: false,
        },
        DeliveryMiles: {
          type: DataType.INTEGER,
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
    return Supplier_Warehouse;
  };
  