import React, { useState } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import {
  getCustomerPricing,
  dateFormatter,
  ResourceApiUrl,
  getMinQty,
  UOM_TYPES,
  calculatePrice,
  calculatePriceForSheets,
} from "../../utility/commonUtility";
import Image from "../image/image";
import ProductData from "../Shared/productData";
import dynamic from "next/dynamic";
import { Input } from "../UI";
import Pricing from "../Shared/Pricing";
import ShopPricing from "../shop/ShopPricing";
import { useRouter } from "next/router";

const Overlay = dynamic(() => import("../Shared/Overlay"));
const SupplierDetails = dynamic(() => import("../Shared/SupplierDetails"));

export const ProductCard = ({
  item,
  removeItem,
  onChangeExpectedDate,
  authentication,
  inputData,
  groupArr,
  onBlurQuantity,
}) => {
  //object to send product details
  const routerObj = {
    // id: item?.ID,
    type: item?.BuyIn,
    qty: item?.quantity,
    ExpectedDeliveryDate: item?.ExpectedDeliveryDate,
    // defPrice: item?.defaultPricing,
  };
  const router = useRouter();

  let [moreInfo1, setMoreInfo1] = React.useState(false);

  const [pricing, setpricing] = useState("");

  let { ProductName, Supplier, Paper_Gsm, Height, Width, Pricings } = item;

  let CustomersPricing = React.useMemo(() => {
    return getCustomerPricing([item.Pricings], groupArr);
  }, [groupArr]);

  let localMinQty = React.useMemo(() => {
    return getMinQty({
      active: item?.BuyIn,
      minQty: CustomersPricing[0]?.MinQty,
      packagingUnit:
        item?.BuyIn == UOM_TYPES.ries
          ? CustomersPricing[0]?.PackagingUnitRies
          : item?.BuyIn == UOM_TYPES.pallete
          ? CustomersPricing[0]?.PackagingUnitPallete
          : null,
    });
  }, [item]);

  //PRICING FOR PRODUCTS THAT HAS A UOM OF ROLLS
  const PRODUCT_PRICING = React.useMemo(() => {
    return (
      <>
        {item?.Pricings?.rollType == "kg" ? (
          <Pricing
            pricingArr={[item.Pricings]}
            inputQuantity={parseInt(item?.quantity)}
            defaultQuantity={item.Pricings[0]?.PricingUnit}
            authentication={authentication}
            groupArr={groupArr}
            setpricing={setpricing}
            CustomersPricing={CustomersPricing}
          />
        ) : (
          <ShopPricing
            pricingArr={[item.Pricings]}
            inputQuantity={parseInt(item?.quantity)}
            defaultQuantity={item.Pricings[0]?.PricingUnit}
            uomType={item?.BuyIn}
            authentication={authentication}
            groupArr={groupArr}
            setpricing={setpricing}
            CustomersPricing={CustomersPricing}
          />
        )}
      </>
    );
  }, [item?.quantity]);
  // React.useEffect(() => {
  //   console.log("ProductCart....  pricing ===== ", pricing);
  // }, [item?.qty?.[item?.ID]]);

  return (
    <Fragment>
      <tr>
        <td></td>
        <td className="product_img">
          <Image
            className="table_product_img"
            src={`${ResourceApiUrl}${item?.Product_Images[0]?.Image}`}
            alt="Card image cap"
          />
        </td>
        <td className="product_detail">
          {ProductName} &nbsp;
          <Overlay
            heading={item?.ProductName}
            component={<ProductData data={item} />}
          />
          <br />
          Size: {Height} x {Width}
          <br />
          Gsm: {Paper_Gsm?.PaperGsm}
          {Supplier ? (
            <>
              <br />
              Supplier: {Supplier?.SupplierName} &nbsp;
              <Overlay
                heading={Supplier?.SupplierName}
                component={<SupplierDetails data={Supplier} />}
              />
            </>
          ) : null}
          <br />
          <button
            className="btn btn-outline-secondary py-0 mt-2"
            onClick={() => setMoreInfo1(!moreInfo1)}
          >
            {moreInfo1 ? "Hide Terms" : "View Terms"}
          </button>
        </td>
        <td className="price">
          <ul>
            <li>{item?.defaultPricing}</li>
            {/* <li>Tax: €20.00</li> */}
          </ul>
        </td>
        {/* <td className="qty">
          <input
            className={"form-control form-control-sm rounded-border qty"}
            type="text"
            placeholder="Qty"
            name={item?.ID}
            value={
              inputData?.qty?.["unit"] == item?.BuyIn
                ? inputData?.qty?.[item?.ID]
                : item?.quantity
            }
            disabled={item?.QuotationID ? true : false}
            onBlur={(e) => onBlurQuantity(e, item, localMinQty)}
            onChange={(e) => onChangeQuantity(e, item, pricing)}
          />

          <small className="text-danger">
            {item?.QuotationID ? (
              ""
            ) : (
              <>
                Min. Qty. <b>{localMinQty}</b>
                {" " + item?.BuyIn}
              </>
            )}
          </small>
        </td> */}

        <td className="qty">
          {inputData?.qty?.["unit"] == item?.BuyIn
            ? inputData?.qty?.[item?.ID]
            : item?.quantity}
        </td>

        <td className="cart_unit">
          <p>
            {item?.Measurement_Unit?.MeasurementUnit == UOM_TYPES.rolls &&
            item?.BuyIn == UOM_TYPES.pallete
              ? "Carton"
              : item?.BuyIn}
          </p>
        </td>

        <td className="price">
          <p>{item?.QuotationID ? item?.Amount : PRODUCT_PRICING || 0}</p>
        </td>
        <td className="qty">
          {item?.expDelDate_display && (
            <>
              <small className="text-success">
                {dateFormatter(item?.expDelDate_display, "getInIso")} (In
                Inquiry)
              </small>
              <br />
              <br />
            </>
          )}

          <Input
            type="date"
            className={`dateInput`}
            name={item?.ID}
            value={
              inputData?.expDate?.["unit"] == item?.BuyIn
                ? inputData?.expDate?.[item?.ID]
                : item?.ExpectedDeliveryDate
                ? dateFormatter(item?.ExpectedDeliveryDate, "getInIso")
                : null
            }
            onChange={(e) => onChangeExpectedDate(e, item)}
          />
        </td>
        <td className="action">
          <button
            className="btn btn-info btn-icon py-1"
            style={{ color: "#fff" }}
            onClick={() =>
              router.push({
                pathname: "/Product",
                //query: { id: item?.ID, type: item?.BuyIn },
                query: { id: item?.ID, data: JSON.stringify(routerObj) },
              })
            }
            data-toggle="tooltip"
            data-placement="top"
            title={item?.QuotationID ? "Cannot EDIT Inquiry Item" : "EDIT"}
            disabled={item?.QuotationID ? true : false}
          >
            <i className="fa fa-pencil"></i>
          </button>
        </td>
        <td className="action">
          <button
            className="btn btn-danger btn-icon py-1"
            style={{ color: "#fff" }}
            onClick={() => removeItem(item)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>
      <tr className="termsRow">
        <td></td>
        <td></td>
        {moreInfo1 && (
          <td colSpan="6">
            <div className="product_detail">
              <span>
                <b>Payment Terms :</b> {item?.PaymentTerms}
              </span>
              <br />
              <span>
                <b>Delivery Terms :</b> {item?.DeliveryTerms}
              </span>
            </div>
          </td>
        )}
      </tr>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
