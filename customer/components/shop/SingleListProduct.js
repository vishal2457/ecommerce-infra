import React, { useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import {
  getCustomerPricing,
  ResourceApiUrl,
  getMinQtyMsg,
  checkMinQty,
  UOM_TYPES,
  dateFormatter,
  showAlert,
} from "../../utility/commonUtility";
import Pricing from "../Shared/Pricing";
import Image from "../image/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import dynamic from "next/dynamic";
import DefaultPricing from "../Shared/DefaultPricing";
import ShopPricing from "./ShopPricing";
import PackageTypes from "../Shared/PackageTypes";
import { BiQuestionMark } from "react-icons/bi";
import CustomTooltip from "../Shared/Tooltip";
import { Input } from "../UI";
import Conditional from "../Shared/Conditional";

const Carousal = dynamic(() => import("../Shared/Carousal"));
const Overlay = dynamic(() => import("../Shared/Overlay"));
const ProductData = dynamic(() => import("../Shared/productData"));
function SingleListProduct({
  product,
  authentication,
  globalQuantity,
  handleAddClick,
  clearAllQty,
  resetClearQty,
  groupArr,
  addProductLoader,
  handleAddInquiry,
  getItem,
}) {
  console.log(product, "this is product");
  let CustomersPricing = React.useMemo(() => {
    return getCustomerPricing(product.Pricings, groupArr);
  }, [groupArr]);

  const [singleProduct, setsingleProduct] = React.useState({
    [product?.ID]: CustomersPricing[0]?.PricingUnit,
  });
  const [qtyStyle, setqtyStyle] = React.useState({ fontSize: "0.7rem" });
  const [active, setactive] = React.useState(product?.Pricings[0]?.ProductUom);
  const [defaultPrice, setdefaultPrice] = useState("");
  const [pricing, setpricing] = useState("");
  const [addToCartAttempt, setaddToCartAttempt] = useState(true);
  const [quantity, setquantity] = React.useState(
    CustomersPricing[0]?.PricingUnit
  );
  const [minQtyMsg, setminQtyMsg] = React.useState("");
  const [expDate, setexpDate] = useState(dateFormatter(new Date(), "getInIso"));

  React.useEffect(() => {
    setminQtyMsg(
      getMinQtyMsg({
        productUom: product?.Pricings[0]?.ProductUom,
        active,
        minQty: CustomersPricing[0]?.MinQty,
        pricingUnit: CustomersPricing[0]?.PricingUnit,
        packagingUnit:
          active == UOM_TYPES.ries
            ? CustomersPricing[0]?.PackagingUnitRies
            : active == UOM_TYPES.pallete
            ? CustomersPricing[0]?.PackagingUnitPallete
            : null,
      })
    );
    setqtyStyle({ fontSize: "0.7rem" });
  }, [active]);

  React.useEffect(() => {
    if (clearAllQty) {
      setsingleProduct({ [product?.ID]: "" });
    }

    return () => {};
  }, [clearAllQty]);

  const InCart = React.useMemo(() => {
    return getItem(product.ID);
  }, [product?.ID, addToCartAttempt]);

  //GETTING STOCK QUANTITY
  const getStockQuantity = () => {
    return product?.StockQuantity;
  };

  const checkMaxQuantity = () => {
    let { PricingUnit, PackagingUnitRies, PackagingUnitPallete } =
      CustomersPricing[0];
    let qty = singleProduct[product?.ID];
    if (active == UOM_TYPES.ries) {
      qty = PackagingUnitRies * singleProduct[product?.ID];
    } else if (active == UOM_TYPES.pallete) {
      qty = PackagingUnitPallete * singleProduct[product?.ID];
    }
    console.log(stockQuantity);
    console.log(qty <= stockQuantity);
    return qty <= stockQuantity;
  };

  //MEMOISED STOCK QUANTITY
  const stockQuantity = React.useMemo(() => {
    return getStockQuantity();
  }, [product]);

  //HANDLE QUANTITY CHANGE
  const handleQuantity = (e) => {
    resetClearQty();
    setsingleProduct({ ...singleProduct, [e.target.name]: e.target.value });
  };

  //DEFAULT PRICING
  const defaultPricing = React.useMemo(() => {
    return (
      <DefaultPricing
        product={product}
        authentication={authentication}
        active={active}
        globalQuantity={globalQuantity}
        inputQuantity={parseInt(singleProduct[product.ID])}
        defaultQuantity={product.Pricings[0]?.PricingUnit}
        setdefaultPrice={setdefaultPrice}
        groupArr={groupArr}
        CustomersPricing={CustomersPricing}
      />
    );
  }, [active, singleProduct[product.ID]]);

  //PRICING FOR PRODUCTS THAT HAS A UOM OF ROLLS
  const PRODUCT_PRICING = React.useMemo(() => {
    return (
      <>
        {product?.Pricings[0]?.rollType == "kg" ? (
          <Pricing
            pricingArr={product.Pricings}
            globalQuantity={globalQuantity}
            inputQuantity={parseInt(singleProduct[product.ID])}
            defaultQuantity={product.Pricings[0]?.PricingUnit}
            authentication={authentication}
            groupArr={groupArr}
            setpricing={setpricing}
            CustomersPricing={CustomersPricing}
          />
        ) : (
          <ShopPricing
            pricingArr={product.Pricings}
            globalQuantity={globalQuantity}
            inputQuantity={parseInt(singleProduct[product.ID])}
            defaultQuantity={product.Pricings[0]?.PricingUnit}
            uomType={active}
            authentication={authentication}
            groupArr={groupArr}
            CustomersPricing={CustomersPricing}
            setpricing={setpricing}
          />
        )}
      </>
    );
  }, [active, globalQuantity, singleProduct[product.ID]]);

  const checkQuantity = (e) => {
    // get boolean from common method checkMinQty()
    if (!checkMaxQuantity()) {
      return showAlert(
        `You can add upto ${stockQuantity} ${product?.Measurement_Unit?.MeasurementUnit}-info`
      );
    }
    if (
      !checkMinQty({
        active,
        qty: singleProduct[product?.ID],
        minQty: CustomersPricing[0]?.MinQty,
        pricingUnit: CustomersPricing[0]?.PricingUnit,
        packagingUnit:
          active == UOM_TYPES.ries
            ? CustomersPricing[0]?.PackagingUnitRies
            : active == UOM_TYPES.pallete
            ? CustomersPricing[0]?.PackagingUnitPallete
            : null,
      })
    ) {
      setqtyStyle({ fontSize: "0.8rem", fontWeight: "Bold" });
      return false;
    }
    setaddToCartAttempt((previousState) => !previousState);
    handleAddClick(e, {
      product,
      defaultPricing: defaultPrice,
      Quantity: singleProduct[product?.ID],
      BuyIn: active,
      Price: pricing,
      Pricings: CustomersPricing[0],
    });
  };

  //CART BUTTON
  const ShopButton = () => {
    return (
      <CustomTooltip renderComponent={<p>Add To Cart</p>}>
        <button
          className="btn btn-sm btn-outline-dark mr-1 px-2"
          disabled={
            !singleProduct[product.ID] ||
            singleProduct[product.ID] <= 0 ||
            addProductLoader
          }
          onClick={(e) => checkQuantity(e)}
        >
          <AiOutlineShoppingCart size={18} />
        </button>
      </CustomTooltip>
    );
  };

  //QUICK INQUIRY FORM
  const QuickInquiryForm = () => {
    return (
      <div>
        <h5>{product?.ProductName}</h5>
        <div className="my-2 d-flex justify-content-between">
          <p className="mb-0">Unit</p>
          <p className="mb-0">
            {product?.Pricings[0]?.ProductUom == UOM_TYPES.rolls &&
            active == UOM_TYPES.pallete
              ? "Carton"
              : active}{" "}
          </p>
        </div>
        <div className="my-2 d-flex justify-content-between">
          <p className="mb-0">Quantity</p>
          <p className="mb-0">{singleProduct[product?.ID]}</p>
        </div>
        <div className="my-2">
          <p className="mb-0">Expected Delivery Date</p>
          <Input
            type="date"
            value={expDate}
            onChange={(e) => setexpDate(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline-dark btn-sm mt-2 btn-block"
          onClick={(e) =>
            handleAddInquiry(e, product, {
              PackageType: {
                [product?.ID]:
                  product?.Pricings[0]?.ProductUom == UOM_TYPES.rolls &&
                  active == UOM_TYPES.pallete
                    ? "Carton"
                    : active,
              },
              Quantity: { [product?.ID]: singleProduct[product?.ID] },
              ExpectedDate: { [product?.ID]: expDate },
            })
          }
        >
          Add Inquiry
        </button>
      </div>
    );
  };

  //INQUIRY BUTTON
  const InquireButton = () => {
    return (
      <Overlay
        component={<QuickInquiryForm />}
        heading={`Make an inquiry to ${product.Supplier.SupplierName}`}
        trigger={`click`}
        position={`top`}
      >
        {/* <CustomTooltip renderComponent={<p>Place an inquiry</p>}> */}

        <button
          className="btn btn-sm btn-outline-dark mr-1 px-2"
          disabled={
            !singleProduct[product.ID] ||
            singleProduct[product.ID] <= 0 ||
            addProductLoader
          }
          // onClick={}
        >
          <BiQuestionMark size={18} />
        </button>
        {/* </CustomTooltip > */}
      </Overlay>
    );
  };
  return (
    <tr>
      {/* Name */}
      <td style={{ fontSize: "0.7rem" }}>
        <Link href={`/Product?id=${product?.ID}`}>
          <span className="pointer">
            {product?.ProductName}&nbsp;
            <Overlay
              heading={product?.ProductName}
              component={<ProductData data={product} />}
            />
          </span>
        </Link>
      </td>
      {/* Group */}
      <td>{product?.Product_Group?.ProductGroup}</td>
      {/* Sub-group */}
      <td>{product?.Product_Subgroup?.ProductSubgroup}</td>
      {/* printability */}
      {/* Gsm */}
      <td>{product?.Paper_Gsm?.PaperGsm}</td>
      {/* Quality */}
      {/* <td>asdasd</td> */}
      {/* price/unit */}
      <td>{defaultPricing}</td>

      {/* Type */}
      <td>
        {" "}
        <PackageTypes
          active={active}
          setactive={setactive}
          pricingObj={CustomersPricing[0]}
          setquantity={setquantity}
        />
      </td>
      {/* type */}
      <td>
        <input
          type="number"
          placeholder="Qty"
          min="1"
          onChange={handleQuantity}
          name={product.ID}
          value={singleProduct[product?.ID]}
          className="form-control form-control-sm productQty"
        />
      </td>
      {/* Amount */}
      <td>{PRODUCT_PRICING}</td>
      {/* action */}
      <td className="d-flex">
        {stockQuantity ? <ShopButton /> : null}
      <InquireButton />
       
      </td>
    </tr>
  );
}

export default SingleListProduct;
