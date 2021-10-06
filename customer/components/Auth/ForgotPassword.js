import React, { Fragment, useState, useEffect, useContext } from "react";


export const ForgotPassword = ({ userForgotForm, errors, onChangeForgotEmail }) => {

  return (
    <Fragment>
      <h1 className="main-title">Verify Email</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          name="ForgotEmail"
          placeholder="Email"
          type="text"
          value={userForgotForm.ForgotEmail}
          onChange={onChangeForgotEmail}
        />
        <span className="form-field-error">{errors["ForgotEmail"]}</span>
      </div>
    </Fragment>
  )
}

export default ForgotPassword;