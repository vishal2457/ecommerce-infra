import React from "react";
import CustomerInquiryProductList from "../components/Pdf/CustomerInquiryProductList";
import { dateFormatter } from "../utility/commonUtility";

export default class CustomerInquiry extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getTotal = (subTotal, tax, shippingCharge) => {
    return parseFloat(subTotal) + parseFloat(tax) + parseFloat(shippingCharge);
  };

  render() {
    const { productArr, singleInquiryDetail } =
      this.props.data;

      console.log(productArr, singleInquiryDetail);
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
                                  <strong>Inquiry :</strong>
                                </td>
                                <td>{singleInquiryDetail?.InquiryNo}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Date : </strong>
                                </td>
                                <td>
                                  {singleInquiryDetail?.createdAt
                                    ? dateFormatter(
                                        singleInquiryDetail.createdAt,
                                        "getInIso"
                                      )
                                    : ""}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Format No.</strong>
                                </td>
                                <td></td>
                              </tr>
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
            <tbody>
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
                        Status : {singleInquiryDetail?.Status}
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
                      {/* <td width="33%" className="section_heading">
                        Supplier :
                      </td> */}
                      <td width="33%" className="section_heading">
                        Customer :
                      </td>
                      {/* <td width="34%" className="section_heading">
                        PO Details :
                      </td> */}
                    </tr>
                    <tr>
                      {/* <td>
                        <strong>{singleOrderDetail?.Supplier?.SupplierName}</strong>
                        <br />
                        {singleOrderDetail?.Supplier?.Address}
                        <br />
                        City – {singleOrderDetail?.Supplier?.ZipCode}
                        <br />
                        State - Country <br />
                        <strong>Phone : </strong>{singleOrderDetail?.Supplier?.Number}
                        <br />
                        <strong>Email : </strong>{singleOrderDetail?.Supplier?.Email}
                        <br />
                        <strong>GST No. : </strong>
                        <br />
                        <strong>PAN No. : </strong>
                        <br />
                        <br />
                        <strong>Kind Attention : </strong>
                        <br />
                        ContactPerson: {singleOrderDetail?.Supplier?.ContactPersonName}
                      </td> */}
                      <td>
                        <strong>{singleInquiryDetail?.Customer?.CustomerName}</strong>
                        <br />
                        {/* {singleOrderDetail?.ShippingAddress}
                        <br />
                        delivery_city – delivery_Pincode
                        <br />
                        delivery_state - delivery_country
                        <br /> */}
                        <strong>Phone : </strong>{singleInquiryDetail?.Customer?.Phone || "-"}
                        <br />
                        <strong>Email : </strong>{singleInquiryDetail?.Customer?.Email || "-"}
                        {/* <br />
                        <strong>GST No. : </strong> <br />
                        <strong>CIN No. : </strong> <br />
                        <strong>PAN No. : </strong> */}
                      </td>
                      {/* <td>
                        <strong>PO. No. : </strong>{singleOrderDetail?.PurchaseOrderNo}
                        <br />
                        <strong>Rev No. </strong>: 
                        <br />
                        <strong>Date </strong>: {singleOrderDetail?.createdAt ? dateFormatter(singleOrderDetail.createdAt, "getInIso") : ""}

                        <br />
                        <strong>Delivery Date</strong>: {singleOrderDetail?.DesiredDate}
                        <br />
                        <strong>Currency</strong>: {singleOrderDetail?.Supplier?.Currency}
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
                      </td> */}
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
                        <th width="5%">
                          <strong>Sr</strong>
                        </th>
                        <th width="40%">
                          <strong>Item Description</strong>
                        </th>
                        {/* <th width="12%">
                          <strong>PR No.</strong>
                        </th>
                        <th width="8%">
                          <strong>Cost Center</strong>
                        </th> */}
                        <th width="10%">
                          <strong>Qty.</strong>
                        </th>
                        <th width="10%">
                          <strong>Supplier Name</strong>
                        </th>
                        <th width="10%">
                          <strong>Expected Date</strong>
                        </th>
                        <th width="25%">
                          <strong>Remarks</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productArr.length > 0 &&
                        productArr.map((item, index) => {
                          return (
                            <CustomerInquiryProductList
                              item={item}
                              index={index}
                            />
                          );
                          //   return  <tr>
                          //   <td width="4%" align="center">
                          //     {index+1}
                          //   </td>
                          //   <td width="40%">
                          //     <span>Item Code:</span>{item?.Product_Master?.ProductNo}<br />
                          //     <span>Item Name: {item?.Product_Master?.ProductName}</span>
                          //   </td>
                          //   {/* <td>PR_No</td>
                          //   <td>CostCenter_Name</td> */}
                          //   <td>{item?.Quantity} ({item?.Product_Master?.Measurement_Unit?.MeasurementUnit})</td>
                          //   <td>{item?.Supplier?.SupplierName}</td>
                          //   <td>{item?.ExpectedDate ? dateFormatter(item?.ExpectedDate, "getInIso") : ""}</td>
                          //   <td>{item?.Remarks}</td>
                          // </tr>
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
                          <strong>Remarks :</strong>
                          <br />
                          {singleInquiryDetail?.Remarks}
                        </td>
                        {/* <td width="15%" align="right" className="total_value_label">
                          <strong>Basic Value</strong>
                        </td>
                        <td width="15%" align="right" className="total_value">
                          <strong>{singleOrderDetail?.SubTotal}</strong>
                        </td> */}
                      </tr>
                      {/* <tr>
                        <td width="" align="right" className=""></td>
                        <td width="15%" align="right" className="gst_bg gst_label">
                          (+)CGST CGST_Percent %
                        </td>
                        <td width="15%" align="right" className="gst_bg gst_value">
                          CGST_Value
                        </td>
                      </tr>
                      <tr>
                        <td width="" align="right" className=""></td>
                        <td width="15%" align="right" className="gst_bg gst_label">
                          (+)SGST SGST_Percent %
                        </td>
                        <td width="15%" align="right" className="gst_bg gst_value">
                          SGST_Value
                        </td>
                      </tr>
                      <tr>
                        <td width="" align="right" className=""></td>
                        <td width="15%" align="right" className="gst_bg gst_label">
                          (+)IGST IGST_Percent %
                        </td>
                        <td width="15%" align="right" className="gst_bg gst_value">
                          IGST_Value
                        </td>
                      </tr>
                      <tr>
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
                  <table
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
                          {/* <strong>Authorized Signatory.</strong> */}
                          <br />
                        </td>
                        <td width="30%" align="right">
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          {/* <strong>Authorized Signatory.</strong> */}
                          <br />
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
