import React, { useContext, useState } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import dynamic from "next/dynamic";

import {
  ResourceApiUrl,
  getMinQtyMsg,
  checkMinQty,
  UOM_TYPES,
  dateFormatter,
  showAlert,
  PRICE_EXCULSIVE_MESSAGE,
} from "../../utility/commonUtility";
// import { AiOutlineShoppingCart } from "react-icons/ai";
import { Input, ReactSelectDropdown } from "../UI";
import ContentLoader from "react-content-loader";
import { useCart } from "../../contexts/cart/user-cart";
import Pricing from "../Shared/Pricing";
import ShopPricing from "../shop/ShopPricing";
import DefaultPricing from "../Shared/DefaultPricing";
import Carousal from "../Shared/Carousal";
import PackageTypes from "../Shared/PackageTypes";
import Breadcrumb from "../Shared/Breadcrumb";
import CustomTooltip from "../Shared/Tooltip";
// import { BiQuestionMark } from "react-icons/bi";
import { useInquiry } from "../../contexts/Inquiry/user-inquiry";
import { AuthContext } from "../../contexts/auth/auth.context";
import { useRouter } from "next/router";
const Overlay = dynamic(() => import("../Shared/Overlay"));

export const TopInfo = ({
  product,
  dropDownValues,
  onPropertyChange,
  loading,
  tempProduct,
  noProduct,
  authentication,
  CustomersPricing,
  routerData,
}) => {
  const { authState } = useContext(AuthContext);
  const { addItem } = useCart();
  const inquiryMethods = useInquiry();
  const router = useRouter();
  const notify = React.useCallback(({ type, message, image, ID, Toast }) => {
    Toast({ type, message, image, ID });
  }, []);

  const [qtyStyle, setqtyStyle] = React.useState({ fontSize: "0.7rem" });
  const [expDate, setexpDate] = useState(dateFormatter(new Date(), "getInIso"));

  const [singleProduct, setsingleProduct] = React.useState({
    [product?.ID]: CustomersPricing?.[0]?.PricingUnit,
  });
  const [active, setactive] = React.useState(CustomersPricing?.[0]?.ProductUom);
  const [defaultPrice, setdefaultPrice] = React.useState("");
  const [pricing, setpricing] = React.useState("");
  const [quantity, setquantity] = React.useState(
    CustomersPricing?.[0]?.PricingUnit
  );
  const [addProductLoader, setaddProductLoader] = useState(false);

  const [minQtyMsg, setminQtyMsg] = React.useState("");

  const properties = {
    PaperClass: { name: "PaperClassID", disable: false },
    PaperQuality: { name: "PaperQualityID", disable: false },
    PaperPrintibility: { name: "PaperPrintibilityID", disable: false },
    PaperColor: { name: "ColorID", disable: false },
    MeasurementUnit: { name: "UomID", disable: false },
    PaperGrain: { name: "GrainID", disable: false },
    PaperGsm: { name: "GsmID" },
  };

  React.useEffect(() => {
    if (routerData) {
      setsingleProduct({ [product?.ID]: routerData?.qty });
      setactive(routerData?.type);
      setquantity(routerData?.qty);
    } else {
      setsingleProduct({ [product?.ID]: CustomersPricing?.[0]?.PricingUnit });
      setactive(CustomersPricing?.[0]?.ProductUom);
      setquantity(CustomersPricing?.[0]?.PricingUnit);
    }
  }, [product?.ID, routerData]);

  React.useEffect(() => {
    setqtyStyle({ fontSize: "0.7rem" });
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
  }, [active]);

  const handleQuantity = (e, ID) => {
    setsingleProduct({ ...singleProduct, [e.target.name]: e.target.value });
  };

  const getStockQuantity = () => {
    return product?.StockQuantity;
  };

  const stockQuantity = React.useMemo(() => {
    return getStockQuantity();
  });

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

  const addToCart = async (e) => {
    if (singleProduct[product?.ID] <= 0) return;
    if (!checkMaxQuantity()) {
      return showAlert(
        `You can add upto ${stockQuantity} ${product?.Measurement_Unit?.MeasurementUnit}-info`
      );
    }
    setaddProductLoader(true);
    // get boolean from common method checkMinQty()
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
      setaddProductLoader(false);
      return false;
    }

    //CHECK LOGIN OR NOT
    if (!authState?.isAuthenticated) {
      return router.push({
        pathname: "/Auth",
        query: { type: "Login" },
      });
    }

    e.stopPropagation();
    const Toast = (await import("../../components/Toast")).default;
    notify({
      type: "cart",
      message: `${product?.ProductName}, 
      ${routerData ? "Updated to cart" : "Added to cart"}`,
      image: `${ResourceApiUrl}${product?.Product_Images[0]?.Image}`,
      ID: product.ID,
      Toast,
    });
    let obj = {
      product,
      defaultPricing: defaultPrice,
      Quantity: singleProduct[product?.ID],
      BuyIn: active,
      Price: pricing,
      Pricings: CustomersPricing[0],
      ExpectedDeliveryDate: routerData?.ExpectedDeliveryDate || null,
      cartBuyIn: routerData?.type,
      key: routerData ? "update" : "add",
    };

    //console.log(obj);
    addItem({
      ...obj,
    });
    setaddProductLoader(false);
  };

  /**
   * @add_item_to_inquiry
   * @param {Object} e event
   * @param {Object} product data
   * @param {Object} inputs QTY, Unit, Expected Date
   */
  const handleAddInquiry = async (e, product, inputs) => {
    //console.log(inputs);
    //if (obj?.Quantity <= 0) return;
    setaddProductLoader(true);
    e.stopPropagation();

    const Toast = (await import("../../components/Toast")).default;
    notify({
      type: "cart",
      message: `${product?.ProductName}, 
      Added to inquiry`,
      image: `${ResourceApiUrl}${product?.Product_Images[0]?.Image}`,
      ID: product.ID,
      Toast,
    });
    // call inquiry addItem() method
    await inquiryMethods?.addItem(product, inputs);
    setaddProductLoader(false);
  };

  //CART BUTTON
  const ShopButton = () => {
    return (
      <CustomTooltip
        position="bottom"
        renderComponent={
          <p>{routerData ? "Update Cart Item" : "Add To Cart"}</p>
        }
      >
        <button
          className="btn btn-sm btn-dark"
          disabled={
            !singleProduct[product.ID] ||
            singleProduct[product.ID] <= 0 ||
            addProductLoader
          }
          onClick={(e) => addToCart(e)}
        >
          {/* <AiOutlineShoppingCart size={18} /> */}
          {routerData ? "Update Cart Item" : "Add To Cart"}
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
        <button
          className="btn btn-sm btn-dark ml-2"
          disabled={
            !singleProduct[product.ID] ||
            singleProduct[product.ID] <= 0 ||
            addProductLoader
          }
        >
          {/* <BiQuestionMark size={18} /> */}
          Inquiry
        </button>
      </Overlay>
    );
  };

  return (
    <Fragment>
      {noProduct ? (
        <div class="alert alert-danger" role="alert">
          No Product with this specification
        </div>
      ) : null}

      <div className="row my-5">
        {loading ? (
          <ContentLoader viewBox="0 0 800 400" height={400} width={800}>
            <circle cx="472" cy="159" r="7" />
            <rect x="487" y="154" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="190" r="7" />
            <rect x="487" y="184" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="219" r="7" />
            <rect x="487" y="214" rx="5" ry="5" width="220" height="10" />
            <circle cx="472" cy="249" r="7" />
            <rect x="487" y="244" rx="5" ry="5" width="220" height="10" />
            <rect x="64" y="18" rx="0" ry="0" width="346" height="300" />
            <rect x="229" y="300" rx="0" ry="0" width="0" height="0" />
            <rect x="111" y="340" rx="0" ry="0" width="0" height="0" />
            <rect x="121" y="342" rx="0" ry="0" width="0" height="0" />
            <rect x="10" y="20" rx="0" ry="0" width="40" height="44" />
            <rect x="10" y="80" rx="0" ry="0" width="40" height="44" />
            <rect x="10" y="140" rx="0" ry="0" width="40" height="44" />
            <rect x="194" y="329" rx="0" ry="0" width="0" height="0" />
            <rect x="192" y="323" rx="0" ry="0" width="0" height="0" />
            <rect x="185" y="323" rx="0" ry="0" width="0" height="0" />
            <rect x="10" y="200" rx="0" ry="0" width="40" height="44" />
            <rect x="470" y="18" rx="0" ry="0" width="300" height="25" />
            <rect x="470" y="58" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="68" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="78" rx="0" ry="0" width="300" height="6" />
            <rect x="798" y="135" rx="0" ry="0" width="0" height="0" />
            <rect x="731" y="132" rx="0" ry="0" width="0" height="0" />
            <rect x="470" y="99" rx="0" ry="0" width="70" height="30" />
            <rect x="560" y="99" rx="0" ry="0" width="70" height="30" />
          </ContentLoader>
        ) : (
          <Fragment>
            <div className="col-md-8 text-center">
              <div className="d-flex">
                <Breadcrumb
                  breadCrumbs={[
                    { name: "Home", link: "/" },
                    {
                      name: ` ${routerData ? "Cart" : "Shop"}`,
                      link: ` ${routerData ? "/Cart" : "/Shop"}`,
                    },
                    { name: product?.ProductName, link: "#" },
                  ]}
                />
              </div>
            </div>

            <div className="col-md-8 text-center">
              <div className="pt-3">
                {noProduct ? (
                  <Carousal arr={[]} />
                ) : (
                  <Carousal arr={product?.Product_Images} />
                )}
              </div>
            </div>
            <div className="col-md-4">
              {/* <div className="row">
                {Object.keys(dropDownValues).map((obj, index) => {
                  return (
                    <div className="col-md-6 p-1">
                      <ReactSelectDropdown
                        arr={dropDownValues[obj]}
                        bindValue="ID"
                        bindName={obj}
                        name={tempProduct[properties[obj].name]}
                        value={tempProduct[properties[obj].name]}
                        disabled={properties[obj]?.disable}
                        onChange={(value, action) =>
                          onPropertyChange(
                            value,
                            action,
                            properties[Object.keys(dropDownValues)[index]]?.name
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div> */}
              <div className="row">
                <div className="col-md-12">
                  <h2>{noProduct ? "..." : `${product?.ProductName}`}</h2>
                </div>
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    paper class :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct ? "..." : product?.Paper_Class?.PaperClass}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    paper quality :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct ? "..." : product?.Paper_Quality?.PaperQuality}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    paper printability :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct
                      ? "..."
                      : product?.Paper_Printibility?.PaperPrintibility}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    paper color :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct ? "..." : product?.Paper_Color?.PaperColor}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    Measurement Unit :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct
                      ? "..."
                      : product?.Measurement_Unit?.MeasurementUnit}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    Paper Grain :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct ? "..." : product?.Paper_Grain?.PaperGrain}
                  </small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 color_black">
                  <small className="text-uppercase font-weight-bold">
                    Paper GSM :{" "}
                  </small>
                  <small>
                    {" "}
                    {noProduct ? "..." : product?.Paper_Gsm?.PaperGsm}
                  </small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="text-uppercase color_black">
                      <small className="font-weight-bold">Verfugbar</small>
                    </div>
                    <div className="pl-3">
                      <div className="dots pt-1">
                        <div
                          className={`green-dot ${
                            stockQuantity > 100 ? "dot-active" : ""
                          }`}
                        ></div>
                        {/* <div className={`gray-dot  ${stockQuantity < 100 && stockQuantity > 0 ? 'dot-active' : ''}`}></div> */}
                        <div
                          className={`red-dot  ${
                            !stockQuantity ? "dot-active" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 color_black">
                  <small className="font-weight-bold">ARTIKELNUMMER : </small>
                  <small> {noProduct ? "..." : product?.ProductNo}</small>
                </div>

                <div className="col-md-6 color_black">
                  <small className="font-weight-bold">SUPPLIER : </small>
                  <span>
                    {noProduct ? "..." : product?.Supplier?.SupplierName}
                  </span>
                </div>
                <div className="col-md-12 color_black">
                  <small className="font-weight-bold">GROUP : </small>
                  <span>
                    {noProduct ? "..." : product?.Product_Group?.ProductGroup}
                  </span>
                </div>
                <div className="col-md-12 color_black">
                  <small className="font-weight-bold">SUB-GROUP : </small>
                  <span>
                    {noProduct
                      ? "..."
                      : product?.Product_Subgroup?.ProductSubgroup}
                  </span>
                </div>
                <div className="col-md-6 color_black">
                  <small className="font-weight-bold">WIDTH : </small>

                  <span>{noProduct ? "..." : product?.Width}</span>
                </div>
                {product?.Height ? (
                  <div className="col-md-6 color_black">
                    <small className="font-weight-bold">LENGTH : </small>

                    <span>{noProduct ? "..." : product?.Height}</span>
                  </div>
                ) : null}
                <div className="col-md-12 color_black">
                  <small className="font-weight-bold">WEIGHT : </small>
                  <span>{noProduct ? "..." : product?.Weight}</span>
                </div>
                <div className="col-md-12 color_black">
                  <small className="font-weight-bold">PRICE : </small>
                  {noProduct ? (
                    <p>...</p>
                  ) : (
                    <DefaultPricing
                      product={product}
                      authentication={authentication}
                      active={active}
                      inputQuantity={parseInt(singleProduct[product.ID])}
                      defaultQuantity={product.Pricings[0]?.PricingUnit}
                      setdefaultPrice={setdefaultPrice}
                      CustomersPricing={CustomersPricing}
                    />
                  )}
                </div>
                <div className="col-md-12 col-sm-12 px-1 color_black">
                  <PackageTypes
                    active={active}
                    setactive={setactive}
                    pricingObj={CustomersPricing?.[0]}
                    setquantity={setquantity}
                  />
                </div>

                <div className="col-md-6 px-1 mt-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    onChange={handleQuantity}
                    name={product.ID}
                    value={singleProduct[product?.ID]}
                    className="form-control form-control-sm rounded-border"
                  />
                  <div className="text-danger mt-2" style={qtyStyle}>
                    {PRICE_EXCULSIVE_MESSAGE}
                  </div>

                  <div className="text-danger mt-2" style={qtyStyle}>
                    {minQtyMsg}
                  </div>

                  {/* <div className="mt-2 pb-5">
                    <small className="font-weight-bold">
                      EXPECTED DELIVERY DATE :
                    </small>
                    <span>
                      <Input
                        type="date"
                        className={`dateInput`}
                        name={product?.ID}
                        // value={
                        //   inputData?.expDate?.["unit"] == item?.BuyIn
                        //     ? inputData?.expDate?.[item?.ID]
                        //     : item?.ExpectedDeliveryDate
                        //     ? dateFormatter(item?.ExpectedDeliveryDate, "getInIso")
                        //     : null
                        // }
                        // onChange={(e) => onChangeExpectedDate(e, item)}
                      />
                    </span>
                  </div> */}
                </div>

                <div className="col-md-6 productPriceInTopInfo mt-2">
                  <span>
                    {product?.Pricings[0]?.rollType == "kg" ? (
                      <Pricing
                        pricingArr={product.Pricings}
                        inputQuantity={parseInt(singleProduct[product.ID])}
                        defaultQuantity={product.Pricings[0]?.PricingUnit}
                        authentication={authentication}
                        setpricing={setpricing}
                        groupArr={customerGroups}
                        CustomersPricing={CustomersPricing}
                      />
                    ) : (
                      <ShopPricing
                        pricingArr={product.Pricings}
                        inputQuantity={parseInt(singleProduct[product.ID])}
                        defaultQuantity={product.Pricings[0]?.PricingUnit}
                        uomType={active}
                        authentication={authentication}
                        setpricing={setpricing}
                        CustomersPricing={CustomersPricing}
                      />
                    )}
                  </span>
                </div>
                {stockQuantity ? <ShopButton /> : null}
                <InquireButton />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TopInfo);
