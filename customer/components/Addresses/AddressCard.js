import React from "react";


function AddressCard({
  index,
  defaultSelected,
  Address,
  selectedID,
  selectCard,
  isCart,
  handleShow,
  handleDelete,
  isAdmin,
}) {
  let cardSelected = () => {
    let returnValue = false;
    if (isCart) {
      if (selectedID?.ID == Address.ID || index == defaultSelected) {
        returnValue = true;
      }
    } else {
      if (selectedID?.ID == Address.ID) {
        returnValue = true;
      }
    }

    return returnValue;
  };

  

  return (
    <div className="col-md-4 mb-3">
      <div
        className={`card shadow p-1 pointer address_card ${
          cardSelected() ? "selected" : ""
        }`}
        onClick={() => selectCard(Address, index)}
      >
        <div className="card-body">
          <h6 className="h6 mb-1 text-uppercase">{Address.Title}</h6>
          <p className="m-0">
            {Address.Address}, {Address.LandMark},<br />
            {Address["City.City"]}, {Address.ZipCode} <br />
            {Address["State.State"]}, {Address["Country.Country"]}.
          </p>

          {isAdmin ? (
            <div className="card_action">
              <i
                className="fa fa-edit pointer"
                onClick={() => handleShow(Address.ID)}
              />
              <i
                className="fa fa-trash pointer"
                onClick={() => handleDelete(Address.ID)}
              />
            </div>
          ) : null}
          {cardSelected() ? (
            <i class="fa fa-check-square-o text-success seleced_position"></i>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
