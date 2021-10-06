import React, { Fragment } from "react";

export const Login = ({
  form,
  passwordTypeState,
  onChange,
  togglePassword,
  setstate,
  errors,
}) => {
  let { Email, Password } = form;

  return (
    <Fragment>
      <h1 className="main-title">Login</h1>
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
        <span className="form-field-error">{errors["Email"]}</span>
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
          {errors["Password"]}
        </span>
      </div>
      <div className="row">
        <div
          className="form-group col-md-12 text-right pointer"
          onClick={() => setstate({ formType: "ForgotPwd" })}
        >
          Forgot Password?
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
