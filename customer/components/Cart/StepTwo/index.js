import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import AddressWrapper from "../../Addresses/AddressWrapper";
import { Input, Button } from "../../UI";

const CheckedItems = dynamic(() =>
  import("../CheckedItems/index").then((mod) => mod.CheckedItems)
);

export const StepTwo = ({
  placeOrder,
  items,
  loading,
  AddressArr,
  getAllAdddress,
  selectedID,
  setselectedID,
  CartTotal
}) => {
  const [storeInfo, setstoreInfo] = React.useState(false);
  return (
    <Fragment>
      <h3>Versand</h3>
      <div className="row mt-4">
        <div className="col-md-8 delivery-address">
          <div className="section-heading mb-4">Lieferadresse</div>
          <AddressWrapper
            isCart={true}
            AddressArr={AddressArr}
            getAllAdddress={getAllAdddress}
            selectedID={selectedID}
            setselectedID={setselectedID}
          />
          <div className="row mt-4">
            {/* <div className="col-md-6">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="First Name"
                  onChange={handleFormChange}
                  disabled={loadingStepTwo}
                  value={profile?.CustomerName || ""}
                  name="CustomerName"
                />
                <span className="err">{errorObject?.CustomerName}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Last Name"
                  disabled={loadingStepTwo}
                  onChange={handleFormChange}
                  value={profile?.ShortName || ""}
                  name="ShortName"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Shipping address"
                  onChange={handleFormChange}
                  disabled={loadingStepTwo}
                  value={profile?.Address || ""}
                  name="Address"
                />
                <span className="err">{errorObject?.Address}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <ReactSelectDropdown
                  arr={region.countries}
                  bindName="Country"
                  bindValue="ID"
                  onChange={handleDropdownChange}
                  name="CountryID"
                  disabled={loadingStepTwo}
                  value={profile?.CountryID || ""}
                />
                <span className="err">{errorObject?.Country}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <ReactSelectDropdown
                  arr={region.states}
                  onChange={handleDropdownChange}
                  bindName="State"
                  bindValue="ID"
                  name="StateID"
                  disabled={loadingStepTwo}
                  value={profile?.StateID || ""}
                />
                <span className="err">{errorObject?.State}</span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <ReactSelectDropdown
                  arr={region.cities}
                  bindName="City"
                  onChange={handleDropdownChange}
                  bindValue="ID"
                  disabled={loadingStepTwo}
                  name="CityID"
                  value={profile?.CityID || ""}
                />
                <span className="err">{errorObject?.City}</span>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Post Code/ ZIP"
                  onChange={handleFormChange}
                  disabled={loadingStepTwo}
                  value={profile?.ZipCode || ""}
                  name="ZipCode"
                />
                <span className="err">{errorObject?.ZipCode}</span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Phone"
                  onChange={handleFormChange}
                  value={profile?.Number || ""}
                  name="Number"
                  disabled={loadingStepTwo}
                />
                <span className="err">{errorObject?.Number}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Email Address"
                  onChange={handleFormChange}
                  value={profile?.Email || ""}
                  disabled={loadingStepTwo}
                  name="Email"
                />
                <span className="err">{errorObject?.Email}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <ReactSelectDropdown
                  arr={PAYMENT_METHODS}
                  bindName="name"
                  bindValue="ID"
                  onChange={handleDropdownChange}
                  disabled={loadingStepTwo}
                  name="PaymentMethod"
                  value={profile?.PaymentMethod || ""}
                />
                {!profile?.PaymentMethod ? (
                  <span className="err">Payment Method is required</span>
                ) : null}

                {console.log(errorObject)}
              </div>
            </div>
            <div className="col-md-12">
              <div class="form-check form-check-inline ">
                <Input
                  id="storeInfo"
                  type="checkbox"
                  className="pointer"
                  disabled={loadingStepTwo}
                  checked={storeInfo}
                  onChange={(e) => setstoreInfo(e.target.checked)}
                />
                <label for="storeInfo" className="mt-2 ml-1 pointer">
                  Store Information
                </label>
              </div>
            </div> */}

            <div className="col-md-6">
              <div className="form-group">
                <Link href="/Shop">
                  <button className="btn btn-block btn-red btn-outline">
                    Weiter einkaufen
                  </button>
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Button
                  loading={loading}
                  className="btn btn-block btn-red"
                  onClick={() => {
                    placeOrder(storeInfo);
                  }}
                >
                  Next
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

export default connect(mapStateToProps, mapDispatchToProps)(StepTwo);
