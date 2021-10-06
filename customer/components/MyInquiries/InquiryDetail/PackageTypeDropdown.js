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
      //disabled={true} //disabled bcoz not handled ID and UOM condition here....
    />
  );
}

export default PackageTypeDropdown;
