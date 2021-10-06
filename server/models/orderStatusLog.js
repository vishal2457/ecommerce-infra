/**
 * @Description this table is to maintain the status history of the po and po detail
 */
module.exports = (sequelize, DataType) => {
  const OrderStatusLog = sequelize.define(
    "Order_Status_Log",
    {
      ID: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ReferenceTable: {
        type: DataType.STRING,
        allowNull: false,
      },
      /**
       * @foreign_key for purchase_order_detail
       */
      PoDetailID: {
        type: DataType.INTEGER,
        allowNull: true,
      },
      /**
       * @foreign_key for po master
       */
      PoID: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      OrderStatus: {
        type: DataType.ENUM({
          values: [
            "Pending",
            "Confirm",
            "Reject",
            "InProgress",
            "Dispatched",
            "Delivered",
            "Canceled",
            "PartialConfirm",
            "PartialDispatch",
            "PartialDelivery"
          ],
        }),
        defaultValue: "Pending",
        allowNull: false,
      },
      StatusChangedOn: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
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
  return OrderStatusLog;
};
