import React from "react";
import { Card, CardBody, CardHeader } from "../../UI";
import {
  dateFormatter,
  getFormattedStatus,
  PAYMENT_METHODS,
  formatPrice,
  getLocaleString,
} from "../../../utility/commonUtility";

import StatusOverlay from "../../Shared/StatusOverlay";

function OrderCard({ orderDetail, active, changeActivetab, index }) {
  const getPaymentMethod = () => {
    return PAYMENT_METHODS.filter(
      (item) => item.ID == orderDetail?.Customer_Address?.PaymentMethod
    )[0]?.name;
  };

  const getTotal = () => {
    // return parseFloat(orderDetail?.SubTotal) + 0 + 0;
    return orderDetail?.SubTotal + 0 + 0;
  };

  const total = React.useMemo(() => {
    // return formatPrice(getTotal());
    return getTotal();
  }, [orderDetail?.Total, orderDetail?.SubTotal]);

  const paymentMethod = React.useMemo(() => {
    return getPaymentMethod();
  }, [orderDetail?.PaymentMethod]);

  // /**
  //  * @returns pending dispatch value
  //  */
  // const calculatePendingDispatchValue = () => {
  //   if (!orderDetail?.Dispatch_Orders?.length) return 0;
  //   let pendingDispatchValue = 0;
  //   for (let singleDispatchOrder of orderDetail?.Dispatch_Orders) {
  //     pendingDispatchValue += singleDispatchOrder?.DispatchTotal;
  //   }
  //   return pendingDispatchValue;
  // };

  // const totalDispatchvalue = React.useMemo(() => {
  //   return calculatePendingDispatchValue();
  // }, [active]);

  // const pendingDispatchValue = React.useMemo(() => {
  //   return formatPrice(total - totalDispatchvalue);
  // });

  return (
    <Card
      className={`orderCard  pointer ${active ? "activeOrder" : ""}`}
      onClick={() => changeActivetab(index)}
    >
      <CardHeader className="p-0">
        <div className="d-flex justify-content-between">
          <p className="mb-0" style={{ lineHeight: "14px" }}>
            Order #{orderDetail?.PurchaseOrderNo}
            <br />
            Ordered on&nbsp;{dateFormatter(orderDetail?.updatedAt, "getInIso")}
            <br />
            By &nbsp;{orderDetail?.User_Master?.UserName || "-"}
          </p>

          <StatusOverlay
            orderStatusLog={orderDetail?.Order_Status_Logs}
            trigger={"click"}
          >
            <p className={`mb-0 px-1 singleOrder-${orderDetail?.OrderStatus}`}>
              {getFormattedStatus(orderDetail?.OrderStatus)}
            </p>
          </StatusOverlay>
        </div>
      </CardHeader>
      <CardBody>
        <div className="d-flex justify-content-between mx-2">
          <p className="mb-2">Supplier: </p>
          <p className="font-weight-bold">
            {orderDetail?.Supplier?.SupplierName}
          </p>
        </div>
        {/* <div className="d-flex justify-content-between mx-2">
          <p>Order Date: </p>
          <p className="font-weight-bold">
            {dateFormatter(orderDetail?.createdAt, "getInIso")}
          </p>
        </div> */}
        <div className="d-flex justify-content-between mx-2">
          <p className="mb-2">Total: </p>
          <p className="font-weight-bold">€&nbsp;{getLocaleString(total)}</p>
        </div>
        {/* <div className="d-flex justify-content-between mx-2">
          <p className="mb-2">Pending Value: </p>
          <p className="font-weight-bold">€&nbsp; {pendingDispatchValue}</p>
        </div> */}
        <div className="d-flex justify-content-between mx-2">
          <p className="mb-2">Payment Method: </p>
          <p className="font-weight-bold">{paymentMethod}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderCard;
