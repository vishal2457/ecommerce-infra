module.exports = (sequelize, DataType) => {
  let inquiryStatus = {
    sent: "sent",
    draft: "draft",
    cancel: "cancel",
  };
  const InquiryMaster = sequelize.define(
    "Inquiry_Master",
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
      UserID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      InquiryNo: {
        type: DataType.STRING,
        allowNull: false,
      },
      Date: {
        type: DataType.DATE,
        allowNull: true,
      },
      Status: {
        type: DataType.ENUM({
          values: [
            inquiryStatus.sent,
            inquiryStatus.draft,
            inquiryStatus.cancel,
          ],
        }),
        defaultValue: inquiryStatus.sent,
      },
      Remarks: {
        type: DataType.TEXT,
        allowNull: true,
      },
      ValidTill: {
        type: DataType.DATE,
        allowNull: true,
      },
      AddressID: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      DeliveryAddress: {
        type: DataType.TEXT,
        allowNull: false,
      },

      // FinancialYear: {
      //   type: DataType.STRING,
      //   allowNull: false,
      // },
      // Fy_Seq_No: {
      //   type: DataType.STRING,
      //   allowNull: false,
      // },
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
  return InquiryMaster;
};
