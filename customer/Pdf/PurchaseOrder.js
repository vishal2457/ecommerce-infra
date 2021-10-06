import React from "react";
import PurchaseOrderProductList from "../components/Pdf/PurchaseOrderProductList";
import { dateFormatter, getLocaleString } from "../utility/commonUtility";

export default class PurchaseOrder extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getTotal = (subTotal, tax, shippingCharge) => {
    return parseFloat(subTotal) + parseFloat(tax) + parseFloat(shippingCharge);
  };

  render() {
    const { productArr, singleOrderDetail } = this.props.data;

    // calc grand total...calc Tax and other charges
    const getGrandTotal = () => {
      let subTotal = singleOrderDetail?.SubTotal
        ? singleOrderDetail?.SubTotal
        : 0;
      let tax = singleOrderDetail?.Tax ? singleOrderDetail?.Tax : 0;
      let shipping = singleOrderDetail?.shippingCharge
        ? singleOrderDetail?.shippingCharge
        : 0;

      return subTotal + tax + shipping;
    };

    // console.log(productArr);
    // console.log(singleOrderDetail);

    // console.log("this.props.data ====== ", this.props.data);

    var breakupDetails = {
      subTotal: singleOrderDetail?.SubTotal ? singleOrderDetail?.SubTotal : 0,
      tax: singleOrderDetail?.Tax ? singleOrderDetail?.Tax : 0,
      shippingCharge: singleOrderDetail?.shippingCharge
        ? singleOrderDetail?.shippingCharge
        : 0,
      deliveryCharge: 0,
      disconut: 0,
      grandTotal: getGrandTotal(),
      paymentMethod: singleOrderDetail?.Customer_Address?.PaymentMethod || "-",
      // pendingDispatchValue: pendingDispatchValue
    };

    // for(let i = 0; i < productArr.length; i++){
    //   console.log("Product ID",  productArr[i]);
    // }

    return (
      <body>
        <div className="pdfView">
          <table border="0" width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <td>
                  <div className="header-space">&nbsp;</div>
                  <header id="pageHeader-first" style={{ width: "100%" }}>
                    <table
                      border="0"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      className="orange_border_bottom"
                    >
                      <tbody>
                        <tr>
                          <td width="80%">
                            <img
                              className="pdf-logo"
                              src="/img/logo/logo.png"
                              alt="Logo"
                            />
                          </td>
                          <td
                            className="main_header_short_info_right"
                            style={{
                              align: "right",
                              valign: "bottom",
                              verticalAlign: "middle",
                            }}
                            width="20%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              className="main_header_info"
                            >
                              <tr>
                                <td>
                                  <strong>Purchase Order :</strong>
                                </td>
                                <td>{singleOrderDetail?.PurchaseOrderNo}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Date : </strong>
                                </td>
                                <td>
                                  {singleOrderDetail?.createdAt
                                    ? dateFormatter(
                                        singleOrderDetail.createdAt,
                                        "getInIso"
                                      )
                                    : ""}
                                </td>
                              </tr>
                              {/* <tr>
                                <td>
                                  <strong>Format No.</strong>
                                </td>
                                <td></td>
                              </tr> */}
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* <table className="main_header_short_info" border="0" width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td>
                    <strong>Purchase Order : </strong> PO_NO | Date :
                    PO_Date
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>Format No.:</strong> ISO_Format_No
                  </td>
                </tr>
              </table> */}
                  </header>
                </td>
              </tr>
            </thead>
            <tbody className="firstTbody">
              {/* For Mozilla First page blank Issue solved add new class at first tbody */}
              <tr>
                <td>
                  <table
                    border="0"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    className="status_info"
                  >
                    <tr>
                      <td align="right">
                        Status : {singleOrderDetail?.OrderStatus}
                      </td>
                    </tr>
                  </table>
                  <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="section_title"
                  >
                    <tr>
                      <td width="33%" className="section_heading">
                        Supplier :
                      </td>
                      <td width="33%" className="section_heading">
                        Customer :
                      </td>
                      <td width="34%" className="section_heading">
                        PO Details :
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>
                          {singleOrderDetail?.Supplier?.SupplierName}
                        </strong>
                        <br />
                        {singleOrderDetail?.Supplier?.Address}
                        <br />
                        {singleOrderDetail?.Supplier?.City?.City} –{" "}
                        {singleOrderDetail?.Supplier?.State?.State}
                        <br />
                        {singleOrderDetail?.Supplier?.Country?.Country} -{" "}
                        {singleOrderDetail?.Supplier?.ZipCode} <br />
                        <strong>Phone : </strong>
                        {singleOrderDetail?.Supplier?.Number}
                        <br />
                        <strong>Email : </strong>
                        {singleOrderDetail?.Supplier?.Email}
                        {/* <br />
                        <strong>GST No. : </strong>
                        <br />
                        <strong>PAN No. : </strong> */}
                        <br />
                        <br />
                        {/* <strong>Kind Attention : </strong> */}
                        <br />
                        ContactPerson:{" "}
                        {singleOrderDetail?.Supplier?.ContactPersonName}
                      </td>
                      <td>
                        <strong>
                          {singleOrderDetail?.Customer?.CustomerName}
                        </strong>
                        <br />
                        <strong>
                          {singleOrderDetail?.Customer_Address?.Title}
                        </strong>
                        <br />
                        {singleOrderDetail?.Customer_Address?.Address}
                        <br />
                        {singleOrderDetail?.Customer_Address?.City?.City} –{" "}
                        {singleOrderDetail?.Customer_Address?.State?.State}
                        <br />
                        {
                          singleOrderDetail?.Customer_Address?.Country?.Country
                        }{" "}
                        - {singleOrderDetail?.Customer_Address?.ZipCode}
                        <br />
                        <strong>Phone : </strong>
                        {singleOrderDetail?.Customer_Address?.Phone}
                        <br />
                        <strong>Email : </strong>
                        {singleOrderDetail?.Customer?.Email}
                        {/* <br />

                        <strong>GST No. : </strong> <br />
                        <strong>CIN No. : </strong> <br />
                        <strong>PAN No. : </strong> */}
                        {singleOrderDetail?.User_Master?.UserName ? (
                          <>
                            <br />
                            <br />
                            <div style={{ padding: "10px 0px" }}>
                              <strong>
                                User:{" "}
                                {singleOrderDetail?.User_Master?.UserName ||
                                  "-"}
                              </strong>
                            </div>
                          </>
                        ) : null}
                      </td>
                      <td>
                        <strong>PO. No. : </strong>
                        {singleOrderDetail?.PurchaseOrderNo}
                        <br />
                        {/* <strong>Rev No. </strong>:
                        <br /> */}
                        <strong>Date </strong>:{" "}
                        {singleOrderDetail?.createdAt
                          ? dateFormatter(
                              singleOrderDetail.createdAt,
                              "getInIso"
                            )
                          : ""}
                        <br />
                        <strong>Delivery Date</strong>:{" "}
                        {singleOrderDetail?.DesiredDate}
                        <br />
                        <strong>Currency</strong>:{" "}
                        {singleOrderDetail?.Supplier?.Currency}
                        <br />
                        <br />
                        <div
                          className="section_heading"
                          style={{ padding: "10px 0px" }}
                        >
                          <strong>Ship To :</strong>
                        </div>
                        {singleOrderDetail?.ShippingAddress}
                        <br />
                      </td>
                    </tr>
                  </table>
                  {/* <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="reference_section"
                  >
                    <thead>
                      <tr>
                        <td>Reference :</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PO_Comments</td>
                      </tr>
                    </tbody>
                  </table> */}
                  <table
                    className="custom_table"
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                  >
                    <thead>
                      <tr>
                        <th width="5%">Sr</th>
                        <th width="40%">Item Description</th>
                        <th width="8%">Qty.</th>
                        {/* <th width="10%">Dispatch QTY</th>
                        <th width="10%">Dispatch Value</th>
                        <th width="10%">Pending QTY</th>
                        <th width="10%">Pending Value</th> */}
                        <th width="15%">Price/Unit</th>
                        <th width="15%">Amount - €</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productArr.length > 0 &&
                        productArr.map((item, index) => {
                          return (
                            <>
                              <PurchaseOrderProductList
                                item={item}
                                index={index}
                              />
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                  <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="1"
                    className="total_value_section"
                  >
                    <tbody>
                      <tr className="">
                        <td width="70%" className="word_value">
                          <strong>Remarks :</strong> This are remarks
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="total_value_label"
                        >
                          <strong>Sub Total</strong>
                        </td>
                        <td width="15%" align="right" className="total_value">
                          <strong>{getLocaleString(breakupDetails?.subTotal)}</strong>
                        </td>
                      </tr>
                      <tr>
                        {/* <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Tax
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails?.tax}
                        </td> */}
                      </tr>
                      <tr>
                        <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Shipping Charge
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails.shippingCharge}
                        </td>
                      </tr>
                      {/* <tr>
                        <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Delivery Charge
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails.shippingCharge}
                        </td>
                      </tr> */}
                      {/* <tr>
                        <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Discount
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails.disconut}
                        </td>
                      </tr> */}
                      <tr className="">
                        <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="total_value_label"
                        >
                          <strong>Total</strong>
                        </td>
                        <td width="15%" align="right" className="total_value">
                          <strong>{getLocaleString(breakupDetails.grandTotal)}</strong>
                        </td>
                      </tr>
                      {/* <tr>
                        <td width="" align="right" className=""></td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Pending Value
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails?.pendingDispatchValue}
                        </td>
                      </tr> */}
                      <tr>
                        <td width="70%" align="left">
                          {/* <strong>Total Value In Words :</strong>
                          <br />
                          <div className="editor_text">
                            Currency amountINWords
                          </div> */}
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_label"
                        >
                          Payment Method
                        </td>
                        <td
                          width="15%"
                          align="right"
                          className="gst_bg gst_value"
                        >
                          {breakupDetails.paymentMethod}
                        </td>
                      </tr>
                      {/* <tr>
                        <td width="70%" align="left">
                          <strong>Total Value In Words :</strong>
                          <br />
                          <div className="editor_text">
                            Currency amountINWords
                          </div>
                        </td>
                        <td width="15%" align="right" className="total_value_label">
                          <strong>Total €</strong>
                        </td>
                        <td width="15%" align="right" className="total_value">
                          <strong>{singleOrderDetail?.Total || this.getTotal(singleOrderDetail?.SubTotal, 0, 0)}</strong>
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                  <hr />
                  <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="end_note"
                  >
                    <tbody>
                      <tr>
                        <td width="100%">
                          Kindly acknowledge the receipt and acceptance of this
                          purchase Order
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="authorized_signatory"
                  >
                    <tbody>
                      <tr>
                        <td width="70%">
                          <strong>
                            For & On behalf of <br />
                            Paperbird
                          </strong>
                          <br />
                          <br />
                          <br />
                          <br />
                          <strong>Authorized Signatory.</strong>
                          <br />
                        </td>
                        <td width="30%" align="right">
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <strong>Authorized Signatory.</strong>
                          <br />
                        </td>
                      </tr>
                    </tbody>
                  </table> */}
                  {/* <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="end_note"
                  >
                    <tbody>
                      <tr>
                        <td width="70%">
                          <strong>Note : </strong>
                          <br />
                          (1) Please state our order number in all
                          correspondence. <br />
                          (2) This order has to be read in conjunction with our
                          attached General Terms of Purchase for the supply of
                          Goods and Services Edition 04/2010 which will be
                          available on request.
                          <br />
                          (3) Seller shall provide Order Acceptance within 7
                          days from the date of receipt of order othewise Order
                          deemed to be accepted by Seller.
                          <br />
                          (4) Material Without Invoice shall not be accepted .{" "}
                          <br />
                          (5) Seller shall specify Order No.in Invoice &
                          Delivery Note.
                        </td>
                      </tr>
                    </tbody>
                  </table> */}
                  {/* <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                  >
                    <tbody>
                      <tr>
                        <td width="70%">End of Order</td>
                      </tr>
                    </tbody>
                  </table> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    );
  }
}
