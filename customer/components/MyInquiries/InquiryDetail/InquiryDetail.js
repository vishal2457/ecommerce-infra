import React, { useEffect, useState } from "react";
import {
  dateFormatter,
  getCustomerPricing,
  ResourceApiUrl,
  showAlert,
} from "../../../utility/commonUtility";
import { Card, CardBody, Input, Button, ReactSelectDropdown } from "../../UI";
import ProductCard from "./ProductCard";
import ContentLoader from "react-content-loader";

import InquiryDetailOverlay from "./InquiryDetailOverlay";
import { Modal, Container, Table } from "react-bootstrap";
import Overlay from "../../Shared/Overlay";
import ProductData from "../../Shared/productData";
import CompareProperties from "../../Shared/CompareProperties";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "../../../contexts/cart/user-cart";
import AddressWrapper from "../../Addresses/AddressWrapper";

function InquiryDetail({
  singleInquiryDetail,
  handlePrint,
  productArr,
  loading,
  addChat,
  handleValidTillChange,
  handleRemarksChange,
  handleDeliveryAddressChange,
  inputData,
  updateInquiry,
  sendInquiry,
  cancelInquiry,
  itemMethods,
  customerGroups,
  AddressArr,
  selectedID,
  setselectedID,
  getAllAdddress,
  onSupplierChange,
  supplierArr,
  SelectedSupplier,
}) {
  // console.log("singleInquiryDetail ==== ", singleInquiryDetail);
  // console.log("productArr ==== ", productArr);
  // console.log("supplierArr ==== ", supplierArr);

  const [isEdit, setisEdit] = useState(false);
  const [isQuot, setisQuot] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [priceFilter, setpriceFilter] = useState(false);

  const [allCompareList, setallCompareList] = useState([]);

  const { addItem, items } = useCart();
  const notify = React.useCallback(({ type, message, image, ID, Toast }) => {
    Toast({ type, message, image, ID });
  }, []);

  useEffect(() => {
    setisEdit(false);
  }, [singleInquiryDetail?.Status]);

  useEffect(() => {
    singleInquiryDetail?.Quotation_Masters.length > 0
      ? setisQuot(true)
      : setisQuot(false);
  }, [singleInquiryDetail?.ID]);

  /**
   * @shortPrice short the list by price asc or desc
   * @param {string} type ASC | DESC
   * @return { array }
   */
  const shortPrice = (type) => {
    const parsePrice = (x) => parseFloat(x) || 0;

    let shortedList = allCompareList.map(({ list, properties }) => {
      if (list?.length > 1) {
        return {
          properties,
          list:
            type == "ASC"
              ? list.sort(
                  (a, b) =>
                    parsePrice(a?.QuotationDetails?.Price) -
                    parsePrice(b?.QuotationDetails?.Price)
                )
              : list.sort(
                  (a, b) =>
                    parsePrice(b?.QuotationDetails?.Price) -
                    parsePrice(a?.QuotationDetails?.Price)
                ),
        };
      } else {
        return { list, properties };
      }
    });

    //console.log("shortedList.....", shortedList);

    setpriceFilter(!priceFilter);
    setallCompareList(shortedList);
  };

  // const getTotal = (subTotal, tax, shippingCharge) => {
  //   return parseFloat(subTotal) + parseFloat(tax) + parseFloat(shippingCharge);
  // };

  /**
   * @checkProperties fun check table redundancy
   * @param {Object} filterObj properties object item wise
   * @param {Array} tempArr added properties in tables
   * @returns { boolean }
   */
  const checkProperties = (filterObj, tempArr) => {
    if (tempArr.length) {
      return tempArr.filter((item) => {
        if (
          item?.Width == filterObj.Width &&
          item?.GSM == filterObj.GSM &&
          item?.Class == filterObj.Class &&
          item?.Printibility == filterObj.Printibility &&
          item?.Color == filterObj.Color &&
          item?.Grain == filterObj.Grain
        ) {
          return item;
        }
      }).length
        ? false
        : true;
    }
    return true;
  };

  const compareProductList = () => {
    let totalList = [];
    let tempArr = [];

    for (let i = 0; i < productArr.length; i++) {
      const { Product_Master } = productArr[i];

      let filterObj = {
        Width: Product_Master?.Width,
        GSM: Product_Master?.Paper_Gsm?.PaperGsm,
        Class: Product_Master?.Paper_Class?.PaperClass,
        Printibility: Product_Master?.Paper_Printibility?.PaperPrintibility,
        Color: Product_Master?.Paper_Color?.PaperColor,
        Grain: Product_Master?.Paper_Grain?.PaperGrain,
      };

      if (
        // check item is quoted or not
        productArr[i]?.IsQuoted
      ) {
        // return boolean table already in list
        if (checkProperties(filterObj, tempArr)) {
          tempArr.push(filterObj);
          let newList = productArr?.filter((i) => {
            if (
              // filter compared product list with width, gsm, class, printibility, color, grain

              i?.Product_Master?.Width == Product_Master?.Width &&
              i?.Product_Master?.GsmID == Product_Master?.GsmID &&
              i?.Product_Master?.PaperClassID == Product_Master?.PaperClassID &&
              i?.Product_Master?.PaperPrintibilityID ==
                Product_Master?.PaperPrintibilityID &&
              i?.Product_Master?.ColorID == Product_Master?.ColorID &&
              i?.Product_Master?.GrainID == Product_Master?.GrainID
            ) {
              return i;
            }
          });

          totalList.push({ list: newList, properties: filterObj });
        }
      }
    }

    setallCompareList(totalList);
    setShow(true);
  };

  //ADD TO CART
  /**
   * @param {} e THIS IS THE EVENT FOR ADD CLICK
   * @param {*} obj OBJ { Product, DefaultPrice(default price set by the supplier), Quantity (Quantity added by customer inquiry), BuyIn (buyin UOM)}
   *
   */

  const validateCart = (inqID) => {
    let response = true;
    for (let item of items) {
      if (item?.InquiryID) {
        if (item?.InquiryID == inqID) {
          response = true;
        } else {
          response = false;
        }
      }
    }
    return response;
  };

  const addToCart = async (e, data) => {
    // console.log(data, "this is item data");
    // console.log(
    //   singleInquiryDetail?.DeliveryAddress,
    //   "this is singleInquiryDetail"
    // );

    e.stopPropagation();
    let { Product_Master, QuotationDetails } = data;
    if (!validateCart(data?.InquiryID))
      return showAlert(
        `Product from another inquiry already exists in cart-info`
      );
    let obj = {
      BuyIn: QuotationDetails?.Unit,
      Price: QuotationDetails?.Price,
      Amount: `€ ${QuotationDetails?.Amount}`,
      //Amount: QuotationDetails?.Amount,
      Quantity: QuotationDetails?.Quantity,
      // defaultPricing: `€ ${QuotationDetails?.Price}/${QuotationDetails?.Quantity} ${QuotationDetails?.Unit}`,
      defaultPricing: `€ ${QuotationDetails?.Price}/${QuotationDetails?.Unit}`,
      InquiryID: data?.InquiryID,
      QuotationDetailID: QuotationDetails?.ID,
      QuotationID: QuotationDetails?.QuotationID,
      ExpectedDeliveryDate: data?.ExpectedDate,
      expDelDate_display: data?.ExpectedDate,
      DeliveryAddress: singleInquiryDetail?.DeliveryAddress,
      AddressID: singleInquiryDetail?.AddressID,
      Pricings: getCustomerPricing(
        data?.Product_Master?.Pricings,
        customerGroups
      )[0],
    };
    const Toast = (await import("../../../components/Toast")).default;
    notify({
      type: "cart",
      message: `${Product_Master?.ProductName},
      Added to cart`,
      image: `${ResourceApiUrl}${Product_Master?.Product_Images[0]?.Image}`,
      ID: Product_Master.ID,
      Toast,
    });

    await addItem({
      product: Product_Master,
      ...obj,
    });
  };

  return (
    <>
      {/* order-detail-height */}
      {loading ? (
        // <p className="text-center">Data Not Found</p>

        <>
          <div className="col-md-4">
            <ContentLoader
              width={300}
              height={300}
              viewBox="0 0 450 400"
              backgroundColor="#f0f0f0"
              foregroundColor="#dedede"
            >
              <rect x="42" y="77" rx="10" ry="10" width="900" height="200" />
            </ContentLoader>
          </div>
        </>
      ) : (
        <>
          <Card className="light-border shadow p-3 mb-3">
            <div className="mt-3">
              <p className="lead mb-0 font-weight-bold">
                Inquiry Detail #{singleInquiryDetail?.InquiryNo}
                <span
                  className={`ml-3 py-1 singleOrder-${
                    singleInquiryDetail?.Status == "draft"
                      ? "Pending"
                      : singleInquiryDetail?.Status == "sent"
                      ? "Confirm"
                      : "Reject"
                  }`}
                >
                  {singleInquiryDetail?.Status == "draft"
                    ? "DRAFT"
                    : singleInquiryDetail?.Status == "sent"
                    ? "SENT"
                    : "CANCEL"}
                </span>
              </p>

              <InquiryDetailOverlay
                Status={singleInquiryDetail?.Status}
                trigger={"click"}
                Send={() => sendInquiry(singleInquiryDetail?.ID)}
                Edit={() => setisEdit(true)}
                Cancel={() => cancelInquiry(singleInquiryDetail?.ID)}
                Print={handlePrint}
                // Print={handlePrintSelection}
                isEdit={isEdit}
                isQuot={isQuot}
                compareProductList={compareProductList}
              />
            </div>

            <div className="font-weight-bold">
              Inquiry made by{" "}
              <kbd>{singleInquiryDetail?.User_Master?.UserName || "-"}</kbd>{" "}
              on&nbsp;
              {dateFormatter(singleInquiryDetail?.updatedAt, "getInIso")}
            </div>

            <CardBody>
              <div className="row">
                <div className="col-md-9">
                  {isEdit ? (
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group---">
                            <p>
                              <b>Inquiry Valid Till</b>
                            </p>
                            <Input
                              type="date"
                              value={
                                inputData.ValidTill ||
                                dateFormatter(
                                  singleInquiryDetail?.ValidTill,
                                  "getInIso"
                                )
                              }
                              onChange={handleValidTillChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row py-3">
                        <div className="col-md-12">
                          <div className="form-group---">
                            <p>
                              <b>Delivery Address</b>
                            </p>

                            <AddressWrapper
                              AddressArr={AddressArr}
                              getAllAdddress={getAllAdddress}
                              selectedID={selectedID}
                              setselectedID={setselectedID}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row pb-3">
                        <div className="col-md-12">
                          <div className="form-group---">
                            <p>
                              <b>Remarks</b>
                            </p>
                            <Input
                              type="textarea"
                              rows="1"
                              value={
                                inputData.Remarks ||
                                singleInquiryDetail?.Remarks
                              }
                              onChange={handleRemarksChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <br />
                      <p className="font-weight-bold">Delivery Address</p>
                      <p>{singleInquiryDetail?.DeliveryAddress || "-"}</p>
                      <br />
                      <p className="font-weight-bold">Remarks</p>
                      <p>{singleInquiryDetail?.Remarks || "-"}</p>
                    </>
                  )}
                </div>
              </div>

              {isEdit ? (
                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="px-2 btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setisEdit(false);
                        updateInquiry(singleInquiryDetail?.ID);
                      }}
                    >
                      Update
                    </button>
                  </div>
                  <div className="col-md-6 text-right">
                    <button
                      className="px-2 btn btn-sm btn-outline-dark"
                      onClick={() => setisEdit(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </CardBody>
          </Card>
          <div className="row mb-3">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <ReactSelectDropdown
                arr={supplierArr}
                bindName="SupplierName"
                bindValue="ID"
                value={SelectedSupplier?.ID || ""}
                onChange={onSupplierChange}
                placeholder="Supplier"
                name="Supplier"
                isClearable="true"
              />
            </div>
          </div>
        </>
      )}

      <div>
        {loading ? (
          // <p className="text-center">Data Not Found</p>

          <>
            {[1, 2, 3].map((item, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <ContentLoader
                    width={300}
                    height={300}
                    viewBox="0 0 450 400"
                    backgroundColor="#f0f0f0"
                    foregroundColor="#dedede"
                  >
                    <rect x="43" y="304" rx="4" ry="4" width="200" height="9" />
                    <rect x="44" y="323" rx="3" ry="3" width="90" height="6" />
                    <rect
                      x="42"
                      y="77"
                      rx="10"
                      ry="10"
                      width="900"
                      height="150"
                    />
                  </ContentLoader>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {productArr.map((item, index) => {
              return (
                <ProductCard
                  item={item}
                  index={index}
                  addChat={addChat}
                  isQuot={
                    item?.QuotationDetails
                      ? Object.entries(item?.QuotationDetails).length
                        ? true
                        : false
                      : false
                  }
                  inquiryStatus={singleInquiryDetail?.Status}
                  itemMethods={itemMethods}
                  productArr={productArr}
                  addToCart={addToCart}
                />
              );
            })}
          </>
        )}
      </div>

      <div className="inquiry_item_modal">
        {show && (
          <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="inquiry_modal_90w"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Comparison
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Container>
                {allCompareList &&
                  allCompareList.map((table) => (
                    <div className="row mt-4">
                      <div className="col-md-12 your-order-">
                        <div className="table">
                          <div className="text-center">
                            Compared Properties &nbsp;
                            <Overlay
                              heading="Compared Properties Data"
                              component={
                                <CompareProperties data={table?.properties} />
                              }
                            />
                          </div>

                          <table className="table v-middle border">
                            <thead>
                              <tr>
                                <th className="text-center">Product</th>
                                <th className="text-center">Supplier</th>
                                <th className="text-center">Qty.</th>
                                <th className="text-center">Unit</th>
                                <th>
                                  Price (&euro;)
                                  {table?.list.length > 1 ? (
                                    <span
                                      className={`pointer pl-1 ${
                                        priceFilter
                                          ? "fa fa-angle-double-up"
                                          : "fa fa-angle-double-down"
                                      }`}
                                      onClick={() =>
                                        shortPrice(priceFilter ? "ASC" : "DESC")
                                      }
                                    ></span>
                                  ) : null}
                                </th>
                                <th className="text-center">Exp. Delivery</th>
                                <th className="text-center">Terms</th>
                                <th className="text-center">Cart</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.list &&
                                table.list.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {item?.Product_Master?.ProductName}&nbsp;
                                      <Overlay
                                        heading={
                                          item?.Product_Master?.ProductName
                                        }
                                        component={
                                          <ProductData
                                            data={item?.Product_Master}
                                          />
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      {item?.Supplier?.SupplierName}
                                    </td>
                                    <td className="text-center">
                                      {item?.QuotationDetails?.Quantity}
                                    </td>
                                    <td className="text-center">
                                      {item?.QuotationDetails?.Unit}
                                    </td>
                                    <td className="text-center">
                                      {item?.QuotationDetails?.Price}
                                    </td>
                                    <td className="text-center">
                                      {dateFormatter(
                                        item?.QuotationDetails
                                          ?.ExpectedDeliveryDate,
                                        "getInIso"
                                      )}
                                    </td>
                                    <td className="text-center">
                                      {item?.QuotationDetails?.Terms}
                                    </td>
                                    <td className="text-center">
                                      {/* <button
                                        className="btn btn-sm btn-outline-dark px-1"
                                        onClick={(e) => addToCart(e, item)}
                                      >
                                        <AiOutlineShoppingCart size={18} />
                                      </button> */}

                                      {item?.QuotationDetails
                                        ?.Purchase_Order_Details?.length > 0 ? (
                                        <p className="text-success">
                                          Already Ordered
                                        </p>
                                      ) : (
                                        <button
                                          className="btn btn-sm btn-outline-dark px-1"
                                          onClick={(e) => addToCart(e, item)}
                                        >
                                          <AiOutlineShoppingCart size={18} />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* <div className="col-md-12 text-right">
                        <button className="btn btn-red">Cancel</button>
                      </div> */}
                    </div>
                  ))}
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}

export default InquiryDetail;
