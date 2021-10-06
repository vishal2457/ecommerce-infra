import dynamic from "next/dynamic";
import React from "react";
import { UOM_TYPES } from "../../utility/commonUtility";
const CustomTooltip = dynamic(() => import("./Tooltip"));

function PackageTypes({ pricingObj, setactive, active, setquantity }) {
  const getCommonBlock = (obj) => {
    return obj.hasTooltip ? (
      <CustomTooltip
        renderComponent={
          <p>
            {obj?.PackagingUnit} {obj?.productUom}/{obj?.productUom == UOM_TYPES.rolls && obj?.Uom == UOM_TYPES.pallete ? "Carton" : obj?.Uom  }
          </p>
        }
      >
        <h3>
          <span
            className={`badge bg-light text-dark pointer ${
              active == obj?.Uom ? "activeUom" : null
            }`}
            onClick={() => {
              setquantity(obj?.quantity)
              setactive(obj?.Uom)}}
          >
            {obj?.productUom == UOM_TYPES.rolls && obj?.Uom == UOM_TYPES.pallete ? "Carton" : obj?.Uom }

          </span>
        </h3>
      </CustomTooltip>
    ) : (
      <h3>
        <span
          className={`badge bg-light text-dark pointer ${
            active == obj?.Uom ? "activeUom" : null
          }`}
          onClick={() => {
            setquantity(obj?.quantity)
            setactive(obj?.Uom)}}
        >
          {obj?.Uom}
        </span>
      </h3>
    );
  };

  return (
    <div className={`d-flex justify-content-${pricingObj?.rollType == "kg" ? "around" : ""}`}>
      {getCommonBlock({ Uom: pricingObj?.ProductUom, hasTooltip: false, quantity: pricingObj?.PricingUnit })}
      {pricingObj?.ProductUom == UOM_TYPES.sheets
        ? getCommonBlock({
            Uom: "Ries",
            hasTooltip: true,
            productUom: pricingObj?.ProductUom,
            PackagingUnit: pricingObj?.PackagingUnitRies,
            quantity:  pricingObj?.PackagingUnitRies
          })
        : null}
       
      {pricingObj?.rollType != "kg"
        ? getCommonBlock({
            Uom: "Pallete",
            hasTooltip: true,
            PackagingUnit: pricingObj?.PackagingUnitPallete,
            productUom: pricingObj?.ProductUom,
            quantity:  pricingObj?.PackagingUnitPallete
          })
        : null}
    </div>
  );
}

export default PackageTypes;
