import React from "react";
import { Fragment } from "react";
import {
  calculatePrice,
  getCustomerPricing,
  getLocaleString,
} from "../../utility/commonUtility";

function Pricing({
  pricingArr,
  authentication,
  globalQuantity,
  inputQuantity,
  defaultQuantity,
  groupArr,
  setpricing,
  uomType,
  CustomersPricing,
  plainValue,
}) {
  /**
   * @params PRICING ARRAY (get Customer group if groupArr provided else send pricingArr)
   * @params INPUT QUANTITIY (Send users input quantity if provided else defaultquantity)
   * @params AUTHENTICATION (user is logged in or not)
   * @params GLOBAL QUANTITY (global quantity if provided)
   *
   */
  const finalPricing = React.useMemo(() => {
    return calculatePrice(
      groupArr ? CustomersPricing : pricingArr,
      inputQuantity ? inputQuantity : defaultQuantity,
      authentication,
      globalQuantity ? globalQuantity : null
    );
  }, [inputQuantity, authentication, globalQuantity]);

  React.useEffect(() => {
    if (typeof setpricing == "function") setpricing(parseFloat(finalPricing));
    return () => {};
  }, [uomType, inputQuantity]);

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

export default Pricing;
