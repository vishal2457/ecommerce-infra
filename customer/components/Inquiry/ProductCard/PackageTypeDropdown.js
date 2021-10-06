import React from "react";
import { ReactSelectDropdown } from "../../UI";

function PackageTypeDropdown({ options, value, handlePackageType, name }) {

  return (
    <ReactSelectDropdown
      arr={options}
      bindValue="uom"
      bindName="uom"
      name={name}
      value={value}
      onChange={handlePackageType}
      isClearable
      placeholder="Unit"
    />
  );
}

export default PackageTypeDropdown;
