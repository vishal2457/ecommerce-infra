import React from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import QuickAuth from "../Shared/QuickAuth";

export const CheckoutData = ({
  calculatePrice,
  changeTab,
  authState,
  deliveryDate
}) => {
  const calculatedPrice = React.useMemo(() => {
    return calculatePrice();
  });

  return (
    <div className="cartListing-widget">
      <table>
        <tbody>
          <tr>
            <td className="item-name text-left">Zwischensumme</td>
            <td className="item-price text-right">
            €&nbsp;{calculatedPrice}

            </td>
          </tr>
         
          {/* <tr>
            <td className="item-name text-left">Taxes</td>
            <td className="item-price text-right">€60.00</td>
          </tr> */}
          <tr>
            <td className="total text-left">TOTAL</td>
            <td className="total text-right">
              €&nbsp;{calculatedPrice}
            </td>
          </tr>
        </tbody>
      </table>
        <Fragment>
          {authState ? (
            <button
              className="btn btn-blue"
              onClick={() => {
                changeTab("stepTwo");
              }}
            >
              Checkout
            </button>
          ) : (
            <QuickAuth deliveryDate={deliveryDate} />
          )}
        </Fragment>
      
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutData);
