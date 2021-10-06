import dynamic from "next/dynamic";
import React from "react";
import { connect } from "react-redux";
import {
  ResourceApiUrl,
  calculateWeight,
  getLocaleString,
} from "../../../utility/commonUtility";
const Image = dynamic(() => import("../../image/image"));

export const CheckedItems = ({ items, CartTotal }) => {
  return (
    <React.Fragment>
      <table className="table">
        <tbody>
          {items &&
            items.map((item, index) => {
              const {
                ProductName,
                Height,
                Width,
                Paper_Gsm,
                Supplier,
                Pricings,
                quantity,
                Weight,
                Price,
                QuotationID,
              } = item;

              // const getItemAmount = React.useMemo(() => {
              //   let Total = 0;
              //   if (QuotationID) {
              //     Total = Price * quantity;
              //   } else {
              //     Total = Price;
              //   }
              //   return getLocaleString(Total);
              // });

              return (
                <React.Fragment key={index}>
                  <tr>
                    <td className="product_img">
                      <Image
                        className="table_product_img"
                        src={`${ResourceApiUrl}${item?.Product_Images[0]?.Image}`}
                        alt="Card image cap"
                      />
                    </td>
                    <td className="product_detail">
                      {ProductName}
                      <br />
                      <div className="d-flex justify-content-between">
                        <p>Size:</p>
                        <p>
                          <b>
                            {Height} x {Width}
                          </b>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>GSM:</p>{" "}
                        <p>
                          <b> {Paper_Gsm?.PaperGsm}</b>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Supplier:</p>{" "}
                        <p>
                          <b> {Supplier?.SupplierName}</b>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Weight:</p>{" "}
                        <p>
                          <b>
                            {" "}
                            {calculateWeight(
                              Weight,
                              quantity,
                              item?.Pricings?.PricingUnit
                            ).toFixed(3)}
                            &nbsp;KG
                          </b>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Quantity:</p>{" "}
                        <p>
                          <b>{quantity}</b>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Price:</p>{" "}
                        <p>
                          <b>{item?.defaultPricing}</b>
                        </p>
                      </div>
                      <div className="price text-right">
                        {/* &euro; &nbsp;{getItemAmount} */}

                        {QuotationID ? (
                          <span>
                            &euro; &nbsp;{getLocaleString(Price * quantity)}
                          </span>
                        ) : (
                          <span>&euro; &nbsp;{getLocaleString(Price)}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
      <div className="g-total">
        <table>
          <tbody>
            <tr>
              <td className="item-name text-left">Zwischensumme</td>
              <td className="item-price text-right">
                &euro;&nbsp;{getLocaleString(CartTotal)}
              </td>
            </tr>
            {/* <tr>
              <td className="item-name text-left">Versand</td>
              <td className="item-price text-right">€00.00</td>
            </tr> */}
            <tr>
              <td className="total text-left">TOTAL</td>
              <td className="total-amount text-right">
                &euro;&nbsp;{getLocaleString(CartTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CheckedItems);
