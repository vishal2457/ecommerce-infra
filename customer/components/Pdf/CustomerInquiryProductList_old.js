import React from 'react'
import { dateFormatter, formatPrice, DISPATCH_STATUS } from '../../utility/commonUtility';


function CustomerInquiryProductList({ item, index }) {

  //console.log(item);

  // const calculateDispatchTotal = () => {
  //   if (!item?.QuotationDetails?.length) return 0;
  //   let total = 0;
  //   let amount = 0;
  //   for (let singleDispatch of item?.Dispatch_Order_Details) {
  //     total += singleDispatch?.TotalDispatchQuantity;
  //     amount += singleDispatch?.CurrentDispatchAmount;
  //   }
  //   let pendingAmount = formatPrice(item?.Amount - amount);
  //   return {
  //     TotalDispatchQuantity: total,
  //     // TotalDispatchAmount: amount,
  //     pendingQuantity: item?.Quantity - total,
  //     pendingAmount,
  //     DispatchAmount: formatPrice(amount),
  //   };
  // };

  // const DispatchDetails = React.useMemo(() => {
  //   return calculateDispatchTotal();
  // });


  return (
    <>
      <tr>
        <td width="4%" align="center">{index + 1}</td>
        <td width="40%">
          <span>Item Code:</span>{item?.Product_Master?.ProductNo}<br />
          <span>Item Name: {item?.Product_Master?.ProductName}</span>
        </td>
        <td>{item?.Quantity} ({item?.Product_Master?.Measurement_Unit?.MeasurementUnit})</td>
        <td>{item?.Supplier?.SupplierName}</td>
        <td>{item?.ExpectedDate ? dateFormatter(item?.ExpectedDate, "getInIso") : ""}</td>
        <td>{item?.Remarks}</td>

      </tr>
      <tr>
        <td></td>
        <td colSpan="7" className="nopadding">
          {item?.QuotationDetails?.ID ? (
            <>
              <table className="custom_table"
                border="0"
                width="100%"
                cellpadding="5"
                cellspacing="0">
                <thead>
                  <tr>
                    <th colSpan="5">Quotation by {item?.Supplier?.SupplierName}</th>
                  </tr>
                  <tr>
                    <th width="15%">Price</th>
                    <th width="15%">Quantity</th>
                    <th width="15%">Expected Date</th>
                    <th width="20%">Terms</th>
                    <th width="15%">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {item?.QuotationDetails.map(
                    (QuotationItem, index) => { */}
                  <tr>
                    <td>&euro;&nbsp;{item?.QuotationDetails?.Price}</td>
                    <td>{item?.QuotationDetails?.Quantity} ({item?.QuotationDetails?.Unit})</td>
                    <td>{item?.QuotationDetails?.ExpectedDeliveryDate ? dateFormatter(item?.QuotationDetails?.ExpectedDeliveryDate, "getInIso") : ""}</td>
                    <td>{item?.QuotationDetails?.Terms}</td>
                    <td>{item?.QuotationDetails?.Remarks}</td>
                  </tr>
                  {/* }
                  )} */}
                </tbody>
              </table>
            </>
          ) : (
            <table className="custom_table"
              border="0"
              width="100%"
              cellpadding="5"
              cellspacing="0">
              <tbody>
                <tr>
                  <td colSpan="5">Not Quoted</td>
                </tr>
              </tbody>
            </table>
          )}
        </td>
      </tr>
    </>
  )

}

export default CustomerInquiryProductList
