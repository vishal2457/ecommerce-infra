import React from "react";
import {
  calculatePriceForSheets,
  getCustomerPricing,
  getLocaleString,
  UOM_TYPES,
} from "../../utility/commonUtility";

function ShopPricing({
  authentication,
  globalQuantity,
  inputQuantity,
  defaultQuantity,
  uomType,
  groupArr,
  setpricing,
  CustomersPricing,
  plainValue,
}) {
  
  const pricing = React.useMemo(() => {
    const { PackagingUnitPallete, PackagingUnitRies, ProductUom } =
      CustomersPricing[0];
    let quantity;
    if (ProductUom == "Sheets") {
      if (globalQuantity) {
        if (uomType == "Sheets") {
          quantity = globalQuantity;
        } else if (uomType == "Ries") {
          quantity = globalQuantity * PackagingUnitRies;
        } else if (uomType == "Pallete") {
          quantity = globalQuantity * PackagingUnitPallete;
        }
      } else if (inputQuantity) {
        if (uomType == "Sheets") {
          quantity = inputQuantity;
        } else if (uomType == "Ries") {
          quantity = inputQuantity * PackagingUnitRies;
        } else if (uomType == "Pallete") {
          quantity = inputQuantity * PackagingUnitPallete;
        }
      } else if (defaultQuantity) {
        if (uomType == "Sheets") {
          quantity = defaultQuantity;
        } else if (uomType == "Ries") {
          quantity = defaultQuantity;
        } else if (uomType == "Pallete") {
          quantity = defaultQuantity;
        }
      }
    } else {
      if (globalQuantity) {
        if (uomType == "Rolls") {
          quantity = globalQuantity;
        } else if (uomType == "Pallete") {
          quantity = globalQuantity * PackagingUnitPallete;
        }
      } else if (inputQuantity) {
        if (uomType == "Rolls") {
          quantity = inputQuantity;
        } else if (uomType == "Pallete") {
          quantity = inputQuantity * PackagingUnitPallete;
        }
      } else if (defaultQuantity) {
        if (uomType == "Rolls") {
          quantity = defaultQuantity;
        } else if (uomType == "Pallete") {
          quantity = defaultQuantity;
        }
      }
    }
    /**
     * @params
     */
    return calculatePriceForSheets(
      CustomersPricing,
      quantity,
      authentication,
      null
    );
  }, [inputQuantity, authentication, globalQuantity, uomType, groupArr]);

  const calculatePriceLocal = (qty, unit) => {
    return (qty * parseFloat(pricing)) / unit;
  };

  const finalPricing = React.useMemo(() => {
    const { PackagingUnitPallete, PackagingUnitRies, ProductUom, PricingUnit } =
      CustomersPricing[0];
    if (ProductUom == UOM_TYPES.sheets) {
      if (globalQuantity) {
        if (uomType == UOM_TYPES.sheets) {
          return calculatePriceLocal(globalQuantity, PricingUnit);
        } else if (uomType == UOM_TYPES.ries) {
          return (
            (globalQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitRies)
          );
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (globalQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitPallete)
          );
        }
      } else if (inputQuantity) {
        if (uomType == UOM_TYPES.sheets) {
          return (inputQuantity * parseFloat(pricing)) / PricingUnit;
        } else if (uomType == UOM_TYPES.ries) {
          return (
            (inputQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitRies)
          );
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (inputQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitPallete)
          );
        }
      } else if (defaultQuantity) {
        if (uomType == UOM_TYPES.sheets) {
          return pricing;
        } else if (uomType == UOM_TYPES.ries) {
          return (
            ((PricingUnit / PackagingUnitRies) * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitRies)
          );
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (PackagingUnitPallete * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitPallete)
          );
        }
      }
    } else {
      if (globalQuantity) {
        if (uomType == UOM_TYPES.rolls) {
          return (globalQuantity * parseFloat(pricing)) / PricingUnit;
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (globalQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitPallete)
          );
        }
      } else if (inputQuantity) {
        if (uomType == UOM_TYPES.rolls) {
          return (inputQuantity * parseFloat(pricing)) / PricingUnit;
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (inputQuantity * parseFloat(pricing)) /
            (PricingUnit / PackagingUnitPallete)
          );
        }
      } else if (defaultQuantity) {
        if (uomType == UOM_TYPES.rolls) {
          return pricing;
        } else if (uomType == UOM_TYPES.pallete) {
          return (
            (1 * parseFloat(pricing)) / (PricingUnit / PackagingUnitPallete)
          );
        }
      }
    }
    return null;
  });

  React.useEffect(() => {
    console.log(parseFloat(finalPricing), "his are final pricing");
    if (typeof setpricing == "function") setpricing(parseFloat(finalPricing));
    return () => {};
  }, [uomType, inputQuantity, defaultQuantity, globalQuantity]);


  // return plainValue ? (
  //   //plainValue return
 
  //   parseFloat(parseFloat(finalPricing).toFixed(3))
  // ) : (
  //   // DOM element return
  //   <React.Fragment>
  //     € {parseFloat(parseFloat(finalPricing).toFixed(3))}
  //   </React.Fragment>
  // );



  return plainValue ? (
    //plainValue return
    getLocaleString(finalPricing)
  ) : (
    // DOM element return
    <React.Fragment>
      € {getLocaleString(finalPricing)}
    </React.Fragment>
  );
}

export default ShopPricing;
