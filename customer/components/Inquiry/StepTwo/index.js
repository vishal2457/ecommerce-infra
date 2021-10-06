import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import AddressWrapper from "../../Addresses/AddressWrapper";
import { Input, Button } from "../../UI";

// const CheckedItems = dynamic(() =>
//   import("../CheckedItems/index").then((mod) => mod.CheckedItems)
// );

export const StepTwo = ({
  confirmAddress,
  loading,
  AddressArr,
  getAllAdddress,
  selectedID,
  setselectedID,
}) => {
  const [storeInfo, setstoreInfo] = React.useState(false);
  return (
    <Fragment>
      <h3>Versand</h3>
      <div className="row mt-4">
        <div className="col-md-12 delivery-address border-0">
          <div className="section-heading mb-4">Lieferadresse</div>
          <AddressWrapper
            isCart={true}
            AddressArr={AddressArr}
            getAllAdddress={getAllAdddress}
            selectedID={selectedID}
            setselectedID={setselectedID}
          />
          <div className="row mt-4">
            <div className="col-md-9"></div>
            <div className="col-md-3">
              <Button
                loading={loading}
                className="btn btn-block btn-red"
                onClick={() => {
                  confirmAddress();
                }}
              >
                NEXT
                </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StepTwo);
