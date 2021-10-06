import React from "react";
import {
  dateFormatter,
  formatPrice,
  DISPATCH_STATUS,
  getLocaleString,
  UOM_TYPES,
} from "../../utility/commonUtility";

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

  // const DispatchDetails = React.useMemo(() => {
  //   return calculateDispatchTotal();
  // });

  const getUom = (parentUom, childUom) => {
    if(parentUom == UOM_TYPES.rolls && childUom == UOM_TYPES.pallete ) {
      return `Carton`
    }else {
      return childUom
    }
  }

  return (
    <>
      <tr>
        <td width="4%" align="center">
          {index + 1}
        </td>
        <td width="40%">
          <span>Item Code:</span>
          {item?.Product_Master?.ProductNo}
          <br />
          <span>Item Name: {item?.Product_Master?.ProductName}</span>
        </td>
        
        <td>
          {item?.Quantity} ({getUom(item?.Product_Master?.Measurement_Unit?.MeasurementUnit, item?.Uom)  })
        </td>
        <td>
          {item?.DefaultPrice}
        </td>
        {/* <td>{DispatchDetails?.TotalDispatchQuantity || 0}</td>
        <td>{DispatchDetails?.DispatchAmount || 0}</td>
        <td>{DispatchDetails?.pendingQuantity || 0}</td>
        <td>{DispatchDetails?.pendingAmount || 0}</td> */}
        <td className="text-right">{getLocaleString(item?.Amount)}</td>
      </tr>
    </>
  );
}

export default PurchaseOrderProductList;
