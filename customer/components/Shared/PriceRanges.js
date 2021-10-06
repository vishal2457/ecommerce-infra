import React from "react";
import { Fragment } from "react";

function PriceRanges({ pricingObj, MeasurementUnit }) {
  return (
    <table className="table table-md table-striped">
      <thead  >
        <th width="50%" style={{borderTop: 0}} >Quantity ({MeasurementUnit})</th>
        <th style={{borderTop: 0}}>Price for {`${pricingObj?.PricingUnit}/${MeasurementUnit}`}</th>
      </thead>
      <tbody>
        {pricingObj?.Price_Ranges?.length &&
          pricingObj?.Price_Ranges.map((range, index) => {
            return (
              <tr>
                <td>
                  {isNaN(pricingObj?.Price_Ranges[index + 1]?.Quantity - 1) ? (
                    <Fragment>
                      {">"} {range?.Quantity}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {range?.Quantity}-
                      {pricingObj?.Price_Ranges[index + 1]?.Quantity - 1}
                    </Fragment>
                  )}
                </td>
                <td>&euro;&nbsp;{range.Price}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default PriceRanges;
