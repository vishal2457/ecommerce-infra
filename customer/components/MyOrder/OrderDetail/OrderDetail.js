import React from "react";
import { Button, Card, CardBody } from "../../UI";
import ProductCard from "./ProductCard";
import dynamic from "next/dynamic";
import {
  dateFormatter,
  formatPrice,
  getLocaleString,
  PAYMENT_METHODS,
} from "../../../utility/commonUtility";
const BreakupOverlay = dynamic(() => import("../../Shared/BreakupOverlay"));
import ContentLoader from "react-content-loader";

function OrderDetail({
  singleOrderDetail,
  handlePrint,
  productArr,
  loading,
  addChat,
  orderReceived,
}) {
  /**
   * @returns Grand total of the order
   */
  const getTotal = () => {
    let subTotal = singleOrderDetail?.SubTotal || 0;
    let tax = singleOrderDetail?.Tax || 0;
    let shippingCharge = singleOrderDetail?.ShippingCharge || 0;
    // return parseFloat(subTotal) + parseFloat(tax) + parseFloat(shippingCharge);
    return subTotal + tax + shippingCharge;
  };

  const GrandTotal = React.useMemo(() => {
    return getTotal();
  }, [
    singleOrderDetail?.SubTotal,
    singleOrderDetail?.Tax,
    singleOrderDetail?.ShippingCharge,
  ]);

  /**
   * @returns payment method
   */
  const getPaymentMethod = () => {
    return PAYMENT_METHODS.filter(
      (item) => item.ID == singleOrderDetail?.Customer_Address?.PaymentMethod
    )[0]?.name;
  };

  /**
   * @returns pending dispatch value
   */
  const calculatePendingDispatchValue = () => {
    if (!singleOrderDetail?.Dispatch_Orders?.length) return 0;
    let pendingDispatchValue = 0;
    for (let singleDispatchOrder of singleOrderDetail?.Dispatch_Orders) {
      pendingDispatchValue += singleDispatchOrder?.DispatchTotal;
    }
    return pendingDispatchValue;
  };

  const totalDispatchvalue = React.useMemo(() => {
    return calculatePendingDispatchValue();
  }, [singleOrderDetail]);

  const pendingDispatchValue = React.useMemo(() => {
    //return formatPrice(GrandTotal - totalDispatchvalue);
    return GrandTotal - totalDispatchvalue;
  }, [singleOrderDetail]);

  const paymentMethod = React.useMemo(() => {
    return getPaymentMethod();
  }, [singleOrderDetail?.Customer_Address?.PaymentMethod]);

  //breakup detail
  var breakupDetails = {
    subTotal: singleOrderDetail?.SubTotal || 0,
    tax: singleOrderDetail?.Tax || 0,
    shippingCharge: singleOrderDetail?.ShippingCharge|| 0,
    disconut: 0,
    grandTotal: GrandTotal || 0,
    paymentMethod: paymentMethod,
    pendingDispatchValue: pendingDispatchValue,
  };

  return (
    <div className="col-md-8 pl-2">
      {/* order-detail-height */}
      {loading ? (
        // <p className="text-center">Data Not Found</p>

        <>
          <ContentLoader
            width={900}
            height={320}
            viewBox="0 0 900 300"
            backgroundColor="#f0f0f0"
            foregroundColor="#dedede"
          >
            <rect x="0" y="0" rx="10" ry="10" width="900" height="300" />
          </ContentLoader>
        </>
      ) : (
        <Card className="light-border shadow p-3 mb-3">
          <div className="my-3 ml-1 d-flex justify-content-between">
            <p className="lead mb-0 font-weight-bold">
              Order Detail
              {/* #{singleOrderDetail?.PurchaseOrderNo} */}
            </p>
            <Button
              className="px-2 btn btn-sm btn-outline-dark"
              onClick={handlePrint}
            >
              <i className="fa fa-print" /> Print
            </Button>
          </div>

          <CardBody>
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-12">
                    <p>
                      <b>Order placed by</b>{" "}
                      <kbd>
                        {singleOrderDetail?.User_Master?.UserName || "-"}
                      </kbd>{" "}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <b>Order No.: </b>#{singleOrderDetail?.PurchaseOrderNo}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <b>Order Date: </b>
                      {dateFormatter(singleOrderDetail?.createdAt, "getInIso")}
                    </p>
                  </div>
                </div>
                <p className="font-weight-bold">Delivery Address</p>
                <p>{singleOrderDetail?.Customer_Address?.Address}</p>
                <p>{singleOrderDetail?.Customer_Address?.Phone}</p>
                <p>{singleOrderDetail?.Customer?.Email}</p>
              </div>
              <div className="col-md-4 text-right">
                {/* <div className="d-flex justify-content-between">
                <p>Sub Total: </p>
                <p className="font-weight-bold">
                  &euro;&nbsp;{singleOrderDetail?.SubTotal}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Tax: </p>
                <p className="font-weight-bold">
                  &euro;&nbsp;{singleOrderDetail?.Tax || 0}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Shipping Charge: </p>
                <p className="font-weight-bold">
                  &euro;&nbsp;{singleOrderDetail?.ShippingCharge || 0}
                </p>
              </div>
              <hr className="m-0" /> */}
                <div className="d-flex justify-content-end">
                  {/* <p></p> */}
                  <p className="font-weight-bold">
                    Order value: &euro;&nbsp;
                    {getLocaleString(GrandTotal)}
                  </p>
                </div>

                <BreakupOverlay
                  breakupDetails={breakupDetails}
                  trigger="click"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div>
        {loading ? (
          // <p className="text-center">Data Not Found</p>

          <>
            {[1, 2, 3].map((item, index) => {
              return (
                // <div className="col-md-4" >
                  <ContentLoader
                    width={900}
                    height={120}
                    viewBox="0 0 900 100"
                    backgroundColor="#f0f0f0"
                    foregroundColor="#dedede"
                    key={index}
                  >
                    <rect x="0" y="0" rx="10" ry="10" width="900" height="100" />
                  </ContentLoader>
                // </div>
              );
            })}
          </>
        ) : (
          <>
            {productArr.map((item, index) => {
              return (
                <ProductCard
                  item={item}
                  index={index}
                  addChat={addChat}
                  orderReceived={orderReceived}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
