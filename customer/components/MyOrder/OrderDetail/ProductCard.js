import React, { useState } from "react";
import {
  getDateDetail,
  ResourceApiUrl,
  getOrderMessage,
  formatPrice,
  dateFormatter,
  getLocaleString,
  UOM_TYPES,
} from "../../../utility/commonUtility";
import Image from "../../image/image";
import { Card, Button } from "../../UI";
import ProductData from "../../Shared/productData";
import Link from "next/link";
import dynamic from "next/dynamic";
// const DispatchDetail = dynamic(() => import("./DispatchDetail"));
const StatusOverlay = dynamic(() => import("../../Shared/StatusOverlay"));
const Overlay = dynamic(() => import("../../Shared/Overlay"));

function ProductCard({ item, addChat, index, orderReceived }) {
  const [isOpen, setisOpen] = useState(false);

  /**
   * @returns Dispatch total
   */
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
    <Card className="border mb-3 p-3 shadow-sm br_5">
      <div className="card-title">
        <div className="d-flex justify-content-between">
          <div>
            {/* <p className="mb-0">{getOrderMessage(item?.OrderStatus)}</p> */}

            <small>{getDateDetail(item?.StatusChangedOn)}</small>
          </div>

          <div className="icon_bar">
            <StatusOverlay
              isProduct="isProduct"
              trigger={"click"}
              orderStatusLog={item?.Order_Status_Logs}
            >
              <div
                className="rounded-pills pointer"
                style={{ display: "inline-block" }}
              >
                <p className={`mb-0 singleOrder-${item?.OrderStatus}`}>
                  {item?.OrderStatus}
                </p>
              </div>
            </StatusOverlay>

            <div className="quotationbtn">
              <Button
                className="chat_button"
                variant="primary"
                onClick={() => addChat(item, index)}
              >
                <i className="fa fa-comment" />
              </Button>{" "}
            </div>

            {/* {item?.Dispatch_Order_Details.length ? (
              <>
                {isOpen ? (
                  <div className="quotationbtn">
                    <Button variant="light" onClick={closeDetails}>
                      <i className="fa fa-chevron-up" />
                    </Button>{" "}
                  </div>
                ) : (
                  <div className="quotationbtn">
                    <Button variant="light" onClick={openDetails}>
                      <i className="fa fa-chevron-down" />
                    </Button>{" "}
                  </div>
                )}
              </>
            ) : null} */}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="d-flex cus_flex">
          <Image
            alt={`Product Image`}
            className="img-fluid border"
            style={{ width: "60px", height: "60px" }}
            src={`${ResourceApiUrl}${item?.Product_Master?.Product_Images[0]?.Image}`}
          />
          <div className="product-info ml-2 mt-2">
            
              <p className="font-weight-bold mb-0 pointer">
              <Link href={`/Product?id=${item?.Product_Master?.ID}`}>{item?.Product_Master?.ProductName}</Link>
                &nbsp;
                <Overlay
                  heading={item?.Product_Master?.ProductName}
                  component={<ProductData data={item?.Product_Master} />}
                />
              </p>
            <div className="row">
              <div className="col-md-4 pr-0">
                <p className="mb-0 qty-uom">
                  {item?.Quantity}&nbsp;{ getUom(item?.Product_Master?.Measurement_Unit?.MeasurementUnit, item?.Uom)  }&nbsp;
                  {item?.PrimaryUomQty
                    ? `(${item?.PrimaryUomQty * item?.Quantity} ${
                        item?.Product_Master?.Measurement_Unit?.MeasurementUnit
                      })`
                    : null}
                </p>
              </div>
              <div className="col-md-4 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Price/Unit: </b>
                  <span class="price_inquiry">{item?.DefaultPrice}</span>
                </p>
              </div>
              <div className="col-md-4 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Amount: </b>
                  <span class="price_inquiry">€ {getLocaleString(item?.Amount)}</span>
                </p>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-md-6 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Dispatch QTY: </b>{" "}
                  {DispatchDetails?.TotalDispatchQuantity || 0}
                </p>
              </div>
              <div className="col-md-6 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Dispatch Value: </b>
                  &euro;&nbsp;{DispatchDetails?.DispatchAmount || 0}
                </p>
              </div>
              <div className="col-md-6 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Pending QTY: </b>
                  {DispatchDetails?.pendingQuantity || 0}
                </p>
              </div>

              <div className="col-md-6 pr-0">
                <p className="mb-0 qty-uom">
                  <b>Pending Value: </b>
                  &euro;&nbsp;{DispatchDetails?.pendingAmount || 0}
                </p>
              </div>
            </div> */}
            {item?.ExpectedDeliveryDate ? (
              <p className="mb-0 qty-uom">
                Expected Delivery on&nbsp;
                {dateFormatter(item?.ExpectedDeliveryDate, "getInIso")}
              </p>
            ) : null}

            {item?.CustExpectsDelivery ? (
              <p className="mb-0 qty-uom">
                You Expect Delivery on&nbsp;
                {dateFormatter(item?.CustExpectsDelivery, "getInIso")}
              </p>
            ) : null}

            {item?.Quotation_Master?.QuotationNo ? (
              <p className="mb-0 qty-uom">
                Quotation No :&nbsp;
                <b>{item?.Quotation_Master?.QuotationNo}</b>
              </p>
            ) : null}

            {item?.Inquiry_Master?.InquiryNo ? (
              <p className="mb-0 qty-uom">
                Inquiry No :&nbsp;
                <b>{item?.Inquiry_Master?.InquiryNo}</b>
              </p>
            ) : null}

            {/* <button className="px-3 py-0 btn btn-sm btn-outline-dark cancel_btn">{getButton(item?.OrderStatus)}</button> */}
          </div>
        </div>
        {/* {isOpen ? (
          <>
            <hr />
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table class="table table-sm table-hover product_dispatch_table m-0">
                    <thead>
                      <tr>
                        <th className="text-left">Dispatch No</th>
                        <th className="text-center">Dispatch Date</th>
                        <th className="text-center">Dispatch QTY</th>
                        <th className="text-center">Unit</th>
                        <th className="text-center">Dispatch Amount</th>
                        <th className="text-center">Delivery Info</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.Dispatch_Order_Details.length ? (
                        <>
                          {item?.Dispatch_Order_Details.map(
                            (dispatchItem, index) => {
                              return (
                                <DispatchDetail
                                  dispatchItem={dispatchItem}
                                  item={item}
                                  orderReceived={orderReceived}
                                  PoDetail={{
                                    ID: item?.ID,
                                    OrderStatus: item?.OrderStatus,
                                  }}
                                />
                              );
                            }
                          )}
                        </>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )} */}
      </div>
    </Card>
  );
}

export default ProductCard;
