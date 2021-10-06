import React from 'react'
import { dateFormatter, formatPrice, DISPATCH_STATUS } from '../../utility/commonUtility';


function PurchaseOrderProductList({ item, index }) {

  const calculateDispatchTotal = () => {
    if (!item?.Dispatch_Order_Details?.length) return 0;
    let total = 0;
    let amount = 0;
    for (let singleDispatch of item?.Dispatch_Order_Details) {
      total += singleDispatch?.TotalDispatchQuantity;
      amount += singleDispatch?.CurrentDispatchAmount;
    }
    let pendingAmount = formatPrice(item?.Amount - amount);
    return {
      TotalDispatchQuantity: total,
      // TotalDispatchAmount: amount,
      pendingQuantity: item?.Quantity - total,
      pendingAmount,
      DispatchAmount: formatPrice(amount),
    };
  };

  const DispatchDetails = React.useMemo(() => {
    return calculateDispatchTotal();
  });


  return (
    <>
      <tr>
        <td width="4%" align="center">
          {index + 1}
        </td>
        <td width="40%">
          <span>Item Code:</span>{item?.Product_Master?.ProductNo}<br />
          <span>Item Name: {item?.Product_Master?.ProductName}</span>
        </td>
        <td>{item?.Quantity} ({item?.Uom})</td>
        <td>{DispatchDetails?.TotalDispatchQuantity || 0}</td>
        <td>{DispatchDetails?.DispatchAmount || 0}</td>
        <td>{DispatchDetails?.pendingQuantity || 0}</td>
        <td>{DispatchDetails?.pendingAmount || 0}</td>
        <td className="text-right">{item?.Amount}</td>
      </tr>
      <tr>
        <td></td>
        <td colSpan="7" className="nopadding">
          {item?.Dispatch_Order_Details.length ? (
            <>
              <table className="custom_table"
                border="0"
                width="100%"
                cellpadding="5"
                cellspacing="0">
                <thead>
                  <tr>
                    <th width="15%">Dispatch No</th>
                    <th width="15%">Dispatch Date</th>
                    <th width="15%">Dispatch QTY</th>
                    <th width="20%">Dispatch Amount</th>
                    <th width="20%">Delivery Address</th>
                    <th width="15%">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {item?.Dispatch_Order_Details.map(
                    (dispatchItem, index) => {
                      return <tr>
                        <td>{dispatchItem?.Dispatch_Order?.DispatchOrderNo}</td>
                        <td>{dateFormatter(dispatchItem?.Dispatch_Order?.DispatchDate, "getInIso")}</td>
                        <td>{dispatchItem?.TotalDispatchQuantity} ({item?.Uom})</td>
                        <td>{dispatchItem?.CurrentDispatchAmount}</td>
                        <td>{dispatchItem?.Dispatch_Order?.Address}</td>
                        <td>{dispatchItem?.DispatchStatus == DISPATCH_STATUS.delivered ? "Delivered" : "Not Received"}</td>
                      </tr>
                    }
                  )}
                </tbody>
              </table>
            </>
          ) : null}
        </td>
      </tr>
    </>
  )

}

export default PurchaseOrderProductList
