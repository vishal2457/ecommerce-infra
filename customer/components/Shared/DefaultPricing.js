import dynamic from "next/dynamic";
import React from "react";
import { Fragment } from "react";
import {
  calculatePriceForSheets,
  UOM_TYPES,
} from "../../utility/commonUtility";
import Pricing from "./Pricing";
const PriceRanges = dynamic(() => import("./PriceRanges"));
const Overlay = dynamic(() => import("./Overlay"));

function DefaultPricing({
  product,
  authentication,
  active,
  inInquiry,
  setdefaultPrice,
  CustomersPricing,
  globalQuantity,
  defaultQuantity,
  inputQuantity
}) {
  const [pricing, setpricing] = React.useState("");

  const getRolltype = (pricingArr) => {
    let pricingObj = pricingArr[0];
    return `${
      active == pricingObj?.ProductUom ? pricingObj?.PricingUnit : ""
    } ${pricingObj?.rollType != "kg" ? pricingObj?.ProductUom == UOM_TYPES.rolls && active == UOM_TYPES.pallete ? 'Carton' : active : "kg"}`;
  };

  const getPricing = React.useMemo(() => {
    const { PackagingUnitPallete, PackagingUnitRies, ProductUom } =
      CustomersPricing[0];
    let customQuantity;
    if (ProductUom == UOM_TYPES.sheets) {
      if (globalQuantity) {
        if (active == UOM_TYPES.sheets) {
          customQuantity = globalQuantity;
        } else if (active == UOM_TYPES.ries) {
          customQuantity = globalQuantity * PackagingUnitRies;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = globalQuantity * PackagingUnitPallete;
        }
      } else if (inputQuantity) {
        if (active == UOM_TYPES.sheets) {
          customQuantity = inputQuantity;
        } else if (active == UOM_TYPES.ries) {
          customQuantity = inputQuantity * PackagingUnitRies;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = inputQuantity * PackagingUnitPallete;
        }
      } else if (defaultQuantity) {
        if (active == UOM_TYPES.sheets) {
          customQuantity = defaultQuantity;
        } else if (active == UOM_TYPES.ries) {
          customQuantity = defaultQuantity;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = defaultQuantity;
        }
      }
    } else {
      if (globalQuantity) {
        if (active == UOM_TYPES.rolls) {
          customQuantity = globalQuantity;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = globalQuantity * PackagingUnitPallete;
        }
      } else if (inputQuantity) {
        if (active == UOM_TYPES.rolls) {
          customQuantity = inputQuantity;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = inputQuantity * PackagingUnitPallete;
        }
      } else if (defaultQuantity) {
        if (active == UOM_TYPES.rolls) {
          customQuantity = defaultQuantity;
        } else if (active == UOM_TYPES.pallete) {
          customQuantity = defaultQuantity;
        }
      }
    }
    // return (
    //   <Pricing
    //     pricingArr={CustomersPricing}
    //     globalQuantity={null}
    //     inputQuantity={quantity}
    //     defaultQuantity={quantity}
    //     authentication={authentication}
    //     uomType={active}
    //     setpricing={setpricing}
    //   />
    // );
    return calculatePriceForSheets(
      CustomersPricing,
      customQuantity,
      authentication,
      null
    );
  }, [active, inputQuantity, defaultQuantity, globalQuantity, authentication]);

  const calculatePriceLocal = (qty, unit) => {
    return (qty * parseFloat(getPricing)) / unit;
  };

  const finalPricing = React.useMemo(() => {
    const { PackagingUnitPallete, PackagingUnitRies, ProductUom, PricingUnit } =
      CustomersPricing[0];
    if (ProductUom == UOM_TYPES.sheets) {
      if (active == UOM_TYPES.sheets) {
        return calculatePriceLocal(PricingUnit, PricingUnit);
      } else if (active == UOM_TYPES.ries) {
        return calculatePriceLocal(PackagingUnitRies, PricingUnit);
      } else if (active == UOM_TYPES.pallete) {
        return calculatePriceLocal(PackagingUnitPallete, PricingUnit);
      }
    } else {
      if (active == UOM_TYPES.rolls) {
        return calculatePriceLocal(PricingUnit, PricingUnit);
      } else if (active == UOM_TYPES.pallete) {
        return calculatePriceLocal(PackagingUnitPallete, PricingUnit);
      }
    }
    return null;
  });

  React.useEffect(() => {
    if (setdefaultPrice) {
      setdefaultPrice(`€ ${finalPricing}/${getRolltype(CustomersPricing)}`);
    }
    return () => {};
  }, [active, finalPricing]);

  return (
    <Fragment>
      &euro;&nbsp;{finalPricing} / {getRolltype(CustomersPricing)} &nbsp;
      {inInquiry ? null : (
        <Overlay
          component={
            <PriceRanges
              pricingObj={CustomersPricing[0]}
              MeasurementUnit={product?.Measurement_Unit?.MeasurementUnit}
            />
          }
          heading={product?.ProductName}
        />
      )}
    </Fragment>
  );
}

export default React.memo(DefaultPricing);
