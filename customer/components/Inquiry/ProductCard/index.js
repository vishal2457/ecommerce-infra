import React from "react";
import { Fragment } from "react";
import { Accordion } from "react-bootstrap";
import {
  ResourceApiUrl,
  getCustomerPricing,
} from "../../../utility/commonUtility";
import Image from "../../image/image";
import DefaultPricing from "../../Shared/DefaultPricing";
import Overlay from "../../Shared/Overlay";
import ProductData from "../../Shared/productData";
import PackageTypeDropdown from "./PackageTypeDropdown";

function ProductCard({
  index,
  data,
  selectItems,
  inputData,
  handleInputs,
  groupArr,
}) {
  let CustomersPricing = React.useMemo(() => {
    return getCustomerPricing(data?.Pricings, groupArr);
  }, [groupArr]);

  const [options, setoptions] = React.useState([
    { uom: CustomersPricing[0]?.ProductUom },
  ]);

  React.useEffect(() => {

    let tempArr = options;
    if (CustomersPricing[0]?.ProductUom == "Sheets") {
      tempArr.push({ uom: "Ries" }, { uom: "Pallete" });
    }
    // if (CustomersPricing[0]?.ProductUom != "kg") {
    //   tempArr.push({ uom: "Pallete" });
    // }

    if (CustomersPricing[0]?.ProductUom == "Rolls") {
      tempArr.push({ uom: "Carton" });
    }

    if (CustomersPricing[0]?.ProductUom == "Kg") {
      tempArr.push({ uom: "Rolls" });
    }

    setoptions(tempArr);
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <tr>
        <td className="text-center">
          <Accordion.Toggle
            eventKey={`product${index}`}
            className="details_toggle"
          >
            <i className="fa fa-chevron-down" />
          </Accordion.Toggle>
        </td>
        <td className="product_img">
          <Image
            className="table_product_img"
            src={`${ResourceApiUrl}${data?.Product_Images[0]?.Image}`}
            alt="Card image cap"
          />
        </td>
        <td className="product_detail">
          {data?.ProductName} &nbsp;
          <Overlay
            heading={data?.ProductName}
            component={<ProductData data={data} />}
          />
          <div className="supply_by">
            Supplier: {data?.Supplier?.SupplierName}
          </div>
        </td>
        <td className="actions">
          <input
            type="number"
            name={data.ID}
            className="form-control form-control-sm productQty rounded-border"
            placeholder="Qty"
            value={inputData?.Quantity?.[data.ID] || ""}
            onChange={handleInputs?.quantity}
          />
        </td>

        <td className="w-50">
          <PackageTypeDropdown
            options={options}
            value={inputData?.PackageType?.[data.ID]}
            handlePackageType={handleInputs?.packageType}
            name={data.ID}
          />
        </td>
        <td className="text-center">
          <input
            type="date"
            className="form-control"
            name={data.ID}
            value={inputData?.ExpectedDate?.[data.ID] || ""}
            onChange={handleInputs?.expectedData}
          />
        </td>
        <td className="action">
          <button className="btn btn-icon" onClick={() => selectItems(data)}>
            <i class="fa fa-plus"></i>
          </button>
        </td>
      </tr>
      <tr className="details_toggle_collapse">
        <td></td>
        <td colSpan="5">
          <Accordion.Collapse eventKey={`product${index}`}>
            <div>
              <DefaultPricing
                product={data}
                quantity={data?.Pricings[0]?.PricingUnit}
                active={data?.Pricings[0]?.ProductUom}
                authentication={false}
                inInquiry
                CustomersPricing={CustomersPricing}
              />
              <br />
              {data?.Pricings[0]?.ProductUom == "Sheets" ? (
                <Fragment>
                  <DefaultPricing
                    product={data}
                    quantity={data?.Pricings[0]?.PackagingUnitRies}
                    active={"Ries"}
                    authentication={false}
                    inInquiry
                    CustomersPricing={CustomersPricing}
                  />{" "}
                  {`( ${data?.Pricings[0]?.PackagingUnitRies} ${data?.Pricings[0]?.ProductUom} / Ries)`}
                  <br />
                </Fragment>
              ) : null}

              {data?.Pricings[0]?.rollType != "kg" ? (
                <Fragment>
                  <DefaultPricing
                    product={data}
                    quantity={data?.Pricings[0]?.PackagingUnitPallete}
                    active={"Pallete"}
                    authentication={false}
                    inInquiry
                    CustomersPricing={CustomersPricing}
                  />{" "}
                  {`( ${data?.Pricings[0]?.PackagingUnitPallete} ${data?.Pricings[0]?.ProductUom} / Pallete)`}
                </Fragment>
              ) : null}
            </div>
          </Accordion.Collapse>
        </td>
      </tr>
    </React.Fragment>
  );
}

export default ProductCard;
