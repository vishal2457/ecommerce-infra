import React, { Fragment, useState, useEffect, useContext } from "react";

export const Register = ({
  form,
  onChange,
  errors,
  passwordTypeState,
  togglePassword,
}) => {
  let { CustomerName, Number, Email, Password } = form;

  return (
    <Fragment>
      <h1 className="main-title">Register</h1>

      <div className="form-group">
        <label className="main-label">Name</label>
        <input
          className="form-control"
          name="CustomerName"
          placeholder="Name"
          type="text"
          value={CustomerName}
          onChange={onChange}
        />
        <span className="form-field-error">{errors["CustomerName"]}</span>
      </div>

      <div className="form-group">
        <label>Number</label>
        <input
          className="form-control"
          name="Number"
          placeholder="Number"
          type="text"
          value={Number}
          onChange={onChange}
        />
        <div><small className="">Ex. +491739341284</small></div>
        <span className="form-field-error">{errors["Number"]}</span>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          name="Email"
          placeholder="Email"
          type="text"
          value={Email}
          onChange={onChange}
        />
        <span className="form-field-error">{errors["REmail"]}</span>
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control iampassword"
          name="Password"
          placeholder="Password"
          id="iampass"
          type={passwordTypeState}
          value={Password}
          onChange={onChange}
        />

        <span className="show-password btn btn-link" onClick={togglePassword}>
          <i
            className={`fa fa-${
              passwordTypeState == "password" ? "eye-slash" : "eye"
            }`}
          ></i>
        </span>
      </div>
      <div className="row">
        <span className="form-group col-md-12 form-field-error">
          {errors["RPassword"]}
        </span>
      </div>
    </Fragment>
  );
};

export default Register;
