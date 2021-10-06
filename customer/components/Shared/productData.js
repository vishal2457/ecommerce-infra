import React from "react";
import { ResourceApiUrl } from "../../utility/commonUtility";
import Image from "../image/image";

function ProductData({ data }) {
  //console.log(data, "check me");
  return (
    <ul className="list-unstyled popover-info">
      <li>
        {" "}
        <Image
          className="popover-product-img card-img-top img-fluid"
          src={`${ResourceApiUrl}${
            data?.Product_Images ? data?.Product_Images[0]?.Image : ""
          }`}
          alt={data?.ProductName}
        />
      </li>
      <li>
        <span className="text-muted">Product No :</span> {data?.ProductNo}
      </li>
      <li>
        <span className="text-muted">GSM :</span> {data?.Paper_Gsm?.PaperGsm}
      </li>
      <li>
        <span className="text-muted">Size :</span>
        {data?.Height} X {data?.Width}
      </li>
      <li>
        <span className="text-muted">Quality :</span>{" "}
        {data?.Paper_Quality?.PaperQuality}
      </li>
      <li>
        <span className="text-muted">Printability :</span>
        {data?.Paper_Printibility?.PaperPrintibility}
      </li>
      <li>
        <span className="text-muted">Color :</span>
        {data?.Paper_Color?.PaperColor}
      </li>
      <li>
        <span className="text-muted">Class :</span>{" "}
        {data?.Paper_Class?.PaperClass}
      </li>
      {/* <li>
        <span className="text-muted">Price :</span> $300/ream
      </li> */}
      <li>
        <span className="text-muted">Measurement Unit</span>
        {data?.Measurement_Unit?.MeasurementUnit}
      </li>
      <li>
        <span className="text-muted">Group :</span>
        {data?.Product_Group?.ProductGroup}
      </li>
      <li>
        <span className="text-muted">Sub Group :</span>
        {data?.Product_Subgroup?.ProductSubgroup}
      </li>
    </ul>
  );
}

export default ProductData;
