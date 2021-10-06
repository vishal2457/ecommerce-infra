import React, { Fragment, useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useRouter } from "next/router";
import { useCart } from "../contexts/cart/user-cart";
import dynamic from "next/dynamic";
import { AuthContext } from "../contexts/auth/auth.context";
import api from "../Redux/api";
import EmptyCart from "../components/Cart/EmptyCart";
import CustomBeadcrumb from "../components/Shared/Breadcrumb";
import { PRICE_EXCULSIVE_MESSAGE, showAlert } from "../utility/commonUtility";
import { BulletList } from "react-content-loader";

//import { checkMinQty, getMinQty, UOM_TYPES } from "../utility/commonUtility";

const ProductCard = dynamic(() =>
  import("../components/Cart/ProductCard").then((mod) => mod.ProductCard)
);
const CheckoutData = dynamic(() =>
  import("../components/Cart/CheckoutData").then((mod) => mod.CheckoutData)
);
const CouponCode = dynamic(() =>
  import("../components/Cart/CouponCode").then((mod) => mod.CouponCode)
);
const DesiredDate = dynamic(() =>
  import("../components/Cart/DesiredDate").then((mod) => mod.DesiredDate)
);
const Header = dynamic(() => import("../layout/Header"));
const Footer = dynamic(() => import("../layout/Footer"));

const StepTwo = dynamic(() =>
  import("../components/Cart/StepTwo/index").then((mod) => mod.StepTwo)
);
const StepThree = dynamic(() =>
  import("../components/Cart/StepThree").then((mod) => mod.StepThree)
);

export const Cart = () => {
  const router = useRouter();

  const {
    items,
    CartItemTotalPrice,
    removeItem,
    removeAllItems,
    checkItem,
    checkedItemsTotalPrice,
    addItem,
    addItemOnLogin,
  } = useCart();
  console.log(items, "this is items");
  const notify = React.useCallback(({ type, message, image, ID, Toast }) => {
    Toast({ type, message, image, ID });
  }, []);

  const [inputData, setinputData] = useState({
    qty: {},
    expDate: {},
  });
  const { authState } = useContext(AuthContext);
  const [activeTab, setactiveTab] = useState("stepOne");
  const [profile, setprofile] = useState(null);
  const [errorObject, seterrorObject] = useState(null);
  const [deliveryDate, setdeliveryDate] = useState(null);
  const [initialTimeout, setinitialTimeout] = useState(null);
  const [AddressArr, setAddressArr] = useState([]);
  const [selectedID, setselectedID] = useState([]);
  const [confirmOrderLoading, setconfirmOrderLoading] = useState(false);
  const [addressLoader, setaddressLoader] = useState(false);

  const [region, setregion] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [loading, setloading] = useState(false);
  const [loadingStepTwo, setloadingStepTwo] = useState(true);
  const [visitedTabs, setvisitedTabs] = useState({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  });
  const [groupArr, setgroupArr] = useState([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const getResult1 = async () => {
        await api.get("/cart/getCart").then((res) => {
          if (res?.data?.data) {
            for (let item of res?.data?.data) {
              let singleItem = JSON.parse(item.Info);

              addItemOnLogin(singleItem, singleItem.quantity, singleItem.buyin);
            }
          }
        });
      };
      getResult1();

      /**
       * @Get_Customer_Groups
       */
      const getResult2 = async () => {
        await api
          .get("/CustomerGroups/getAllGroupsForCustomer")
          .then((res) => {
            setgroupArr(res.data.data);
          })
          .catch((err) => {
            console.log(err, "get customer error");
            setgroupArr([]);
          });
        getResult2();
      };
    }

    return () => {};
  }, []);

  /**
   * @place_a_new_order
   */
  const confirmOrder = async () => {
    setconfirmOrderLoading(true);
    await api
      .post("/order/newOrder", {
        items: items,
        Total: CartItemTotalPrice(),
        AddressID: selectedID?.ID,
        CusExpectedDeliveryDate: deliveryDate,
      })
      .then(async (res) => {
        setconfirmOrderLoading(false);
        for (let item of items) {
          removeItem(item);
        }

        const swal = (await import("sweetalert2")).default;
        swal
          .fire({
            title: "Order Placed Successfully",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "Shop More",
          })
          .then((result) =>
            result.value ? router.push("/Shop") : router.push("/Cart")
          );
      })
      .catch((err) => {
        console.log(err);
        setconfirmOrderLoading(false);
      });
  };

  const getAllAdddress = () => {
    setaddressLoader(true);
    api
      .get("/address/getAll")
      .then((res) => {
        if (res?.data?.status) {
          setAddressArr(res?.data?.data);
          setselectedID(res?.data?.data[0]);
          setaddressLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setaddressLoader(false);
      });
  };

  const addressConflict = () => {
    let address = null;
    for (let item of items) {
      if (item.AddressID) {
        address = item.AddressID;
      }
    }
    if (!address) return true;
    return address == selectedID.ID;
  };

  /**
   * @validate_cart
   */
  const validateCart = () => {
    let inquiryID = null;
    let response = true;
    for (let item of items) {
      if (item.InquiryID && !inquiryID) {
        inquiryID = item.InquiryID;
      } else if (item.InquiryID && inquiryID) {
        if (item.InquiryID != inquiryID) {
          response = false;
        }
      }
    }
    return response;
  };

  /**
   *
   * @param {String} tab send the tab string you want to go to.
   * @returns changes active tab in the cart
   */
  const changeTab = (tab) => {
    if (!authState?.isAuthenticated) {
      return router.push({
        pathname: "/Auth",
        query: { type: "Login" },
      });
    }
    if (tab == "stepTwo") {
      if (!AddressArr.length) getAllAdddress();
      // if(!validateCart()) return showAlert(`not allowed-info`)
    }
    if (tab == "stepThree") {
      if (!addressConflict())
        return showAlert(
          `Address selected in the inquiry cannot be changed.-info`
        );
    }

    setactiveTab(tab);

    setvisitedTabs({ ...visitedTabs, [tab]: true });
  };

  const isProfileValid = () => {
    if (activeTab != "stepTwo") return;
    let tempArr = [
      "Address",
      "CustomerName",
      "Number",
      "ZipCode",
      "CountryID",
      "StateID",
      "CityID",
      "Email",
      "PaymentMethod",
    ];
    const {
      Address,
      CustomerName,
      Number,
      ZipCode,
      CountryID,
      StateID,
      CityID,
      Email,
      PaymentMethod,
    } = profile;
    if (
      !Address ||
      !CustomerName ||
      !Number ||
      !ZipCode ||
      !CountryID ||
      !StateID ||
      !CityID ||
      !Email ||
      !PaymentMethod
    ) {
      let obj = {};
      for (let field of Object.keys(profile)) {
        if (!profile[field] && tempArr.includes(field)) {
          obj[field] = `${field} cannot be empty`;
        }
      }
      seterrorObject(obj);
      return false;
    } else {
      seterrorObject(null);
      return true;
    }
  };

  const profileValid = React.useMemo(() => {
    return isProfileValid();
  }, [profile]);

  //add item on field change on step two
  const addItemLocal = (product, quantity, ExpectedDeliveryDate, pricing) => {
    // console.log("pricing ==== ", pricing);
    let obj = {
      product,
      defaultPricing: product?.defaultPricing,
      Quantity: quantity,
      BuyIn: product?.BuyIn,
      Price: pricing || product?.Price,
      ExpectedDeliveryDate,
    };
    clearTimeout(initialTimeout);
    let timeout = setTimeout(() => {
      addItem({
        ...obj,
        pricingArr: product?.Pricings,
      });
    }, 300);
    setinitialTimeout(timeout);
  };

  //handle change of quantity in stepone
  const onChangeQuantity = (e, item, pricing) => {
    console.log("pricing  === ", pricing);
    let enteredValue = e.target.value.replace(/\D/g, "");

    if (item) {
      setinputData({
        ...inputData,
        qty: {
          ...inputData.qty,
          [item?.ID]: enteredValue,
          unit: item?.BuyIn,
        },
      });
      return addItemLocal(
        item,
        enteredValue,
        item?.ExpectedDeliveryDate,
        pricing
      );
    }
  };

  const onBlurQuantity = (e, item, localMinQty) => {
    if (e.target.value < localMinQty) {
      setinputData({
        ...inputData,
        qty: {
          ...inputData.qty,
          [item?.ID]: localMinQty,
          unit: item?.BuyIn,
        },
      });
      return addItemLocal(item, localMinQty, item?.ExpectedDeliveryDate);
    }
  };

  const onChangeExpectedDate = (e, item) => {
    if (item) {
      setinputData({
        ...inputData,
        expDate: {
          ...inputData.expDate,
          [item?.ID]: e.target.value,
          unit: item?.BuyIn,
        },
      });

      return addItemLocal(item, item?.quantity, e.target.value);
    }
  };

/**
 * 
 * @param {*} storeInfo 
 * @places order
 */
  const placeOrder = (storeInfo) => {
    changeTab("stepThree");
    if (!profileValid) return;
    if (storeInfo) {
      setloading(true);
      api
        .post("/profile/editCustomerProfile", profile)
        .then(async (res) => {
          setloading(false);

          const Toast = (await import("../components/Toast")).default;
          notify({
            type: "success",
            message: "Address stored",
            ID: "Success",
            Toast,
          });
          changeTab("stepThree");
        })
        .catch(async (err) => {
          setloading(false);
          const Toast = (await import("../components/Toast")).default;
          notify({
            type: "error",
            message: "Something went wrong",
            ID: "error",
            Toast,
          });
        });
    }
  };

  return (
    <Fragment>
      <Header />
      <div className="container cart">
        <div className="row my-5">
          <div className="col-md-8 text-center">
            <div className="d-flex">
              <CustomBeadcrumb
                breadCrumbs={[
                  { name: "Home", link: "/" },
                  { name: "Shop", link: "/Shop" },
                  { name: "Cart", link: "#" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="steps_tab">
          <Tabs activeKey={activeTab} id="uncontrolled-tab-example">
            <Tab
              tabClassName="active"
              eventKey="stepOne"
              title={
                <Fragment>
                  <div onClick={() => changeTab("stepOne")}>
                    <i className="fa fa-checkmark-circle"></i>
                    <span>Warenkorb</span>
                  </div>
                </Fragment>
              }
            >
              {items?.length ? (
                <Fragment>
                  <div className="d-flex justify-content-between">
                    <h3>Warenkorb</h3>
                    <p className="text-danger pt-2">
                      {PRICE_EXCULSIVE_MESSAGE}
                    </p>
                  </div>

                  <div className="table">
                    <table className="table v-middle">
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th>PRODUKT</th>
                          <th className="text-center">PREIS</th>
                          <th className="text-center">ANZAHL</th>
                          <th className="text-center">UNIT</th>
                          <th className="text-center">TOTAL(&euro;)</th>
                          <th className="text-center">
                            EXPECTED DELIVERY DATE
                          </th>
                          <th className="text-center">EDIT</th>

                          <th className="text-center">
                            {items && items?.length > 0 ? (
                              <button
                                className="btn btn-secondary btn-icon p-1"
                                onClick={() => {
                                  showAlert(
                                    `Want to Clear Cart?-confirmation`,
                                    "Yes"
                                  ).then((result) => {
                                    if (!result.isConfirmed) return false;

                                    removeAllItems(items);
                                  });
                                }}
                              >
                                Clear All
                              </button>
                            ) : null}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items &&
                          items?.map((item, index) => {
                            return (
                              <ProductCard
                                key={index}
                                item={item}
                                removeItem={removeItem}
                                checkItem={checkItem}
                                onChangeQuantity={onChangeQuantity}
                                onChangeExpectedDate={onChangeExpectedDate}
                                authentication={authState.isAuthenticated}
                                inputData={inputData}
                                groupArr={groupArr}
                                onBlurQuantity={onBlurQuantity}
                              />
                            );
                          })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="text-right">TOTAL</th>
                          <th className="text-center"></th>
                          <th className="text-center"></th>
                          <th className="text-right">
                            €&nbsp;{CartItemTotalPrice()}
                            {/* € 23.0 */}
                          </th>
                          <th></th>
                          <th></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="row bottom_section_cart">
                    <div className="col-md-6 cart-widget">
                      <CouponCode />
                    </div>
                    <div className="col-md-6 cartlist-widget">
                      <CheckoutData
                        calculatePrice={CartItemTotalPrice}
                        changeTab={changeTab}
                        items={items}
                        authState={authState?.isAuthenticated}
                        deliveryDate={deliveryDate}
                      />
                    </div>
                    <div className="col-md-6 cart-widget">
                      {/* <DesiredDate
                        handleDateChange={(e) =>
                          setdeliveryDate(e.target.value)
                        }
                      /> */}
                    </div>
                    {/* <div className="col-md-6"></div> */}
                  </div>
                </Fragment>
              ) : (
                <EmptyCart />
              )}
            </Tab>
            <Tab
              eventKey="stepTwo"
              tabClassName={visitedTabs.stepTwo && items.length ? "active" : ""}
              title={
                <Fragment>
                  <div
                    onClick={() =>
                      changeTab(
                        visitedTabs.stepTwo && items.length
                          ? "stepTwo"
                          : "stepOne"
                      )
                    }
                  >
                    <i className="fa fa-checkmark-circle"></i>
                    <span>VERSAND</span>
                  </div>
                </Fragment>
              }
            >
              {addressLoader ? (
                <BulletList />
              ) : (
                <StepTwo
                  placeOrder={placeOrder}
                  loading={loading}
                  loadingStepTwo={loadingStepTwo}
                  items={items}
                  profile={profile}
                  region={region}
                  checkedItemsTotalPrice={checkedItemsTotalPrice}
                  errorObject={errorObject}
                  AddressArr={AddressArr}
                  selectedID={selectedID}
                  setselectedID={setselectedID}
                  getAllAdddress={getAllAdddress}
                  CartTotal={CartItemTotalPrice()}
                />
              )}
            </Tab>
            <Tab
              eventKey="stepThree"
              tabClassName={visitedTabs.stepThree ? "active" : ""}
              title={
                <Fragment>
                  <div
                    onClick={() =>
                      changeTab(
                        visitedTabs.stepThree &&
                          items.filter((item) => {
                            return item?.checked;
                          }).length
                          ? "stepThree"
                          : visitedTabs.stepTwo
                          ? "stepTwo"
                          : "stepOne"
                      )
                    }
                  >
                    <i className="fa fa-checkmark-circle"></i>
                    <span>BESTELLUNG BESTÄTIGEN</span>
                  </div>
                </Fragment>
              }
            >
              <StepThree
                confirmOrder={confirmOrder}
                items={items}
                profile={profile}
                checkedItemsTotalPrice={checkedItemsTotalPrice}
                deliveryDate={deliveryDate}
                changeTab={changeTab}
                selectedID={selectedID}
                CartTotal={CartItemTotalPrice()}
                confirmOrderLoading={confirmOrderLoading}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
