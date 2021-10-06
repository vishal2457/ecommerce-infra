import React, { useState, useEffect } from "react";
import api from "../../../Redux/api";
import { Button, Card, CardBody, CardHeader, Input } from "../../UI";


function ChangePassword({ }) {


  let [errors, setErrors] = useState({});
  const [oldPasswordForm, setoldPasswordForm] = useState({});
  const [newPasswordForm, setnewPasswordForm] = useState({});

  const [IsCheck, setIsCheck] = useState(false);

  useEffect(() => {


    return () => { };
  }, []);

  const onChangeOldPassword = (e) => {
    errors[e.target.name] = null;
    errors[`R${e.target.name}`] = null;
    setoldPasswordForm({ ...oldPasswordForm, [e.target.name]: e.target.value });
  };

  const handleOldPasswordFromValidation = () => {
    let errors = {};
    let oldPasswordFormIsValid = true;

    if (!oldPasswordForm["OldPassword"]) {
      oldPasswordFormIsValid = false;
      errors["OldPassword"] = "Old Password Cannot be empty";
    }

    setErrors(errors);
    return oldPasswordFormIsValid;

  }

  function checkPassword() {

    console.log(oldPasswordForm, errors);
    if (handleOldPasswordFromValidation()) {
      var reqBody = {
        password: oldPasswordForm.OldPassword
      }

      api.post("auth/checkPassword/", reqBody)
        .then((res) => {
          console.log(res);
          if (res?.data?.status) {
            setIsCheck(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

  }


  const onChangeNewPassword = (e) => {
    errors[e.target.name] = null;
    errors[`R${e.target.name}`] = null;
    setnewPasswordForm({ ...newPasswordForm, [e.target.name]: e.target.value });
  };

  const handleNewPasswordFromValidation = () => {
    let errors = {};
    let newPasswordFormIsValid = true;

    if (!newPasswordForm["NewPassword"]) {
      newPasswordFormIsValid = false;
      errors["NewPassword"] = "New Password Cannot be empty";
    }
    if (!newPasswordForm["ConfirmPassword"]) {
      newPasswordFormIsValid = false;
      errors["ConfirmPassword"] = "Confirm Password Cannot be empty";
    }

    setErrors(errors);
    return newPasswordFormIsValid;

  }


  function changePassword() {

    //console.log(newPasswordForm, errors);
    if (handleNewPasswordFromValidation()) {

      if (newPasswordForm.ConfirmPassword == newPasswordForm.NewPassword) {

        var reqBody = {
          ID: (JSON.parse(localStorage.getItem('USER_DATA'))).id,
          Password: newPasswordForm.ConfirmPassword
        }

        api.post("auth/changePassword/", reqBody)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              alert(res?.data?.msg);
            }
          })
          .catch((err) => {
            console.error(err);
          });

      }else{
        alert('New and Confirm Password must be same');
      }

    }

  }



  return (
    <>

      <h4>Change Password</h4>
      <div className="row ">
        <div className="col-md-6">

          {IsCheck ? (
            <>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <Input
                  type="password"
                  name="NewPassword"
                  placeholder="New Password"
                  onChange={onChangeNewPassword}
                />
                <span className="form-field-error">{errors["NewPassword"]}</span>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <Input
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Confirm Password"
                  onChange={onChangeNewPassword}
                />
                <span className="form-field-error">{errors["ConfirmPassword"]}</span>
              </div>
              <div className="text-right">
                <button className="btn btn-sm btn-outline-dark" onClick={() => changePassword()}>Submit</button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Old Password</label>
                <Input
                  type="password"
                  name="OldPassword"
                  placeholder="Old Password"
                  onChange={onChangeOldPassword}
                />
                <span className="form-field-error">{errors["OldPassword"]}</span>
              </div>
              <div className="text-right">
                <button className="btn btn-sm btn-outline-dark" onClick={() => checkPassword()}>Submit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
