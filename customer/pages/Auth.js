import React, { Fragment, useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import {
  login,
  register,
  supplierRegister,
  forgotPwdUser,
  setLoginSuccess,
} from "../Redux/Auth/actions";
import { getCountries, getStates, getCities } from "../Redux/Region/actions";
import { AuthContext } from "../contexts/auth/auth.context";
import { useRouter } from "next/router";
import { Card, CardBody, Button } from "../components/UI";
import { useCart } from "../contexts/cart/user-cart";

import dynamic from "next/dynamic";
import api from "../Redux/api";

import {
  DashboardRoute,
  TOKEN_PREFIX,
  showAlert,
} from "../utility/commonUtility";
import Login from "../components/Auth/Login";
const Register = dynamic(() =>
  import("../components/Auth/Register").then((mod) => mod.Register)
);
const ForgotPassword = dynamic(() =>
  import("../components/Auth/ForgotPassword").then((mod) => mod.ForgotPassword)
);
const SupplierRegistration = dynamic(() =>
  import("../components/Auth/SupplierRegistration").then(
    (mod) => mod.SupplierRegistration
  )
);

export const Auth = (props) => {
  const { items, addItemOnLogin } = useCart();
  const router = useRouter();
  const [passwordTypeState, setpasswordTypeState] = useState("password");
  const [RpasswordTypeState, setRpasswordTypeState] = useState("password");
  const { authDispatch } = useContext(AuthContext);
  const [state, setstate] = useState({
    formType: router.query.type,
    loading: false,
  });
  let [errors, setErrors] = useState({});
  const [form, setform] = useState({
    Email: "",
    Password: "",
    CustomerName: "",
    Number: "",
  });

  const [userForgotForm, setUserForgotForm] = useState({
    ForgotEmail: "",
  });
  const [loading, setloading] = useState(false);
  const [supplierForm, setsupplierForm] = useState({
    SupplierName: "",
    Email: "",
    Number: "",
    Address: "",
    LandMark: "",
    ZipCode: "",
    CityID: "",
    StateID: "",
    CountryID: "",
    Country: "",
    State: "",
    City: "",
    Industry: "",
    Vat_Tax_No: "",
    ContactPersonName: "",
  });

  useEffect(() => {
    router.prefetch("/");
    return () => {};
  }, []);

  useEffect(() => {
    const { getCountries } = props;
    if (state.formType == "bRegister") {
      getCountries();
    }
  }, []);

  // console.log("Country = ", props.countryList);
  const onCountryChange = (selected) => {
    errors["CountryID"] = null;
    const { getStates } = props;
    getStates(selected.ID);
    setsupplierForm({
      ...supplierForm,
      CountryID: selected.ID,
      Country: selected.Country,
    });
  };

  const onStateChange = (selected) => {
    errors["StateID"] = null;
    const { getCities } = props;
    getCities(selected.ID, supplierForm.CountryID);
    setsupplierForm({
      ...supplierForm,
      StateID: selected.ID,
      State: selected.State,
    });
  };

  const onCityChange = (selected) => {
    errors["CityID"] = null;
    setsupplierForm({
      ...supplierForm,
      CityID: selected.ID,
      City: selected.City,
    });
  };

  const { Email, Password } = form;

  const onChange = (e) => {
    errors[e.target.name] = null;
    errors[`R${e.target.name}`] = null;
    setform({ ...form, [e.target.name]: e.target.value });
  };
  const onChangeForgotEmail = (e) =>
    setUserForgotForm({ ...userForgotForm, [e.target.name]: e.target.value });

  const onSupplierFormChange = (e) => {
    errors[e.target.name] = null;
    setsupplierForm({ ...supplierForm, [e.target.name]: e.target.value });
  };

  /**
   * @mobileNumberValidation for validate mobile as germany mobile number format
   * @param {string} mobile 
   * @returns {boolean} 
   * @examples
   * +491739341284
   * +49 1739341284
   * (+49) 1739341284
   * +49 17 39 34 12 84
   * +49 (1739) 34 12 84
   * +(49) (1739) 34 12 84
   * +49 (1739) 34-12-84

   */
  const mobileNumberValidation = (mobile) => {
    var regex = /\(?\+\(?49\)?[ ()]?([- ()]?\d[- ()]?){10}/g;    
    var OK = regex.exec(mobile.toString());
    if (!OK) {
      return false;
    }
    return true;
  };

  const handleUserRegisterValidation = () => {
    let errors = {};
    let formIsValid = true;
    //User Register Password
    if (!form["CustomerName"]) {
      errors["CustomerName"] = "Name Cannot be empty";
      formIsValid = false;
    }
    //User Register Number
    if (!form["Number"]) {
      errors["Number"] = "Number Cannot be empty";
      formIsValid = false;
    } else if (!mobileNumberValidation(form["Number"])) {
      errors["Number"] = "Invalid Number";
      formIsValid = false;
    }
    //User Register Email
    if (!form["Email"]) {
      errors["REmail"] = "Email Cannot be empty";
      formIsValid = false;
    } else {
      let lastAtPos = form["Email"].lastIndexOf("@");
      let lastDotPos = form["Email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          form["Email"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          form["Email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["REmail"] = "Email is not valid";
      }
    }
    //User Register Password
    if (!form["Password"]) {
      errors["RPassword"] = "Password Cannot be empty";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleUserFPwdValidation = () => {
    let errors = {};
    let formIsValid = true;
    //login Email
    if (!userForgotForm.ForgotEmail) {
      errors["ForgotEmail"] = "Email Cannot be empty";
      formIsValid = false;
    } else {
      let lastAtPos = userForgotForm.ForgotEmail.lastIndexOf("@");
      let lastDotPos = userForgotForm.ForgotEmail.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          userForgotForm.ForgotEmail.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          userForgotForm.ForgotEmail.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["ForgotEmail"] = "Email is not valid";
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleUserLoginValidation = (Email, Password) => {
    let errors = {};
    let formIsValid = true;
    //login Email
    if (!Email) {
      errors["Email"] = "Email Cannot be empty";
      formIsValid = false;
    } else {
      let lastAtPos = Email.lastIndexOf("@");
      let lastDotPos = Email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          Email.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          Email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["Email"] = "Email is not valid";
      }
    }
    //login Password
    if (!Password) {
      errors["Password"] = "Password Cannot be empty";
      formIsValid = false;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleSupplierValidation = () => {
    let errors = {};
    let formIsValid = true;
    //SupplierName
    if (!supplierForm["SupplierName"]) {
      errors["SupplierName"] = "Supplier Name Cannot be empty";
      formIsValid = false;
    }

    //Email
    if (!supplierForm["Email"]) {
      formIsValid = false;
      errors["Email"] = "Email Cannot be empty";
    } else {
      let lastAtPos = supplierForm["Email"].lastIndexOf("@");
      let lastDotPos = supplierForm["Email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          supplierForm["Email"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          supplierForm["Email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["Email"] = "Email is not valid";
      }
    }

    //Number
    if (!supplierForm["Number"]) {
      formIsValid = false;
      errors["Number"] = "Number Cannot be empty";
    } 
    // else if (supplierForm["Number"].length !== 10) {
    //   formIsValid = false;
    //   errors["Number"] = "Enter 10 Digit Mobile Number";
    // } 
    // else if (!supplierForm["Number"].match(/^[0-9]*$/)) {
    //   formIsValid = false;
    //   errors["Number"] = "Only Numbers";
    // } 
    else if (!mobileNumberValidation(supplierForm["Number"])) {
      formIsValid = false;
      errors["Number"] = "Invalid Number";
    }

    //Address
    if (!supplierForm["Address"]) {
      formIsValid = false;
      errors["Address"] = "Address Cannot be empty";
    }

    //LandMark
    if (!supplierForm["LandMark"]) {
      formIsValid = false;
      errors["LandMark"] = "LandMark Cannot be empty";
    }

    //ZipCode
    if (!supplierForm["ZipCode"]) {
      formIsValid = false;
      errors["ZipCode"] = "ZipCode Cannot be empty";
    }

    //CountryID
    if (!supplierForm["CountryID"]) {
      formIsValid = false;
      errors["CountryID"] = "Select Country";
    }
    //StateID
    if (!supplierForm["StateID"]) {
      formIsValid = false;
      errors["StateID"] = "Select State";
    }
    //CityID
    if (!supplierForm["CityID"]) {
      formIsValid = false;
      errors["CityID"] = "Select City";
    }

    //Industry
    if (!supplierForm["Industry"]) {
      formIsValid = false;
      errors["Industry"] = "Industry Cannot be empty";
    }

    //Vat_Tax_No
    if (!supplierForm["Vat_Tax_No"]) {
      formIsValid = false;
      errors["Vat_Tax_No"] = "Vat Tax No Cannot be empty";
    }

    //Number
    if (!supplierForm["ContactPersonName"]) {
      formIsValid = false;
      errors["ContactPersonName"] = "Contact Person Name Cannot be empty";
    }

    setErrors(errors);
    return formIsValid;
  };

  const doLogin = (Email, Password, items) => {
    const reqBody = { Email, Password, cartData: { items } };
    setloading(true);
    api
      .post("/auth/customer", reqBody)
      .then((res) => {
        if (res?.data?.status) {
          // console.log(res?.data?.data);
          localStorage.setItem(TOKEN_PREFIX, res?.data?.data.token);
          localStorage.setItem(
            "USER_DATA",
            JSON.stringify(res?.data?.data.user)
          );
          localStorage.setItem(
            "authentication",
            JSON.stringify({ isAuthenticated: true })
          );

          for (let item of props.cart) {
            let singleItem = JSON.parse(item.Info);
            addItemOnLogin(singleItem, singleItem.quantity, singleItem.buyin);
          }

          authDispatch({ type: "SIGNIN_SUCCESS" });
          router.back();
        }
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };

  const doRegister = (form) => {
    setloading(true);
    api
      .post("/customer/register", form)
      .then((res) => {
        console.log("res from customer registration......", res?.data);
        if (res?.data?.status) {
          localStorage.setItem(TOKEN_PREFIX, res?.data?.data.token);
          localStorage.setItem(
            "USER_DATA",
            JSON.stringify(res?.data?.data.user)
          );
          localStorage.setItem(
            "authentication",
            JSON.stringify({ isAuthenticated: true })
          );

          authDispatch({ type: "SIGNIN_SUCCESS" });
          router.push("/");
        }

        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };

  const doForgotPwdUser = (userForgotForm) => {
    api
      .post("/auth/forgotPassword", { Email: userForgotForm.ForgotEmail })
      .then((res) => {
        if (res?.data?.status) {
          showAlert(`${res?.data?.data.msg}-custom`);
        }
      })
      .catch((err) => console.log(err));
  };

  const doSupplierRegister = (supplierForm) => {
    api
      .post("/supplier/register", supplierForm)
      .then((res) => {
        if (res?.data?.status) {
          showAlert("Supplier Registered Successfully-custom");

          router.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setstate({ ...state, loading: true });
    const { login, register, supplierRegister, forgotPwdUser } = props;
    if (state.formType == "Login") {
      if (handleUserLoginValidation(Email, Password)) {
        // return login(Email, Password, items);
        return doLogin(Email, Password, items);
      }
    }
    if (state.formType == "Register") {
      if (handleUserRegisterValidation(form)) {
        // return register(form);

        return doRegister(form);
      }
    }
    if (state.formType == "bRegister") {
      if (handleSupplierValidation()) {
        // return supplierRegister(supplierForm);
        return doSupplierRegister(supplierForm);
      }
    }
    if (state.formType == "ForgotPwd") {
      if (handleUserFPwdValidation()) {
        // return forgotPwdUser(userForgotForm);
        return doForgotPwdUser(userForgotForm);
      }
    }
  };

  const redirectPage = () => {
    if (state.formType == "bRegister") {
      showAlert(
        "You have successfully Registered, Please check your registered email for Approval-custom"
      );
    }
    authDispatch({ type: "SIGNIN_SUCCESS" });
    return router.back();
  };

  // if ((props.isAuthenticated && props.loginSuccess) || props.supplierRegistered) {
  //   redirectPage();
  //   for (let item of props.cart) {
  //     let singleItem = JSON.parse(item.Info);
  //     addItemOnLogin(singleItem, singleItem.quantity, singleItem.buyin)
  //   }
  //   // setstate({...state, loading: false})
  //   props.setLoginSuccess();
  // }

  const togglePassword = () => {
    passwordTypeState == "password"
      ? setpasswordTypeState("text")
      : setpasswordTypeState("password");
  };

  const toggleRPassword = () => {
    RpasswordTypeState == "password"
      ? setRpasswordTypeState("text")
      : setRpasswordTypeState("password");
  };

  const goHome = () => router.push("/");

  const renderForm = (type) => {
    switch (type) {
      case "Login":
        return (
          <Login
            form={form}
            passwordTypeState={passwordTypeState}
            onChange={onChange}
            togglePassword={togglePassword}
            setstate={setstate}
            errors={errors}
          />
        );
      case "Register":
        return (
          <Register
            form={form}
            onChange={onChange}
            errors={errors}
            passwordTypeState={RpasswordTypeState}
            togglePassword={toggleRPassword}
          />
        );

      case "bRegister":
        return (
          <SupplierRegistration
            supplierForm={supplierForm}
            errors={errors}
            onSupplierFormChange={onSupplierFormChange}
            onCountryChange={onCountryChange}
            onStateChange={onStateChange}
            onCityChange={onCityChange}
            countryList={props.countryList}
            stateList={props.stateList}
            cityList={props.cityList}
          />
        );
      case "ForgotPwd":
        return (
          <ForgotPassword
            userForgotForm={userForgotForm}
            errors={errors}
            onChangeForgotEmail={onChangeForgotEmail}
          />
        );
      default:
        return setstate({ formType: "Login" });
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div
          className="auth-form d-flex justify-content-center align-items-center"
          // style={{ height: "100vh" }}
        >
          {/* <Card className="w-100">
            <CardBody> */}
          <div className="w-100">
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src="/img/logo/logo.png"
                  alt="Logo"
                  className="auth-logo pointer"
                  onClick={goHome}
                />
              </div>

              <div className="col-md-4 login">
                <Card className="shadow">
                  <CardBody>
                    <form onSubmit={onSubmit}>
                      {renderForm(state.formType)}
                      <Button
                        variant="secondary"
                        loading={loading}
                        className=" btn-block mt-2"
                        type="submit"
                      >
                        {/* {state.formType == "Login" ? "Login" : "Register"} */}
                        {state.formType == "Login"
                          ? "Login"
                          : state.formType == "Register"
                          ? "Register"
                          : "Submit"}
                      </Button>
                      <div className="mt-3 text-center">
                        <small
                          className="pointer"
                          onClick={() => {
                            setform({
                              Email: "",
                              Password: "",
                              CustomerName: "",
                            });
                            // state.formType == "Login"
                            //   ? (router.push({
                            //       pathname: "/Auth",
                            //       query: { type: "Register" },
                            //     }),
                            //     setstate({ formType: "Register" }))
                            //   : (router.push({
                            //       pathname: "/Auth",
                            //       query: { type: "Login" },
                            //     }),
                            //     setstate({ formType: "Login" }));

                            state.formType == "Login"
                              ? (router.push({
                                  pathname: "/Auth",
                                  query: { type: "Register" },
                                }),
                                setstate({ formType: "Register" }))
                              : state.formType == "bRegister"
                              ? (router.push({
                                  pathname: `${DashboardRoute}/login`,
                                  query: { type: "Seller" },
                                }),
                                setstate({ formType: "Login" }))
                              : (router.push({
                                  pathname: "/Auth",
                                  query: { type: "Login" },
                                }),
                                setstate({ formType: "Login" }));
                          }}
                        >
                          {state.formType == "Login"
                            ? "Don't have an account? Register"
                            : state.formType == "bRegister"
                            ? "Already have an account? Login"
                            : "Already have an account? Login"}
                        </small>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          {/* </CardBody>
          </Card> */}
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  supplierRegistered: state.Auth.supplierRegistered,
  countryList: state.Region.countryList,
  stateList: state.Region.stateList,
  cityList: state.Region.cityList,
  loginSuccess: state?.Auth?.loginSuccess,
  cart: state?.Auth?.cart,
  err: state?.Auth?.err,
});

const mapDispatchToProps = {
  login,
  register,
  supplierRegister,
  forgotPwdUser,

  // Region Reducer //
  getCountries,
  getStates,
  getCities,
  setLoginSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
