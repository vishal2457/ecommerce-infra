import React from "react";

function SupplierDetails({data}) {
    return (
    <ul className="list-unstyled popover-info">
      <li>
        <span className="text-muted">Contact Person: </span> {data?.ContactPersonName}
      </li>
      <li>
        <span className="text-muted">Email: </span> {data?.Email}
      </li>
      <li>
        <span className="text-muted">Industry: </span> {data?.Industry}
      </li>
      <li>
        <span className="text-muted">Vat Tax No: </span> {data?.Vat_Tax_No}
      </li>
      <li>
        <span className="text-muted">Zip Code: </span> {data?.ZipCode}
      </li>
    
    </ul>
  );
}

export default SupplierDetails;
