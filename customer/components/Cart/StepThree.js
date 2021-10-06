import dynamic from "next/dynamic";
import React from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { PAYMENT_METHODS } from "../../utility/commonUtility";
import {Button} from "../UI"
const CheckedItems = dynamic(() =>
  import("./CheckedItems/index").then((mod) => mod.CheckedItems)
);

export const StepThree = ({
  confirmOrder,
  items,
  deliveryDate,
  changeTab,
  selectedID,
  CartTotal,
  confirmOrderLoading
}) => {

  const getPaymentMethod = () => {
    return PAYMENT_METHODS.filter(item => item.ID == selectedID?.PaymentMethod)[0]?.name
  }

  const paymentMethod = React.useMemo(() => {
    return getPaymentMethod()
  }, [selectedID?.PaymentMethod])


  return (
    <Fragment>
      <h3>Bestellung bestätigen</h3>
      <div className="row mt-4">
        <div className="col-md-8 delivery-address">
          <div className="section-heading">Versand Informationen</div>
          <div className="row mt-4">
            <div className="col-md-12 text-right">
          
              <a onClick={() => changeTab("stepTwo")} className="link">
                Ändern
              </a>
            </div>
            <div className="col-md-12  mb-2">
              <div className="shipping_information">
                <table>
                  <tbody>
                    <tr>
                      <td>Kontakt</td>
                      <td>{selectedID?.Phone}</td>
                    </tr>
                    <tr>
                      <td>Versand</td>
                      <td>{selectedID?.Address}</td>
                    </tr>
                    <tr>
                      <td>Methode</td>
                      <td>€&nbsp;{CartTotal}&nbsp;{paymentMethod}</td>
                    </tr>
                    <tr>
                      <td>Liefertermin</td>
                      <td>{deliveryDate} - Noch nicht bestätigt </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        
            {/* <div className="col-md-12 text-right mb-2">
              <a href="#" className="link">
                Mit dem Händler Kontakt aufnehmen
              </a>
            </div> */}

            <div className="col-md-6">
              <div className="form-group">
                <button className="btn btn-block btn-red btn-outline">
                  Weiter einkaufen
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Button
                  className="btn btn-block btn-red"
                  onClick={confirmOrder}
                  loading={confirmOrderLoading}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 your-order">
          <div className="section-heading">Ihre Bestellung</div>
          <div className="products_side_table">
            <CheckedItems
              items={items}
              CartTotal={CartTotal}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StepThree);
