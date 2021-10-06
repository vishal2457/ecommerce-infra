import React, { Fragment, useState, useEffect, useContext } from "react";
import Select from "react-select";

export const SupplierRegistration = ({ supplierForm, errors, onSupplierFormChange, onCountryChange, onStateChange, onCityChange, countryList, stateList, cityList }) => {

  return (
    <Fragment>
      <h1 className="main-title">Supplier Registration</h1>
      <div className="row">
        <div className="form-group col-md-12">
          {/* <label className="main-label">Name</label> */}
          <input
            className="form-control"
            name="SupplierName"
            placeholder="Name"
            type="text"
            value={supplierForm.SupplierName}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">
            {errors["SupplierName"]}
          </span>
        </div>
        <div className="form-group col-md-12">
          {/* <label>Email</label> */}
          <input
            className="form-control"
            name="Email"
            placeholder="Email"
            type="text"
            value={supplierForm.Email}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["Email"]}</span>
        </div>
        <div className="form-group col-md-12">
          <input
            className="form-control"
            name="Number"
            placeholder="Number"
            type="text"
            value={supplierForm.Number}
            onChange={onSupplierFormChange}
          />
          <div><small className="">Ex. +491739341284</small></div>          
          <span className="form-field-error">{errors["Number"]}</span>
        </div>

        <div className="form-group col-md-12">
          {/* <label>Address</label> */}
          <input
            className="form-control"
            name="Address"
            placeholder="Address"
            type="text"
            value={supplierForm.Address}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["Address"]}</span>
        </div>
        <div className="form-group col-md-12">
          {/* <label>Landmark</label> */}
          <input
            className="form-control"
            name="LandMark"
            placeholder="Landmark"
            type="text"
            value={supplierForm.LandMark}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["LandMark"]}</span>
        </div>
        <div className="form-group col-md-6">
          {/* <label>Zip</label> */}
          <input
            className="form-control"
            name="ZipCode"
            placeholder="Zip"
            type="text"
            value={supplierForm.ZipCode}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["ZipCode"]}</span>
        </div>

        <div className="form-group col-md-6">
          <Select
            options={countryList}
            getOptionLabel={(option) => `${option["Country"]}`}
            getOptionValue={(option) => `${option["ID"]}`}
            onChange={onCountryChange}
            placeholder="Country..."
          />
          <span className="form-field-error">{errors["CountryID"]}</span>

          {/* <ReactSelectDropdown
                  onChange={onCountryChange}
                  arr={props.countryList}
                  bindValue="ID"
                  bindName="Country"
                  placeholder="Country..."     
                /> */}
        </div>

        <div className="form-group col-md-6">
          <Select
            options={stateList}
            getOptionLabel={(option) => `${option["State"]}`}
            getOptionValue={(option) => `${option["ID"]}`}
            onChange={onStateChange}
            placeholder="State..."
          />
          <span className="form-field-error">{errors["StateID"]}</span>
        </div>
        <div className="form-group col-md-6">
          <Select
            options={cityList}
            getOptionLabel={(option) => `${option["City"]}`}
            getOptionValue={(option) => `${option["ID"]}`}
            onChange={onCityChange}
            placeholder="City..."
          />
          <span className="form-field-error">{errors["CityID"]}</span>
        </div>
        <div className="form-group col-md-6">
          {/* <label>Industry</label> */}
          <input
            className="form-control"
            name="Industry"
            placeholder="Industry"
            type="text"
            value={supplierForm.Industry}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["Industry"]}</span>
        </div>
        <div className="form-group col-md-6">
          {/* <label>Vat Tax No</label> */}
          <input
            className="form-control"
            name="Vat_Tax_No"
            placeholder="Vat Tax No"
            type="text"
            value={supplierForm.Vat_Tax_No}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">{errors["Vat_Tax_No"]}</span>
        </div>
        <div className="form-group col-md-12">
          {/* <label>Contact Person Name</label> */}
          <input
            className="form-control"
            name="ContactPersonName"
            placeholder="Contact Person Name"
            type="text"
            value={supplierForm.ContactPersonName}
            onChange={onSupplierFormChange}
          />
          <span className="form-field-error">
            {errors["ContactPersonName"]}
          </span>
        </div>
      </div>
    </Fragment>
  )
}

export default SupplierRegistration;