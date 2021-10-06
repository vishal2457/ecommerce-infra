import dynamic from "next/dynamic";
import React from "react";
import { dateFormatter, DISPATCH_STATUS } from "../../../utility/commonUtility";
import { Button } from "../../UI";
const Overlay = dynamic(() => import("../../Shared/Overlay"));

function DispatchDetail({ dispatchItem, item, orderReceived, PoDetail }) {

  const DispatchInfo = () => {
    return <ul>
      <li><b>Address:</b> {dispatchItem?.Dispatch_Order?.Address}</li>
      <li><b>Vehicle No:</b> {dispatchItem?.Dispatch_Order?.VehicleNo}</li>
      <li><b>Transporter:</b> {dispatchItem?.Dispatch_Order?.Transporter}</li>
      <li><b>Comments:</b> {dispatchItem?.Dispatch_Order?.Comments}</li>
    </ul>
  }
  
  return (
    <tr>
      <td>{dispatchItem?.Dispatch_Order?.DispatchOrderNo}</td>
      <td className="text-center">
        {dateFormatter(dispatchItem?.Dispatch_Order?.DispatchDate, "getInIso")}
      </td>
      <td className="text-center">{dispatchItem?.TotalDispatchQuantity}</td>
      <td className="text-center">{item?.Uom}</td>
      {/* <td>Price</td> */}
      <td className="text-center">{dispatchItem?.CurrentDispatchAmount}</td>
      <td className="text-center">
        <Overlay
          // placement="top"
          trigger={`click`}
          heading={`Dispatch information`}
          component={<DispatchInfo />}
        />
          {/* <i
            className="fa fa-map-marker pointer"
            style={{ fontSize: "20px" }}
          /> */}
        {/* </Overlay> */}
      </td>
      <td className="text-center">
        {dispatchItem?.DispatchStatus == DISPATCH_STATUS.delivered
          ? "Delivered"
          : "Not Received"}
      </td>
      <td className="text-center">
        {dispatchItem?.DispatchStatus == DISPATCH_STATUS.delivered ? (
          "-"
        ) : (
          <Button
            className="px-2 py-0 btn btn-sm btn-outline-dark"
            onClick={() =>
              orderReceived({
                DispatchID: dispatchItem?.Dispatch_Order?.ID,
                PoDetailID: PoDetail?.ID,
                PoDetailStatus: PoDetail?.OrderStatus,
              })
            }
          >
            Received
          </Button>
        )}
      </td>
    </tr>
  );
}

export default DispatchDetail;
