import React, { Fragment, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Breadcrumb, Tab, Tabs, Accordion } from "react-bootstrap";
import ProductCard from "../components/Inquiry/ProductCard";
import dynamic from "next/dynamic";
import * as animationData from "../components/shop/loading.json";

import { getProducts, emptyProducts } from "../Redux/Shop/actions";
import {
  onUpdateSlider,
  onChangeSlider,
  resetSlider,
} from "../Redux/Inquiry/actions";
import api from "../Redux/api";
import Filters from "../components/Inquiry/Filters";
import Overlay from "../components/Shared/Overlay";
import ProductData from "../components/Shared/productData";
import { useInquiry } from "../contexts/Inquiry/user-inquiry";
import { AuthContext } from "../contexts/auth/auth.context";
import { useRouter } from "next/router";
import { BulletList } from "react-content-loader";
const Lottie = dynamic(() => import("../components/Shared/Lottie"));

import {
  uniqueNumber,
  showAlert,
  windowScrollUp,
} from "../utility/commonUtility";
import { Button } from "../components/UI";
import Conditional from "../components/Shared/Conditional";

const StepTwo = dynamic(() => import("../components/Inquiry/StepTwo/index.js"));
const Footer = dynamic(() => import("../layout/Footer"));
const Header = dynamic(() => import("../layout/Header"));
const StepThree = dynamic(() =>
  import("../components/Inquiry/StepThree/index.js")
);
const Chat = dynamic(() =>
  import("../components/Chat/Chat").then((mod) => mod.Chat)
);

const limit = 9;

export const Inquiry = ({
  getProducts,
  products,
  totalItemsCount,
  onChangeSlider,
  onUpdateSlider,
  resetSlider,
  domain,
  values,
  reversed,
  update,
  emptyProducts,
  count,
}) => {

  const router = useRouter();
  const { addItem, removeItem, selectedItems, emptySelectedItems } =
    useInquiry();
  const { authState } = useContext(AuthContext);
  const [chatData, setchatData] = useState([]);
  const [activeTab, setactiveTab] = useState("stepOne");

  const [loadMoreLoading, setloadMoreLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [profile, setprofile] = useState(null);
  const [AddressArr, setAddressArr] = useState([]);
  const [selectedID, setselectedID] = useState([]);

  const [page, setpage] = useState(1);

  const [commonInputData, setcommonInputData] = useState({
    inquiryNo: null,
    ValidTill: null,
    Remarks: null,
    validTillReqMsg: "",
  });

  const [addressLoader, setaddressLoader] = useState(false);

  let requestCache = {};

  //let [items, setitems] = useState({});

  const [inputData, setinputData] = useState({
    Quantity: {},
    PackageType: {},
    ExpectedDate: {},
    Remarks: {},
  });
  const [state, setstate] = useState({
    productLoading: true,
    filterArr: [],
    filterState: false,
    Width: null,
    Length: null,
    GSM0: 0,
    GSM1: 1000,
  });
  const [dropdownLoading, setdropdownLoading] = useState(true);
  const [initialTimeout, setinitialTimeout] = useState(null);
  const [groupArr, setgroupArr] = useState([]);
  const [filterLoading, setfilterLoading] = useState(false);
  const [productLoading, setproductLoading] = useState(false);

  const [dropDownValues, setdropDownValues] = useState({
    ProductGroup: [],
    ProductSubgroup: [],
    PaperClass: [],
    PaperQuality: [],
    PaperPrintibility: [],
    PaperColor: [],
    MeasurementUnit: [],
    PaperGrain: [],
  });

  const [visitedTabs, setvisitedTabs] = useState({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  });

  React.useEffect(() => {
    (async () => {
      setproductLoading(true);
      await emptyProducts();
      if (!authState?.isAuthenticated) {
        return router.push({
          pathname: "/Auth",
          query: { type: "Login" },
        });
      }

      if (authState.isAuthenticated) {
        /**
         * @Get_Customer_Groups
         */
        await api.get("/CustomerGroups/getAllGroupsForCustomer").then((res) => {
          setgroupArr(res.data.data);
        });
      }
      
      await getProducts({
        filter: state.filterArr,
        //value: values,  //when use Slider
        value: [parseInt(state.GSM0), parseInt(state.GSM1)],  // when not slider
        format: { width: state.Width, length: state.Length },
        limit: limit,
        page,
      });
      setproductLoading(false);
    })();

    return () => {};
  }, [state.filterState]);

  React.useEffect(() => {
    (async () => {
      setfilterLoading(true);
      let obj = dropDownValues;
      for (let property of Object.keys(dropDownValues)) {
        await api.get(`/master/getAll${property}/${property}`).then((res) => {
          obj[property] = res.data.data;
        });
      }
      setdropDownValues(obj);
      setfilterLoading(false);
    })();
    return () => {};
  }, [dropDownValues]);

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

  const changeTab = (tab) => {
    if (tab == "stepTwo") {
      if (!AddressArr.length) getAllAdddress();
    }
    setactiveTab(tab);
    if (tab == "stepThree") {
      setcommonInputData({
        ...commonInputData,
        inquiryNo: uniqueNumber(),
      });
    }
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

  const inquiryData = [
    {
      supName: "Mazda Agency",
    },
    {
      supName: "Aspire Packaging",
    },
    {
      supName: "Dunder Mifflin",
    },
    {
      supName: "Dunder Mifflin",
    },
  ];

  const addChat = (i) => {
    console.log(inquiryData[i].supName, "this is index");
    if (chatData.some((e) => e.id == i)) {
      var tempArr = chatData.filter((c) => {
        return c.id != i;
      });
      setchatData(tempArr);
    } else {
      let obj = { id: i, name: inquiryData[i].supName, no: "EU123" };

      chatData.unshift(obj);
      if (chatData.length > 3) chatData.pop();
      setchatData([...chatData]);
    }
  };

  const removeChat = (i) => {
    chatData.splice(i, 1);
    setchatData([...chatData]);
  };

  /**
   * @Load_More_Products
   */
  const loadMore = async () => {
    setloadMoreLoading(true);
    setpage(page + 1);
    await getProducts({
      filter: state.filterArr,
      value: values,
      format: { width: state.Width, length: state.Length },
      limit: limit,
      page: page + 1,
    });

    setloadMoreLoading(false);
  };

  const handleDropdownChange = (value, actionObj) => {
    //  console.log(value, actionObj);

    const { action, name, removedValue, option } = actionObj;
    let tempArr = state.filterArr;
    if (action == "remove-value") {
      //single value removed
      let index = tempArr.findIndex(
        (filter) => filter[name] == removedValue[name]
      );
      tempArr.splice(index, 1);
      setstate({
        ...state,
        filterArr: tempArr,
        filterState: !state.filterState,
      });
    } else if (action == "clear") {
      //dropdown cleared
      let removeObj = tempArr.filter((item) => Object.keys(item)[0] != name);
      setstate({
        ...state,
        filterArr: removeObj,
        filterState: !state.filterState,
      });
    } else {
      //value selected in dropdown
      tempArr.push({
        [name]: option?.[name],
        ID: option?.ID,
      });
      setstate({
        ...state,
        filterArr: tempArr,
        filterState: !state.filterState,
      });
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    setstate({
      ...state,
      [name]: value,
      filterState: !state.filterState,
    });
    // clearTimeout(initialTimeout);
    // let timeout = setTimeout(() => {
    //   setstate({
    //     ...state,
    //     filterState: !state.filterState,
    //   });
    // }, 400);
    // setinitialTimeout(timeout);
  };


  //function to emit products that are selected from the product list in stepOne
  function filteringSelectedItems(productsArr) {
    // console.log(products, "this is products array");
    let arr = [];
    if (products) {
      for (let singleProduct of productsArr) {
        if (selectedItems.length) {
          if (
            !selectedItems.filter((item) => item.ID == singleProduct.ID).length
          ) {
            arr.push(singleProduct);
          }
        } else {
          arr.push(singleProduct);
        }
      }
    }
    return arr;
  }

  //clear all filters in stepOne
  const clearFilter = () => {
    setstate({
      ...state,
      filterArr: [],
      Width: null,
      Length: null,
      filterState: !state.filterState,
      GSM0: 0,  // when not slider
      GSM1: 1000, // when not slider
    });
    resetSlider();
  };

  //add item on field change on step two
  const addItemLocal = (type, item, changeItem, key, changeType) => {
    if (type == "QuantityChange") {
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        addItem(item, changeItem, key);
      }, 400);
      setinitialTimeout(timeout);
    } else {
      addItem(item, changeItem, key, changeType);
    }
  };

  //handle change of quantity in stepone and steptwo
  const onChangeQuantity = (e, item, key) => {
    if (key != "update") {
      setinputData({
        ...inputData,
        Quantity: { ...inputData.Quantity, [e.target.name]: e.target.value },
      });
    }
    if (item)
      return addItemLocal(
        "QuantityChange",
        item,
        {
          Quantity: { [e.target.name]: e.target.value },
        },
        key
      );
  };

  //handle change of unit on stepOne and stepTwo
  // key use for update
  const handlePackageType = (value, action, item, key, changeType) => {
    if (key != "update") {
      setinputData({
        ...inputData,
        PackageType: { ...inputData.PackageType, [action?.name]: value?.uom },
      });
    }

    if (item)
      return addItemLocal(
        "PackageTypeChange",
        item,
        {
          PackageType: { [action?.name]: value?.uom },
        },
        key,
        changeType
      );
  };

  //handle change in expected date in stepOne and stepTwo
  const handleExpectedDate = (e, item, key) => {
    if (key != "update") {
      setinputData({
        ...inputData,
        ExpectedDate: {
          ...inputData.ExpectedDate,
          [e.target.name]: e.target.value,
        },
      });
    }

    if (item)
      return addItemLocal(
        "ExpectedDateChange",
        item,
        {
          ExpectedDate: {
            [e.target.name]: e.target.value,
          },
        },
        key
      );
  };

  //handle change in remarks in stepOne and stepTwo
  const handleRemarks = (e, item, key) => {
    if (key != "update") {
      setinputData({
        ...inputData,
        Remarks: {
          ...inputData.Remarks,
          [e.target.name]: e.target.value,
        },
      });
    }

    if (item)
      return addItemLocal(
        "RemarksChange",
        item,
        {
          Remarks: {
            [e.target.name]: e.target.value,
          },
        },
        key
      );
  };

  const checkValidation = (ID) => {
    if (inputData.Quantity?.[ID] || inputData.PackageType?.[ID]) return true;
    return false;
  };

  const submitInquiry = (type) => {
    if (!commonInputData?.ValidTill) {
      windowScrollUp();
      setcommonInputData({
        ...commonInputData,
        validTillReqMsg: "Valid Till is required",
      });
      return false;
    }

    /**
     * inner method apiCall();
     */
    const apiCall = async () => {
      //if (!profileValid) return;

      // console.log("selectedID  =  ", selectedID);

      setloading(true);
      await api
        .post("/inquiry/newIquiry", {
          selectedItems,
          additionalInfo: {
            type,
            inquiryNo: commonInputData?.inquiryNo,
            ValidTill: commonInputData?.ValidTill,
            Remarks: commonInputData?.Remarks,
            AddressID: selectedID?.ID,
            DeliveryAddress:
              selectedID?.Address +
              ", " +
              selectedID?.["City.City"] +
              ", " +
              selectedID?.["State.State"] +
              ", " +
              selectedID?.["Country.Country"] +
              ", " +
              selectedID?.ZipCode,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setcommonInputData({
              inquiryNo: null,
              ValidTill: null,
              Remarks: null,
              validTillReqMsg: "",
            });
            showAlert(`${res?.data?.msg}-custom`);
            emptySelectedItems();
            setactiveTab("stepOne");
            setvisitedTabs({
              ...visitedTabs,
              stepOne: true,
              stepTwo: false,
              stepThree: false,
            });
            setloading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          showAlert("Something went wrong-err");
          setloading(false);
        });
    };

    type == "sent"
      ? showAlert(`Send Inquiry?-confirmation`, "Yes").then((result) => {
          if (!result.isConfirmed) return false;

          apiCall();
        })
      : apiCall();
  };

  const confirmAddress = () => {
    if (selectedID) {
      changeTab("stepThree");
    }
  };

  return (
    <>
      <Header />
      <div className="container inquiry">
        <div className="row">
          <div className="col-md-8 text-left">
            <h1>Product Inquiry</h1>
          </div>
          <div className="col-md-4 text-right">
            {/* <div className="d-flex"> */}
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Inquiry</Breadcrumb.Item>
            </Breadcrumb>
            {/* </div> */}
          </div>
        </div>
        <div className="steps_tab">
          <Tabs activeKey={activeTab} id="uncontrolled-tab-example">
            <Tab
              eventKey="stepOne"
              tabClassName="active"
              title={
                <Fragment>
                  <div onClick={() => changeTab("stepOne")}>
                    <i class="fa fa-checkmark-circle"></i>
                    <span>Select Products</span>
                  </div>
                </Fragment>
              }
            >
              <h3>Select Products</h3>
              <Filters
                dropDownValues={dropDownValues}
                handleDropdownChange={handleDropdownChange}
                state={state}
                slider={{ domain, values, reversed, update }}
                clearFilter={clearFilter}
                filterArr={state.filterArr}
                onInputChange={onInputChange}
                onChangeSlider={(val) => {
                  onChangeSlider(val);
                  setstate({ ...state, filterState: !state.filterState });
                }}
                onUpdateSlider={onUpdateSlider}
                filterLoading={filterLoading}
              />

              <div className="row mt-4">
                <div className="col-md-9 delivery-address">
                  {productLoading ? (
                    <BulletList />
                  ) : (
                    <div className="table table-responsive">
                      <Accordion>
                        <table className="table v-middle">
                          <thead>
                            <tr>
                              <th></th>
                              <th></th>
                              <th className="text-center">
                                <label>Name</label>
                              </th>
                              <th className="text-center">
                                <label>Qty.</label>
                              </th>

                              <th className="text-center">
                                <label>Unit</label>
                              </th>
                              <th className="text-center">
                                <label>Expected Till</label>

                                {/* <input
                                  type="date"
                                  className="form-control w-50 m-auto"
                                  name="ExpectedDate"
                                  value={inputData?.ExpectedDate || ""}
                                /> */}
                              </th>
                              <th>
                                {/* <Button
                                  variant="light"
                                  className="btn btn-icon"
                                >
                                  <i className="fa fa-plus"></i>
                                </Button> */}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {products && products?.length > 0 ? (
                              //filteringSelectedItems(products).map(
                              products.map((product, index) => {
                                return (
                                  <ProductCard
                                    data={product}
                                    index={index}
                                    inputData={inputData}
                                    groupArr={groupArr}
                                    handleInputs={{
                                      quantity: onChangeQuantity,
                                      packageType: handlePackageType,
                                      expectedData: handleExpectedDate,
                                    }}
                                    selectItems={(item) => {
                                      if (checkValidation(item.ID)) {
                                        addItem(item, inputData);
                                        setinputData({
                                          Quantity: {},
                                          PackageType: {},
                                          ExpectedDate: {},
                                        });
                                      } else {
                                        showAlert(
                                          "QUANTITY or UNIT cannot be empty-err"
                                        );
                                      }
                                    }}
                                  />
                                );
                              })
                            ) : (
                              <>
                                <tr>
                                  <td colspan="7" className="text-center">
                                    <Lottie
                                      data={animationData.default}
                                      height={400}
                                      width={400}
                                    />
                                    <p>No products found!</p>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </Accordion>
                      <div className="text-center">
                        <Conditional condition={products.length}>
                          <Conditional
                            condition={products.length < count}
                            elseComponent={<p>All products loaded !</p>}
                          >
                            <Button
                              variant="primary"
                              onClick={loadMore}
                              loading={loadMoreLoading}
                            >
                              Load More
                            </Button>
                          </Conditional>
                        </Conditional>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-3 your-order">
                  <div className="section-heading">
                    Selected Products &nbsp;
                    <span className="font-weight-bold">
                      ({selectedItems?.length})
                    </span>
                  </div>
                  <div className="table">
                    <table className="table">
                      <tbody>
                        {!selectedItems?.length ? (
                          <div className="text-center mt-4">
                            No products selected
                          </div>
                        ) : (
                          <>
                            {selectedItems?.length &&
                              selectedItems.map((item) => {
                                return (
                                  <tr>
                                    <td className="product_detail">
                                      {item?.ProductName} &nbsp;
                                      <Overlay
                                        heading={item?.ProductName}
                                        component={<ProductData data={item} />}
                                      />
                                      <br />
                                      Size: {item?.Height} X {item?.Width}
                                      <br />
                                      Gsm: {item?.Paper_Gsm?.PaperGsm}
                                      <br />
                                      Expected Till: {item?.ExpectedDate}
                                      <br />
                                      Quantity: {item?.Quantity}
                                      <br />
                                      Unit: {item?.PackageType}
                                      <br />
                                      Supplier: {item?.Supplier?.SupplierName}
                                      {/* <hr className="m-0" /> */}
                                    </td>
                                    <td className="action">
                                      <button
                                        className="btn btn-icon"
                                        onClick={() => removeItem(item)}
                                      >
                                        <i class="fa fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-12 text-right">
                  {/* <button className="btn btn-red">Select Suppliers</button> */}
                  {selectedItems?.length ? (
                    <button
                      className="btn btn-red"
                      onClick={() => changeTab("stepTwo")}
                    >
                      Confirm Inquiry
                    </button>
                  ) : null}
                </div>
              </div>
            </Tab>

            <Tab
              eventKey="stepTwo"
              tabClassName={
                visitedTabs.stepTwo && selectedItems.length ? "active" : ""
              }
              title={
                <Fragment>
                  <div
                    onClick={() =>
                      changeTab(
                        visitedTabs.stepTwo && selectedItems.length
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
                  confirmAddress={confirmAddress}
                  loading={loading}
                  AddressArr={AddressArr}
                  selectedID={selectedID}
                  setselectedID={setselectedID}
                  getAllAdddress={getAllAdddress}
                />
              )}
            </Tab>
            <Tab
              eventKey="stepThree"
              tabClassName={
                visitedTabs.stepThree && selectedItems.length ? "active" : ""
              }
              title={
                <>
                  <div
                    onClick={() =>
                      changeTab(
                        visitedTabs.stepThree
                          ? "stepThree"
                          : visitedTabs.stepTwo
                          ? "stepTwo"
                          : "stepOne"
                      )
                    }
                  >
                    <i class="fa fa-checkmark-circle"></i>
                    <span>Generate Inquiry</span>
                  </div>
                </>
              }
            >
              {/* <h3>Inquiry</h3> */}
              <StepThree
                changeTab={changeTab}
                products={selectedItems}
                submitInquiry={submitInquiry}
                inputData={inputData}
                handleInputs={{
                  quantity: onChangeQuantity,
                  packageType: handlePackageType,
                  expectedData: handleExpectedDate,
                  remark: handleRemarks,
                }}
                commonInputData={commonInputData}
                commonHandleInputs={{
                  commonRemarks: (e) =>
                    setcommonInputData({
                      ...commonInputData,
                      Remarks: e.target.value,
                    }),
                  commonValidTill: (e) =>
                    setcommonInputData({
                      ...commonInputData,
                      ValidTill: e.target.value,
                      validTillReqMsg: "",
                    }),
                }}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      <Footer />
      {chatData.length ? (
        <Chat chatData={chatData} removeChat={removeChat} />
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.Shop.products,
  totalItemsCount: state.Shop.products.count,
  domain: state.Inquiry.domain,
  values: state.Inquiry.values,
  reversed: state.Inquiry.reversed,
  update: state.Inquiry.update,
  count: state.Shop.count,
});

const mapDispatchToProps = {
  getProducts,
  onChangeSlider,
  onUpdateSlider,
  resetSlider,
  emptyProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Inquiry);
