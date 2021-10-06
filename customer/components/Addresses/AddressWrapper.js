import React, { useState } from "react";
import dynamic from "next/dynamic";
import { getUser } from "../../utility/commonUtility";
import api from "../../Redux/api";
import { showAlert } from "../../utility/commonUtility";

//import api from "../../Redux/api";

const AddressModal = dynamic(() => import("./AddressModal"));
const AddressCard = dynamic(() => import("./AddressCard"));

function AddressWrapper({
  AddressArr,
  isCart,
  getAllAdddress,
  selectedID,
  setselectedID,
}) {
  const [defaultSelected, setdefaultSelected] = useState(0);

  const [show, setShow] = useState(false);
  const [currenAddrss, setcurrenAddrss] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setcurrenAddrss(AddressArr.filter((address) => address.ID === id)[0]);
    setShow(true);
  };

  const handleDelete = (id) => {
    showAlert("confirmDelete")
      .then((result) => {
        if (!result.isConfirmed) return false;
        api
          .post(`address/deleteAddress/${id}`)
          .then((res) => {
            if (res?.data?.status) {
              getAllAdddress();
            }
          })
          .catch();
      })
      .catch();
  };

  function selectCard(address, index) {
    if (setselectedID) {
      setselectedID(address);
      setdefaultSelected(index);
    }
  }

  return (
    <div className="row">
      {AddressArr.map((Address, index) => {
        return (
          <AddressCard
            index={index}
            defaultSelected={defaultSelected}
            Address={Address}
            selectCard={selectCard}
            selectedID={selectedID}
            isCart={isCart}
            handleShow={handleShow}
            handleDelete={handleDelete}
            isAdmin={getUser()?.isAdmin}
          />
        );
      })}
      {getUser()?.isAdmin ? (
        <div className="col-md-4 mb-3">
          <div className="card shadow  p-3 address_card pointer">
            <div className="card-body">
              <div className="add_address_box" onClick={handleShow}>
                <i className="fa fa-plus" />
                <p className="addnew">Add New</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <AddressModal
        show={show}
        handleClose={handleClose}
        getAllAddress={getAllAdddress}
        currenAddrss={currenAddrss}
      />
    </div>
  );
}

export default AddressWrapper;
