import React, { useEffect, useState } from "react";
import {
  getDateDetail,
  ResourceApiUrl,
  getOrderMessage,
  getButton,
  dateFormatter,
  getCustomerPricing,
  getLocaleString,
} from "../../../utility/commonUtility";
import Image from "../../image/image";
import { Card, Button } from "../../UI";
import Overlay from "../../Shared/Overlay";
import ProductData from "../../Shared/productData";
import Link from "next/link";
import UpdateProductCard from "./UpdateProductCard";
import { Modal, Container, Table } from "react-bootstrap";
import ProductCardOverlay from "./ProductCardOverlay";
import { AiOutlineShoppingCart } from "react-icons/ai";

function ProductCard({
  item,
  addChat,
  index,
  isQuot,
  inquiryStatus,
  itemMethods,
  productArr,
  addToCart,
  CustomerGroupArr,
}) {
  const [isOpen, setisOpen] = useState(false);
  const [isCompare, setisCompare] = useState(false);
  const [show, setShow] = useState(false);

  const [compareList, setcompareList] = useState([]);
  const [priceFilter, setpriceFilter] = useState(false);

  const [showCartOption, setshowCartOption] = useState(true);

  const handleClose = () => setShow(false);

  const [inputData, setinputData] = useState({
    Quantity: null,
    Unit: null,
    ExpectedDate: null,
    Remarks: null,
  });

  useEffect(() => {
    let newList = productArr?.filter((i) => {
      if (
        // filter compared product list with width, gsm, class, printibility, color, grain
        i.IsQuoted &&
        i?.Product_Master?.Width == item?.Product_Master?.Width &&
        i?.Product_Master?.GsmID == item?.Product_Master?.GsmID &&
        i?.Product_Master?.PaperClassID == item?.Product_Master?.PaperClassID &&
        i?.Product_Master?.PaperPrintibilityID ==
          item?.Product_Master?.PaperPrintibilityID &&
        i?.Product_Master?.ColorID == item?.Product_Master?.ColorID &&
        i?.Product_Master?.GrainID == item?.Product_Master?.GrainID
      ) {
        return i;
      }
    });

    setcompareList(newList);

    setshowCartOption(
      item?.QuotationDetails?.Purchase_Order_Details?.length > 0
    );
  }, [item?.ID, productArr]);

  // const CustomerPricing = React.useMemo(() => {
  //   return getCustomerPricing(item?.Product_Master?.Pricings, CustomerGroupArr)
  // })

  const openDetails = () => {
    setisOpen(true);
  };

  const closeDetails = () => {
    setisOpen(false);
  };

  const openCompare = () => {
    setisCompare(true);
  };

  const closeCompare = () => {
    setisCompare(false);
  };

  const onChangeQuantity = (e) => {
    setinputData({
      ...inputData,
      Quantity: e.target.value,
    });
  };

  const handleUnit = (value) => {
    setinputData({
      ...inputData,
      Unit: value?.uom,
    });
  };

  const handleExpectedDate = (e) => {
    setinputData({
      ...inputData,
      ExpectedDate: e.target.value,
    });
  };

  const handleRemarks = (e) => {
    setinputData({
      ...inputData,
      Remarks: e.target.value,
    });
  };

  /**
   * @shortPrice short the list by price asc or desc
   * @param {string} type ASC | DESC
   * @return { array }
   */
  const shortPrice = (type) => {
    const parsePrice = (x) => parseFloat(x) || 0;

    let shortedList =
      type == "ASC"
        ? compareList.sort(
            (a, b) =>
              parsePrice(a?.QuotationDetails?.Price) -
              parsePrice(b?.QuotationDetails?.Price)
          )
        : compareList.sort(
            (a, b) =>
              parsePrice(b?.QuotationDetails?.Price) -
              parsePrice(a?.QuotationDetails?.Price)
          );

    //console.log("shortedList.....", shortedList);

    setpriceFilter(!priceFilter);
    setcompareList(shortedList);
  };

  return (
    <>
      <Card className="border mb-3 p-3 shadow-sm br_5">
        <div className="card-title">
          <div className="d-flex justify-content-between">
            <ProductCardOverlay
              trigger={"click"}
              Edit={() => setShow(true)}
              Chat={() => addChat(index)}
              Delete={() => itemMethods?.deleteItem(item?.ID)}
              Close={closeDetails}
              Open={openDetails}
              Status={inquiryStatus}
              isOpen={isOpen}
              isQuot={isQuot}
              openCompare={openCompare}
              addToCart={(e) => addToCart(e, item)}
              showCartOption={!showCartOption}
            />
          </div>
        </div>
        <div className="card-body p-0">
          <div className="d-flex">
            <Image
              alt={`Product Image`}
              className="img-fluid border"
              style={{ width: "60px", height: "60px" }}
              src={`${ResourceApiUrl}${item?.Product_Master?.Product_Images[0]?.Image}`}
            />
            <div className="product-info ml-2 mt-2">
              <Link href={`/Product?id=${item?.Product_Master?.ID}`}>
                <p className="font-weight-bold mb-0 pointer d-inline">
                  {item?.Product_Master?.ProductName}
                </p>
              </Link>
              &nbsp;
              <Overlay
                heading={item?.Product_Master?.ProductName}
                component={<ProductData data={item?.Product_Master} />}
              />
              {isQuot ? (
                showCartOption ? (
                  <>
                    &nbsp;&nbsp;
                    <span className="text-success font-weight-bold">
                      (Ordered)
                    </span>
                  </>
                ) : (
                  <>
                    &nbsp;&nbsp;
                    <span className="text-primary font-weight-bold">
                      (Quoted)
                    </span>
                  </>
                )
              ) : null}
              <div className="row">
                <div className="col-md-4">
                  <b>Qty:</b> {item?.Quantity}&nbsp;{item?.Unit}
                </div>

                <div className="col-md-8">
                  <p className="mb-0 qty-uom">
                    <b>Supplier Name:</b>{" "}
                    <span className="bg-muted rounded">
                      {item?.Supplier?.SupplierName}
                    </span>
                  </p>
                </div>
              </div>
              <p className="mb-0 qty-uom">
                <b>Expected Date:</b>{" "}
                {dateFormatter(item?.ExpectedDate, "getInIso")}
              </p>
              <p className="mb-0 qty-uom">
                <b>Remarks:</b> {item?.Remarks}
              </p>
            </div>
          </div>

          {isOpen ? (
            <>
              <p
                className="font-weight-bold text-center my-2"
                style={{ backgroundColor: "#edebeb", padding: "1px" }}
              >
                Quotation by {item?.Supplier?.SupplierName}
              </p>
              <div className="row">
                <div className="col-md-4">
                  <p className="mb-0 qty-uom">
                    <b>Price:</b>{" "}
                    <span className="price_inquiry">
                      &euro; {getLocaleString(item?.QuotationDetails?.Price)}
                      {/* {item?.QuotationDetails?.Quantity}{" "} */}
                      {" / "}
                      {item?.QuotationDetails?.Unit}
                    </span>{" "}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-0 qty-uom">
                    <b>Qty:</b>{" "}
                    <span className="price_inquiry">
                      &euro; {item?.QuotationDetails?.Quantity}
                      &nbsp; {item?.QuotationDetails?.Unit}
                    </span>
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-0 qty-uom">
                    <b>Amount:</b>{" "}
                    <span className="price_inquiry">
                      &euro; {getLocaleString(item?.QuotationDetails?.Amount)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <p className="mb-0 qty-uom">
                    <b>Quotation Date:</b>{" "}
                    {dateFormatter(
                      item?.QuotationDetails?.createdAt,
                      "getInIso"
                    )}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p className="mb-0 qty-uom">
                    <b>Expected Delivery Date:</b>{" "}
                    {dateFormatter(
                      item?.QuotationDetails?.ExpectedDeliveryDate,
                      "getInIso"
                    )}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p className="mb-0 qty-uom">
                    <b>Terms:</b>{" "}
                    {item?.QuotationDetails?.Terms_Master?.Description}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p className="mb-0 qty-uom">
                    <b>Remarks:</b> {item?.QuotationDetails?.Remarks}
                  </p>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </Card>

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
                Update Inquiry Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Container>
                <div className="row mt-4">
                  <div className="col-md-12 your-order-">
                    <div className="table">
                      <table className="table v-middle">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Size</th>
                            <th className="text-center">GSM</th>
                            <th className="text-center">Qty</th>
                            <th className="text-center">Unit</th>
                            <th className="text-left">Expected Till</th>
                            <th className="text-left">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item && (
                            <UpdateProductCard
                              data={item}
                              inputData={inputData}
                              handleInputs={{
                                quantity: onChangeQuantity,
                                unit: handleUnit,
                                expectedDate: handleExpectedDate,
                                remark: handleRemarks,
                              }}
                            />
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* <div className="col-md-12 text-right">
                    <button
                      className="btn btn-red"
                      onClick={() =>
                        itemMethods?.updateItem(inputData, item?.ID)
                      }
                    >
                      Update
                    </button>
                  </div> */}
                </div>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-danger"
                onClick={() => itemMethods?.updateItem(inputData, item?.ID, item?.ProductID)}
              >
                Update
              </Button>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>

      <div className="inquiry_item_modal">
        {isCompare && (
          <Modal
            show={isCompare}
            onHide={closeCompare}
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
                <div className="row mt-4">
                  <div className="col-md-12 your-order-">
                    <div className="table">
                      <table className="table v-middle border">
                        <thead>
                          <tr>
                            <th className="text-center">Product</th>
                            <th className="text-center">Supplier</th>
                            <th className="text-center">Qty</th>
                            <th className="text-center">Unit</th>
                            <th>
                              Price (&euro;)
                              {compareList.length > 1 ? (
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
                          {compareList &&
                            compareList.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {item?.Product_Master?.ProductName}&nbsp;
                                  <Overlay
                                    heading={item?.Product_Master?.ProductName}
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
                                  {showCartOption ? (
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
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={closeCompare}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}

export default ProductCard;
