import React from "react";
import AddressWrapper from "../../Addresses/AddressWrapper";

function Account({ AddressArr, isEdit, userDataArr, getAllAdddress}) {


  const EditMode = () => {
    return (
      <div className="row">
        <div className="col-md-2 mb-3">
          <label className="form-label">First Name</label>

          <input
            className="form-control"
            placeholder="First Name"
            value={userDataArr.CustomerName}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label className="form-label">Last Name</label>

          <input
            className="form-control"
            placeholder="Last Name"
            value={userDataArr.ShortName}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Contact Number</label>

          <input
            className="form-control"
            placeholder="Contact Number"
            value={userDataArr.Phone}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Email</label>

          <input
            className="form-control"
            placeholder="Email"
            value={userDataArr.Email}
          />
        </div>
      </div>
    );
  };

  const NormalMode = () => {
    return (
      <div className="row">
        <div className="col-md-2 mb-3">
          <label className="form-label">First Name</label>

          <div className="label_value">
            {userDataArr.CustomerName ? userDataArr.CustomerName : "-"}
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <label className="form-label">Last Name</label>

          <div className="label_value">
            {userDataArr.ShortName ? userDataArr.ShortName : "-"}
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Contact Number</label>

          <div className="label_value">
            {userDataArr.Phone ? userDataArr.Phone : "-"}
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Email</label>

          <div className="label_value">
            {userDataArr.Email ? userDataArr.Email : "-"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isEdit ? (
        <EditMode />
      ) : (
        <NormalMode />
      )}
      <AddressWrapper AddressArr={AddressArr} getAllAdddress={getAllAdddress} />
    </>
  );
}

export default Account;
