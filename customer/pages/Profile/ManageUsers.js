import React, { useEffect, useState } from "react";
import CommonProfile from "../../components/profile/CommonProfile";
import CustomerAdmin from "../../components/profile/CustomerAdmin";
import Form from "../../components/profile/manageUsers/form";
import Grid from "../../components/profile/manageUsers/grid";
import Conditional from "../../components/Shared/Conditional";
import { Button, Input } from "../../components/UI";
import api from "../../Redux/api";
import { showAlert } from "../../utility/commonUtility";

function ManageUsers() {
  const formTypeObj = { LIST: "LIST", ADD: "ADD", EDIT: "EDIT" };
  let requestTypes = {
    UPDATE_DATA: "UPDATE_DATA",
    ADMIN_REQ: "ADMIN_REQ",
  };
  const { LIST, ADD, EDIT } = formTypeObj;
  const formKeys = {
    UserName: "UserName",
    Email: "Email",
    Password: "Password",
    ConfirmPassword: "ConfirmPassword",
  };

  const [form, setform] = useState({
    UserName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [errors, seterrors] = useState({});
  const [formSubmitAttempt, setformSubmitAttempt] = useState(false);
  const [formType, setformType] = useState(LIST);
  const [loading, setloading] = useState(false); //loading for update and add button
  const [gridLoader, setgridLoader] = useState(false);
  const [users, setusers] = useState([]);

  /**
   * @toggle form type
   */
  const toggleForm = () => {
    setformType(formType == LIST ? ADD : LIST);
  };

  /**
   * @Get_All_Users
   */
  const getAllUsers = () => {
    setgridLoader(true);
    api
      .get("/customer/users?page=1&limit=10")
      .then((res) => {
        setusers(res?.data?.data?.rows);
        setgridLoader(false);
      })
      .catch((err) => {
        console.log(err, "this is error");
      });
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  /**
   * @check if form is valid or not
   */
  const checkForm = () => {
    if (!formSubmitAttempt) return;
    let obj = {};
    for (let i of Object.keys(form)) {
      if (!form[i]) {
        obj[i] = `This field is required`;
      }
    }
    seterrors(obj);
    if (!Object.keys(obj).length) return true;
    return false;
  };

  //formvalid memoised varaible
  const isFormValid = React.useMemo(() => {
    return checkForm();
  }, [form, formSubmitAttempt]);

  /**
   * @handle form change
   * @param {object} e event
   */
  const handleFormChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * @Save_User
   */
  const onSave = () => {
    if (form.Password != form.ConfirmPassword) {
      return showAlert("Password doesn't match-err");
    }
    setformSubmitAttempt(true);
    if (!isFormValid) return;
    setloading(true);
    api
      .post("/customer/users", form)
      .then((res) => {
        setloading(false);
        showAlert("User added-custom");
        toggleForm();
        getAllUsers()
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };

  /**
   * @Delete_Users
   */
  const deleteUser = (userID) => {
    if (users.length == 1) {
      return showAlert("You cannot delete the last user-err");
    }
    showAlert("Are you sure ?-confirmation", "YES").then((result) => {
      if (!result.isConfirmed) return;
      api
        .delete(`/customer/users?userid=${userID}`)
        .then((result) => {
          getAllUsers();
          showAlert("Deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  /**
   * @Uodate_User
   */
  const updateUser = (status, userid) => {
    showAlert("Are you sure?-confirmation", "YES").then((result) => {
      if (!result.isConfirmed) return;

      api
        .put(
          `/customer/users?type=${requestTypes.ADMIN_REQ}&userid=${userid}&status=${status}`,
          null
        )
        .then((res) => {
          getAllUsers();
          showAlert("Updated");
        })
        .catch((err) => {
          console.log(err, "error while updating user");
        });
    });
  };

  return (
    <CommonProfile active="manageUsers">
      <div>
        <div className="d-flex justify-content-between">
          <span className="pt-2">
            <p className="font-weight-bold">Manage Users</p>
          </span>
          <Button variant="primary" onClick={toggleForm} className="px-2 my-2">
            <Conditional
              condition={formType == LIST}
              elseComponent={
                <>
                  <i className="fa fa-arrow-left" /> Back
                </>
              }
            >
              <i className="fa fa-plus" /> Add
            </Conditional>
          </Button>
        </div>
        <Conditional
          condition={formType == LIST}
          elseComponent={
            <Form
              handleFormChange={handleFormChange}
              isFormValid={isFormValid}
              formSubmitAttempt={formSubmitAttempt}
              formKeys={formKeys}
              errors={errors}
              onSave={onSave}
              form={form}
              loading={loading}
            />
          }
        >
          <Grid users={users} deleteUser={deleteUser} updateUser={updateUser} gridLoader={gridLoader} />
        </Conditional>
      </div>
    </CommonProfile>
  );
}

export default CustomerAdmin(ManageUsers);
