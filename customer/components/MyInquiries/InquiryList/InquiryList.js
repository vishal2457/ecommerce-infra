import React, { useState, useEffect } from "react";
import InquiryCard from "./InquiryCard";
import { CgSearch } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { Card, CardBody, CardHeader } from "../../UI";
import ContentLoader from "react-content-loader";

function InquiryList({
  inquirySearch,
  toggleInquirySearch,
  inquiries,
  activeInquiry,
  changeActivetab,
  sendInquiry,
  cancelInquiry,
  loading,
}) {
  const [tempInquiries, settempInquiries] = useState([]);
  const [initialTimeout, setinitialTimeout] = useState(null);

  useEffect(() => {
    settempInquiries(inquiries);
    return () => {};
  }, [inquiries]);

  useEffect(() => {
    //check to reduce an api call if search input empty
    if (tempInquiries.length != inquiries.length) {
      settempInquiries(inquiries);

      //console.log(inquiries);
      changeActivetab(
        null,
        inquiries[0]?.ID,
        inquiries[0]?.Quotation_Masters.length
          ? inquiries[0]?.Quotation_Masters[0].ID
          : null
      );
    }
    return () => {
      // console.log(tempInquiries)
    };
  }, [inquirySearch]);

  //search inquiry list with fuse
  async function onSearch({ currentTarget }) {
    const Fuse = (await import("fuse.js")).default;
    const fuse = new Fuse(inquiries, {
      keys: ["InquiryNo"],
      includeScore: true,
    });

    const results = fuse.search(currentTarget.value);

    if (!currentTarget.value) {
      settempInquiries(inquiries);
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        changeActivetab(null, inquiries[0]?.ID);
      }, 400);
      setinitialTimeout(timeout);
    } else if (!results.length) {
      settempInquiries([]);
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        changeActivetab(null, inquiries[0]?.ID);
      }, 400);
      setinitialTimeout(timeout);
    } else {
      settempInquiries(results.map((character) => character.item));
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        changeActivetab(null, results[0]?.item?.ID);
      }, 400);
      setinitialTimeout(timeout);
    }
  }

  return (
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
                  <rect
                    x="42"
                    y="77"
                    rx="10"
                    ry="10"
                    width="450"
                    height="200"
                  />
                </ContentLoader>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-3">
              <p className="lead mb-0 font-weight-bold">My Inquiries</p>
            </div>
            <div className="col-md-9">
              {inquirySearch ? (
                <div className="filter-search">
                  <div className="input-group">
                    <span class="input-group-text" id="basic-addon1">
                      #
                    </span>
                    <input
                      className="form-control"
                      name="search"
                      type="number"
                      placeholder="Search Inquiry No."
                      onChange={onSearch}
                      autoFocus
                    />
                  </div>
                  <span
                    className="filterSearchBox text-center pt-1 pointer"
                    onClick={toggleInquirySearch}
                  >
                    <FaTimes className="pointer" size={15} />{" "}
                  </span>
                </div>
              ) : (
                <div className="filter-search">
                  <div
                    className="filterSearchBox text-center pt-1 pointer"
                    onClick={toggleInquirySearch}
                  >
                    <CgSearch size={15} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-scroll m-0 p-0">
            {tempInquiries.length != 0 ? (
              tempInquiries.map((item, index) => {
                return (
                  <div className="my-3">
                    <InquiryCard
                      inquiryDetail={item}
                      active={activeInquiry == index}
                      changeActivetab={changeActivetab}
                      index={index}
                      sendInquiry={sendInquiry}
                      cancelInquiry={cancelInquiry}
                    />
                  </div>
                );
              })
            ) : (
              <Card className={`orderCard  pointer`}>
                <CardHeader>
                  <p className="text-center">Data Not Found</p>
                </CardHeader>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default InquiryList;
