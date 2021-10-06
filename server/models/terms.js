module.exports = (sequelize, DataType) => {
  let terms = {
    payment: "PaymentTerms",
    delivery: "DeliveryTerms",
  };
  const TermsMaster = sequelize.define(
    "Terms_Master",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      SupplierID: {
        type: DataType.INTEGER,
        allowNull: false,
      },

      Code: {
        type: DataType.STRING,
        allowNull: false,
      },

      Description: {
        type: DataType.STRING,
        allowNull: false,
      },

      Type: {
        type: DataType.ENUM({
          values: [terms.payment, terms.delivery],
        }),
        defaultValue: terms.payment,
      },

      IsActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1,
      },

      OldID: {
        type: DataType.TEXT,
        allowNull: true,
      },

      IsDelete: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
      },

      createdBy: {
        type: DataType.INTEGER,
        allowNull: true,
      },

      updatedBy: {
        type: DataType.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return TermsMaster;
};
