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
    const { productArr, singleInquiryDetail, SelectedSupplier, supplierArr } =
      this.props.data;

    // console.log("productArr ==== ", productArr);
    // console.log("singleInquiryDetail ===== ", singleInquiryDetail);
    // console.log("SelectedSupplier ==== ", SelectedSupplier);

    // console.log("supplierArr ==== ", supplierArr);

    const supDetails = productArr?.[0]?.Supplier;
    const singleQuotation = singleInquiryDetail?.Quotation_Masters?.filter(
      (item) => item?.SupplierID === SelectedSupplier?.ID
    )[0];

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
                  </header>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {/* <table
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
                  </table> */}
                  <table
                    border="0"
                    width="100%"
                    cellpadding="5"
                    cellspacing="0"
                    className="section_title"
                  >
                    <tr>
                      {/* {SelectedSupplier ? (
                        <td width="33%" className="section_heading">
                          Supplier :
                        </td>
                      ) : null} */}
                      <td width="30%" className="section_heading">
                        Customer :
                      </td>
                      <td width="50%" className="section_heading">
                        Inquiry Remarks :
                      </td>
                      <td width="20%" className="section_heading">
                        Other :
                      </td>
                    </tr>
                    <tr>
                      {/* {SelectedSupplier ? (
                        <td>
                          <strong>{SelectedSupplier?.SupplierName}</strong>
                          <br />
                          {SelectedSupplier?.Address}
                          <br />
                          {SelectedSupplier?.City?.City} –{" "}
                          {SelectedSupplier?.ZipCode}
                          <br />
                          {SelectedSupplier?.State?.State} -{" "}
                          {SelectedSupplier?.Country?.Country} <br />
                          <strong>Phone : </strong>
                          {SelectedSupplier?.Number}
                          <br />
                          <strong>Email : </strong>
                          {SelectedSupplier?.Email}
                          <br />
                          <strong>GST No. : </strong>
                          <br />
                          <strong>PAN No. : </strong>
                          <br />
                          <br />
                          <strong>Kind Attention : </strong>
                          <br />
                          ContactPerson: {SelectedSupplier?.ContactPersonName}
                        </td>
                      ) : null} */}

                      <td>
                        <strong>
                          {singleInquiryDetail?.Customer?.CustomerName}
                        </strong>
                        <br />
                        {/* {singleOrderDetail?.ShippingAddress}
                        <br />
                        delivery_city – delivery_Pincode
                        <br />
                        delivery_state - delivery_country
                        <br /> */}
                        <strong>Phone : </strong>
                        {singleInquiryDetail?.Customer?.Phone || "-"}
                        <br />
                        <strong>Email : </strong>
                        {singleInquiryDetail?.Customer?.Email || "-"}
                        {/* <br />
                        <strong>GST No. : </strong> <br />
                        <strong>CIN No. : </strong> <br />
                        <strong>PAN No. : </strong> */}
                      </td>
                      <td>{singleInquiryDetail?.Remarks}</td>
                      <td>
                        <strong className="text-uppercase">
                          Status : {singleInquiryDetail?.Status}
                        </strong>
                      </td>
                      {/* <td>
                        <strong>Quotation No : </strong>
                        {singleQuotation?.QuotationNo || "-"}
                        <br />
                        <strong>Quotation Date : </strong>

                        {singleQuotation?.createdAt
                          ? dateFormatter(
                              singleQuotation?.createdAt,
                              "getInIso"
                            )
                          : "-"}
                      </td> */}
                    </tr>
                  </table>

                  {SelectedSupplier ? (
                    <>
                      <br />
                      <br />
                      <table
                        border="0"
                        width="100%"
                        cellpadding="5"
                        cellspacing="1"
                        className="custom_table"
                      >
                        <thead>
                          <tr>
                            <th colSpan="2">
                              <strong>Supplier Details</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="">
                            <td width="30%" className="word_value">
                              <strong>Supplier Name :</strong>

                              {supDetails?.SupplierName}
                            </td>

                            <td width="30%" className="word_value">
                              <strong>Email :</strong>

                              {supDetails?.Email}
                            </td>
                          </tr>
                          {/* <tr className="">
                            <td width="30%" className="word_value">
                              <strong>Supplier Address :</strong>

                              {supDetails?.Address}
                            </td> 
                            <td width="30%" className="word_value">
                              <strong>Phone :</strong>

                              {supDetails?.Phone}
                            </td>
                          </tr> */}
                          <tr className="">
                            <td width="30%" className="word_value">
                              <strong>Quotation No :</strong>

                              {singleQuotation?.QuotationNo || "-"}
                            </td>
                            <td width="30%" className="word_value">
                              <strong>Quotation Date :</strong>

                              {singleQuotation?.createdAt
                                ? dateFormatter(
                                    singleQuotation?.createdAt,
                                    "getInIso"
                                  )
                                : "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <br />
                      <br />
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
                            <th width="15%">
                              <strong>Item Description</strong>
                            </th>

                            <th width="10%">
                              <strong>Qty.</strong>
                            </th>
                            <th width="10%">
                              <strong>Price Per Unit</strong>
                            </th>
                            <th width="10%">
                              <strong>Amount</strong>
                            </th>
                            <th width="10%">
                              <strong>Expected Date</strong>
                            </th>
                            <th width="10%">
                              <strong>Expected Delivery Date</strong>
                            </th>
                            <th width="20%">
                              <strong>Terms</strong>
                            </th>
                            <th width="20%">
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
                            })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    supplierArr.map((item, index) => (
                      <>
                        <br />
                        <br />
                        <table
                          border="0"
                          width="100%"
                          cellpadding="5"
                          cellspacing="1"
                          className="custom_table pt-5"
                        >
                          <thead>
                            <tr>
                              <th colSpan="2">
                                <strong>{index + 1}. Supplier Details</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="">
                              <td width="30%" className="word_value text-left">
                                <strong>Supplier Name :</strong>

                                {item?.SupplierName}
                              </td>

                              <td width="30%" className="word_value text-left">
                                <strong>Email :</strong>

                                {item?.Email}
                              </td>
                            </tr>
                            {/* <tr className="">
                               <td width="30%" className="word_value text-left">
                                <strong>Supplier Address :</strong>

                                {item?.Address}
                              </td>
                              <td width="30%" className="word_value text-left">
                                <strong>Phone :</strong>

                                {item?.Phone}
                              </td>
                            </tr> */}
                            <tr className="">
                              <td width="30%" className="word_value text-left">
                                <strong>Quotation No :</strong>

                                {singleInquiryDetail?.Quotation_Masters?.filter(
                                  (quo) => quo?.SupplierID === item?.ID
                                )[0]?.QuotationNo || "-"}
                              </td>
                              <td width="30%" className="word_value">
                                <strong>Quotation Date :</strong>

                                {singleInquiryDetail?.Quotation_Masters?.filter(
                                  (quo) => quo?.SupplierID === item?.ID
                                )[0]?.createdAt
                                  ? dateFormatter(
                                      singleInquiryDetail?.Quotation_Masters?.filter(
                                        (quo) => quo?.SupplierID === item?.ID
                                      )[0]?.createdAt,
                                      "getInIso"
                                    )
                                  : "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br />
                        <br />
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
                              <th width="15%">
                                <strong>Item Description</strong>
                              </th>

                              <th width="10%">
                                <strong>Qty.</strong>
                              </th>
                              <th width="10%">
                                <strong>Price Per Unit</strong>
                              </th>
                              <th width="10%">
                                <strong>Amount</strong>
                              </th>
                              <th width="10%">
                                <strong>Expected Date</strong>
                              </th>
                              <th width="10%">
                                <strong>Expected Delivery Date</strong>
                              </th>
                              <th width="20%">
                                <strong>Terms</strong>
                              </th>
                              <th width="20%">
                                <strong>Remarks</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productArr.length > 0 &&
                              productArr.map((product, index) => {
                                if (product?.SupplierID == item.ID) {
                                  return (
                                    <CustomerInquiryProductList
                                      item={product}
                                      index={index}
                                    />
                                  );
                                }
                              })}
                          </tbody>
                        </table>
                      </>
                    ))
                  )}

                  {/* <table
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
                      </tr>
                    </tbody>
                  </table> */}
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

                          <br />
                        </td>
                        <td width="30%" align="right">
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />

                          <br />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    );
  }
}
