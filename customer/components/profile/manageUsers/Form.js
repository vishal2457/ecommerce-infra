import React from "react";
import { Button, Input } from "../../UI";

function Form({
  formSubmitAttempt,
  errors,
  form,
  formKeys,
  handleFormChange,
  onSave,
  loading,
}) {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <label>Name</label>
          <Input
            type="text"
            name={formKeys.UserName}
            onChange={handleFormChange}
            value={form.UserName}
          />
          <span className="text-danger">
            {formSubmitAttempt && errors[formKeys.UserName]}
          </span>
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <Input
            type="text"
            name={formKeys.Email}
            onChange={handleFormChange}
            value={form.Email}
          />
          <span className="text-danger">
            {formSubmitAttempt && errors[formKeys.Email]}
          </span>
        </div>
        <div className="col-md-6">
          <label>Password</label>

          <Input
            type="text"
            name={formKeys.Password}
            onChange={handleFormChange}
            value={form.Password}
          />
          <span className="text-danger">
            {formSubmitAttempt && errors[formKeys.Password]}
          </span>
        </div>

        <div className="col-md-6">
          <label>Confirm password</label>
          <Input
            type="text"
            name={formKeys.ConfirmPassword}
            onChange={handleFormChange}
            value={form.ConfirmPassword}
          />
          <span className="text-danger">
            {formSubmitAttempt && errors[formKeys.ConfirmPassword]}
          </span>
        </div>
      </div>

      <div className="text-right">
        <Button
          variant="primary"
          onClick={onSave}
          className="mt-4"
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default Form;
