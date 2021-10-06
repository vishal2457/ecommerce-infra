import React from "react";
import {
  dateFormatter,
  formatPrice,
  DISPATCH_STATUS,
  getLocaleString,
} from "../../utility/commonUtility";

function CustomerInquiryProductList({ item, index }) {
  return (
    <>
      <tr>
        <td width="5%" align="center">
          {index + 1}
        </td>
        <td width="15%">
          <span>Item Code:</span>
          {item?.Product_Master?.ProductNo}
          <br />
          <span>Item Name: {item?.Product_Master?.ProductName}</span>
        </td>
        <td width="10%">
          {item?.Quantity} ({/* {item?.QuotationDetails?.Unit} */}
          {item?.Unit})
        </td>
        <td width="10%">{getLocaleString(item?.QuotationDetails?.Price)}</td>
        <td width="10%">{getLocaleString(item?.QuotationDetails?.Amount)}</td>
        <td width="10%">
          {item?.ExpectedDate
            ? dateFormatter(item?.ExpectedDate, "getInIso")
            : ""}
        </td>
        <td width="10%">
          {item?.ExpectedDate
            ? dateFormatter(
                item?.QuotationDetails?.ExpectedDeliveryDate,
                "getInIso"
              )
            : ""}
        </td>
        <td width="10%">{item?.QuotationDetails?.Terms_Master?.Description}</td>
        <td width="10%">{item?.QuotationDetails?.Remarks}</td>
      </tr>
    </>
  );
}

export default CustomerInquiryProductList;
