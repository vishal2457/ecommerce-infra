import React, { useState, Fragment, useContext } from "react";
import { AuthContext } from "../../contexts/auth/auth.context";
import { useCart } from "../../contexts/cart/user-cart";
import api from "../../Redux/api";
import { setLocalStorage, TOKEN_PREFIX } from "../../utility/commonUtility";
import { Input } from "../UI";
import Button from "./Button";

function QuickAuth({ deliveryDate }) {
  const {
    items,
    CartItemTotalPrice,
    addItemOnLogin
  } = useCart();
  const { authDispatch } = useContext(AuthContext);
  const [formType, setformType] = useState("login");
  const [passwordTypeState, setpasswordTypeState] = useState("password");
  const [loading, setloading] = useState(false)
  const [state, setstate] = useState({
    email: "",
    password: "",
    name: "",
    number: "",
    forgotEmail: ""
  });

  const onChange = (e) => {
    setstate({ ...state, [e.target.name]: e.target.value });
  };

  const showForgotPwd = () => {
    setformType('forgotPwd');
  }

  const login = () => {
    setloading(true)
    api
      .post("/auth/customer", { Email: state.email, Password: state.password, cartData: { items, totalPrice: CartItemTotalPrice(), DeliveryDate: deliveryDate } })
      .then((res) => {
        if (res?.data?.status) {
          localStorage.setItem(TOKEN_PREFIX, res?.data?.data?.token);
          setLocalStorage("USER_DATA", res?.data?.data?.user)
          setLocalStorage("authentication", { isAuthenticated: true })
          if (res?.data?.data?.cart) {
            for (let item of res.data.data.cart) {
              let singleItem = JSON.parse(item.Info)
              addItemOnLogin(singleItem, singleItem.quantity, singleItem.buyin)
            }
          }
          authDispatch({ type: "SIGNIN_SUCCESS" });
        }
        setloading(false)

      });
  };

  const register = () => {
    setloading(true)
    const { email, name, number, password } = state;
    api.post("/customer/register", {
      Email: email,
      Password: password,
      CustomerName: name,
      Number: number,
    }).then(res => {
      localStorage.setItem(TOKEN_PREFIX, res?.data?.data?.token);
      localStorage.setItem(
        "USER_DATA",
        JSON.stringify(res?.data?.data?.user)
      );
      localStorage.setItem(
        "authentication",
        JSON.stringify({ isAuthenticated: true })
      );
      authDispatch({ type: "SIGNIN_SUCCESS" });
      setloading(false)
    })
  };

  const forgotPwd = () => {
    setloading(true)
    const { forgotEmail } = state;
    api.post("/auth/forgotPassword", { Email: forgotEmail })
      .then(res => {
        if (res?.data?.status) {
          showAlert(`${res?.data?.data.msg}-custom`);
        }
        setloading(false);
      })
  };

  const getForgotPwd = () => {
    return (
      <Fragment>
        <div className="form-group">
          <Input
            className="form-control rounded-border"
            name="forgotEmail"
            placeholder="Email"
            type="text"
            autoComplete="off"
            value={state.forgotEmail}
            onChange={onChange}
          />
        </div>
      </Fragment>
    );
  };

  const getLogin = () => {
    return (
      <Fragment>
        <div className="form-group">
          {/* <label>Email</label> */}
          <Input
            className="form-control rounded-border"
            name="email"
            placeholder="Email"
            type="text"
            autoComplete="off"
            value={state.email}
            onChange={onChange}
          />
        </div>
        <div className="form-group mb-0">
          {/* <label>Password</label> */}
          <Input
            className="form-control rounded-border"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            type={passwordTypeState}
            value={state.password}
            onChange={onChange}
          />

          <span
            className="btn btn-link show-password"
            onClick={() =>
              setpasswordTypeState(
                passwordTypeState == "password" ? "text" : "password"
              )
            }
          >
            <i
              className={`fa fa-${passwordTypeState == "password" ? "eye-slash" : "eye"
                }`}
            ></i>
          </span>
        </div>
        <small>
          <a className="link" onClick={showForgotPwd}>Forgot Password ?</a>
        </small>
      </Fragment>
    );
  };

  const getRegister = () => {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-6 pr-1">
            <div className="form-group">
              <Input
                className="form-control rounded-border"
                name="name"
                placeholder="Name"
                type="text"
                value={state.name}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="col-md-6 pl-1">
            <div className="form-group">
              <Input
                className="form-control rounded-border"
                name="number"
                placeholder="Number"
                type="number"
                value={state.number}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <Input
            className="form-control rounded-border"
            name="email"
            placeholder="Email"
            autoComplete="off"
            type="text"
            value={state.email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <Input
            className="form-control rounded-border"
            name="password"
            placeholder="Password"
            type={passwordTypeState}
            autoComplete="new-password"
            value={state.password}
            onChange={onChange}
          />

          <span
            className="btn btn-link show-password"
            onClick={() =>
              setpasswordTypeState(
                passwordTypeState == "password" ? "text" : "password"
              )
            }
          >
            <i
              className={`fa fa-${passwordTypeState == "password" ? "eye-slash" : "eye"
                }`}
            ></i>
          </span>
        </div>
      </Fragment>
    );
  };

  return (
    <div className="text-left">
      {/* <h1 className="main-title">{formType.toUpperCase()}</h1> */}


      {formType != "forgotPwd" ? (
        <small>
          Please {formType}. {formType == "login" ? "Don't" : "Already"} have an
      account?{" "}
          <a
            className="link"
            onClick={() =>
              setformType(formType == "login" ? "register" : "login")
            }
          >
            {formType == "login" ? "Register" : "Login"}
          </a>{" "}
        </small>
      ) : (
        <small>
          Please Enter Your Email Address{" "}
          <a
            className="link"
            onClick={() =>
              setformType("login")
            }
          >Back</a>
        </small>
      )}

      {formType == "login" ? getLogin() : ''}
      {formType == "register" ? getRegister() : ''}
      {formType == "forgotPwd" ? getForgotPwd() : ''}

      {formType != "forgotPwd" ? (
        <Button
          className="btn btn-secondary btn-block mt-3"
          type="submit"
          loading={loading}
          disabled={
            formType == "login"
              ? !state.email || !state.password
              : !state.email || !state.number || !state.password || !state.name
          }
          onClick={formType == "login" ? login : register}
        >
          {formType == "login" ? "Login" : "Register"}
        </Button>
      ) : (
        <Button
          className="btn btn-secondary btn-block mt-3"
          type="submit"
          loading={loading}
          disabled={!state.forgotEmail}
          onClick={forgotPwd}
        >Submit</Button>
      )}
    </div>
  );
}

export default QuickAuth;
