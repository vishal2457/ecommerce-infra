import React from "react";
import { Input } from "../../UI";
import ProductCard from "./ProductCard";

function StepThree({
  products,
  submitInquiry,
  inputData,
  handleInputs,
  commonHandleInputs,
  commonInputData,
}) {
  let inquiryStatus = {
    sent: "sent",
    draft: "draft",
  };

  return (
    <React.Fragment>
      <h3>Generate Inquiry</h3>
      <div className="row mt-4">
        <div className="col-md-2">
          <label>Inquiry No.</label>
          <p>#{commonInputData?.inquiryNo}</p>
        </div>
        <div className="col-md-2">
          <label>Current Date</label>
          {/* <p>{`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} `}</p> */}
          <p>{new Date().toLocaleString() + ''}</p>
        </div>
        <div className="col-md-2">
          <div className="form-group---">
            <label>
              Inquiry Valid Till <span className="error-text">*</span>
            </label>
            <Input
              type="date"
              value={commonInputData?.ValidTill || ""}
              onChange={commonHandleInputs?.commonValidTill}
            />
            <span className="error-text">
              {commonInputData?.validTillReqMsg}
            </span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group---">
            <label>Remarks</label>
            <Input
              type="textarea"
              rows="1"
              value={commonInputData?.Remarks || ""}
              onChange={commonHandleInputs?.commonRemarks}
            />
          </div>
        </div>
      </div>
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
                  <th className="text-center">Qty.</th>
                  <th className="text-center">Unit</th>
                  <th className="text-left">Expected Till</th>
                  <th className="text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((item, index) => {
                    return (
                      <ProductCard
                        data={item}
                        key={index}
                        inputData={inputData}
                        handleInputs={handleInputs}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-12 text-right">
          <button
            className="btn btn-red btn-outline mr-2"
            onClick={() => submitInquiry(inquiryStatus.draft)}
          >
            Save Draft
          </button>
          <button
            className="btn btn-red"
            onClick={() => submitInquiry(inquiryStatus.sent)}
          >
            Send Inquiry
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default StepThree;
