import React from "react";
import { Button, Card, CardBody, CardHeader } from "../../UI";
import {
  dateFormatter,
} from "../../../utility/commonUtility";

function InquiryCard({ inquiryDetail, active, changeActivetab, index }) {
  const { Quotation_Masters } = inquiryDetail;
  //const quotationMaster = Quotation_Masters?.length ? Quotation_Masters : null;

  const getTotal = () => {
    return parseFloat(inquiryDetail?.SubTotal) + 0 + 0;
  };

  const total = React.useMemo(() => {
    return getTotal();
  }, [inquiryDetail?.Total, inquiryDetail?.SubTotal]);

  return (
    <Card
      className={`orderCard  pointer ${active ? "activeOrder" : ""}`}
      onClick={() => changeActivetab(index)}
    >
      <CardHeader className="p-0">
        <div className="d-flex justify-content-between">
          <p className="mb-0" style={{ lineHeight: "14px" }}>
            Inquiry #{inquiryDetail?.InquiryNo}
            <br />
            Inquired on&nbsp;
            {dateFormatter(inquiryDetail?.updatedAt, "getInIso")}
            <br />
            By &nbsp;{inquiryDetail?.User_Master?.UserName || "-"}
          </p>
          <p
            className={`mb-0 px-1 singleOrder-${
              inquiryDetail?.Status == "draft"
                ? "Pending"
                : inquiryDetail?.Status == "sent"
                ? "Confirm"
                : "Reject"
            }`}
          >
            {inquiryDetail?.Status == "draft"
              ? "DRAFT"
              : inquiryDetail?.Status == "sent"
              ? "SENT"
              : "CANCEL"}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="d-flex justify-content-between mx-2">
          <p class="mb-2">Valid Till Date: </p>
          <p class="font-weight-bold">
            {dateFormatter(inquiryDetail?.ValidTill, "getInIso")}
          </p>
        </div>

        <div className="d-flex justify-content-between mx-2">
          <p class="mb-2">Quotation: </p>

          <p
            class={`font-weight-bold text-${
              inquiryDetail?.Status == "draft"
                ? "muted"
                : inquiryDetail?.Status == "cancel"
                ? "danger"
                : Quotation_Masters?.length
                ? "success"
                : "primary"
            }`}
          >
            {inquiryDetail?.Status == "draft"
              ? "Need To Send Inquiry"
              : inquiryDetail?.Status == "cancel"
              ? "Cancel"
              : Quotation_Masters?.length
              ? `${Quotation_Masters?.length} Suppliers Quoted`
              : "Pending"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default InquiryCard;
