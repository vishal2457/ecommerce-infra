import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input, ReactSelectDropdown } from "../../components/UI";
import {
  PAYMENT_METHODS,
  setLocalStorage,
  USER_LOCATION,
} from "../../utility/commonUtility";

import api from "../../Redux/api";

function AddressModal({ show, handleClose, getAllAddress, currenAddrss }) {
  let [errors, setErrors] = useState({});
  const [form, setform] = useState({});
  const [coOrdinates, setcoOrdinates] = useState({
    Logitude: "",
    Latitude: "",
  });
  let [CountriesArray, setCountriesArray] = useState([]);
  let [StatesArray, setStatesArray] = useState([]);
  let [CitiesArray, setCitiesArray] = useState([]);

  useEffect(() => {
    getCountries();
    if (currenAddrss) {
      setform(currenAddrss);
      getStates(currenAddrss.StateID);
      getCities(currenAddrss.StateID, currenAddrss.CityID);
    } else {
      setform({});
    }

    if (show) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      function success(pos) {
        var crd = pos.coords;
        setcoOrdinates({ Logitude: crd.longitude, Latitude: crd.latitude });
        setLocalStorage(USER_LOCATION, {
          latitude: crd.latitude,
          longitude: crd.longitude,
          accuracy: crd.accuracy,
        });
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    }

    return () => {};
  }, [show]);

  function getCountries() {
    api.get("/region/countries").then((res) => {
      if (res?.data?.status) {
        setCountriesArray(res?.data?.data);
      }
    });
  }

  function getStates(id) {
    api.get(`/region/states/${id}`).then((res) => {
      if (res?.data?.status) {
        setStatesArray(res?.data?.data);
      }
    });
  }

  function getCities(state_id, country_id) {
    api.get(`/region/cities/${state_id}/${country_id}`).then((res) => {
      if (res?.data?.status) {
        setCitiesArray(res?.data?.data);
      }
    });
  }

  const onChange = (e) => {
    errors[e.target.name] = null;
    errors[`R${e.target.name}`] = null;
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const onCountryChange = (selected) => {
    errors["CountryID"] = null;
    getStates(selected.ID);
    setform({ ...form, CountryID: selected.ID, Country: selected.Country });
  };

  const onStateChange = (selected) => {
    errors["StateID"] = null;
    getCities(selected.ID, form.CountryID);
    setform({ ...form, StateID: selected.ID, State: selected.State });
  };

  const onCityChange = (selected) => {
    errors["CityID"] = null;
    setform({ ...form, CityID: selected.ID, City: selected.City });
  };

  const onPaymentMethod = (selected) => {
    errors["PaymentMethod"] = null;
    setform({ ...form, PaymentMethod: selected.ID });
  };

  const handleFromValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!form["Title"]) {
      formIsValid = false;
      errors["Title"] = "Title Cannot be empty";
    }
    if (!form["Address"]) {
      formIsValid = false;
      errors["Address"] = "Address Cannot be empty";
    }
    if (!form["LandMark"]) {
      formIsValid = false;
      errors["LandMark"] = "Landmark Cannot be empty";
    }
    if (!form["CountryID"]) {
      formIsValid = false;
      errors["CountryID"] = "Select Country";
    }
    if (!form["StateID"]) {
      formIsValid = false;
      errors["StateID"] = "Select State";
    }
    if (!form["CityID"]) {
      formIsValid = false;
      errors["CityID"] = "Select City";
    }
    if (!form["ZipCode"]) {
      formIsValid = false;
      errors["ZipCode"] = "ZipCode Cannot be empty";
    }
    if (!form["PaymentMethod"]) {
      formIsValid = false;
      errors["PaymentMethod"] = "Select a payment method";
    }

    setErrors(errors);
    return formIsValid;
  };

  function onsubmit(id) {
    console.log(id);

    if (handleFromValidation()) {
      console.log(form, errors);

      if (id) {
        api
          .post("/address/updateAddress/" + id, form)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              console.log(res.data.data);
              handleClose();
              getAllAddress();
              //setAddressArr(res?.data?.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        api
          .post("/address/addNew", form)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              console.log(res.data.data);
              handleClose();
              getAllAddress();
              //setAddressArr(res?.data?.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{form ? "Edit Address" : "Add Address"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4 my-2">
            <label>Title</label>
            <Input
              type="text"
              name="Title"
              placeholder="eg Home, Office, Warehouse"
              value={form.Title ? form.Title : ""}
              onChange={onChange}
            />
            <span className="form-field-error">{errors["Title"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Address</label>
            <Input
              type="textarea"
              name="Address"
              placeholder="Address"
              value={form.Address ? form.Address : ""}
              onChange={onChange}
            />
            <span className="form-field-error">{errors["Address"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>LandMark</label>
            <Input
              type="textarea"
              name="LandMark"
              placeholder="LandMark"
              value={form.LandMark ? form.LandMark : ""}
              onChange={onChange}
            />
            <span className="form-field-error">{errors["LandMark"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Country</label>
            <ReactSelectDropdown
              arr={CountriesArray}
              bindName="Country"
              bindValue="ID"
              value={form.CountryID ? form.CountryID : ""}
              onChange={onCountryChange}
              placeholder="Country"
              name="Country"
            />
            <span className="form-field-error">{errors["CountryID"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>State/Province</label>
            <ReactSelectDropdown
              arr={StatesArray}
              bindName="State"
              bindValue="ID"
              value={form.StateID ? form.StateID : ""}
              onChange={onStateChange}
              placeholder="State"
              name="State"
            />
            <span className="form-field-error">{errors["StateID"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>City</label>
            <ReactSelectDropdown
              arr={CitiesArray}
              bindName="City"
              bindValue="ID"
              value={form.CityID ? form.CityID : ""}
              onChange={onCityChange}
              placeholder="City"
              name="City"
            />
            <span className="form-field-error">{errors["CityID"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Payment Method</label>
            <ReactSelectDropdown
              arr={PAYMENT_METHODS}
              bindName="name"
              bindValue="ID"
              value={form.PaymentMethod ? form.PaymentMethod : ""}
              onChange={onPaymentMethod}
              placeholder="Payment Method"
              name="PaymentMethod"
            />
            <span className="form-field-error">{errors["CityID"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Zip Code</label>
            <Input
              placeholder="Zip Code"
              type="number"
              name="ZipCode"
              value={form.ZipCode ? form.ZipCode : ""}
              onChange={onChange}
            />
            <span className="form-field-error">{errors["ZipCode"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Phone</label>
            <Input
              placeholder="Phone"
              type="number"
              name="Phone"
              value={form.Phone ? form.Phone : ""}
              onChange={onChange}
            />
            <span className="form-field-error">{errors["Phone"]}</span>
          </div>
          <div className="col-md-4 my-2">
            <label>Longitude</label>
            <Input
              type="Longitude"
              name="Longitude"
              disabled={true}
              placeholder="Longitude"
              value={coOrdinates.Logitude}
            />
          </div>
          <div className="col-md-4 my-2">
            <label>Latitude</label>
            <Input
              type="Longitude"
              name="Latitude"
              disabled={true}
              placeholder="Latitude"
              value={coOrdinates.Latitude}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onsubmit(form.ID)}>
          Save
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddressModal;
