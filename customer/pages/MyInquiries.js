import React, { useEffect, useState, useRef, useContext } from "react";
import dynamic from "next/dynamic";

import Footer from "../layout/Footer";
import Header from "../layout/Header";

// import { Button } from "../components/UI";
// import Image from "../components/image/image";
// import Link from "next/link";
import api from "../Redux/api";
import { useReactToPrint } from "react-to-print";
import PdfWrapper from "../Pdf/PdfWrapper";
import swal from "sweetalert2";

import InquiryDetail from "../components/MyInquiries/InquiryDetail/InquiryDetail";
import InquiryList from "../components/MyInquiries/InquiryList/InquiryList";
import NoInquiry from "../components/MyInquiries/NoInquiry";
import CustomerInquiry from "../Pdf/CustomerInquiry";
import { AuthContext } from "../contexts/auth/auth.context";
import { useRouter } from "next/router";
import { showAlert } from "../utility/commonUtility";

const Chat = dynamic(() =>
  import("../components/Chat/Chat").then((mod) => mod.Chat)
);

function MyInquiries() {
  const router = useRouter();

  //console.log("router === ", router);

  const { authState } = useContext(AuthContext);

  const [inquiryList, setinquiryList] = useState([]);
  const [inputData, setinputData] = useState({
    ValidTill: null,
    Remarks: null,
    DeliveryAddress: null,
  });

  const componentRef = useRef();
  const [activeInquiry, setactiveInquiry] = useState(0);
  const [productArr, setproductArr] = useState([]);
  const [SelectedSupplier, setSelectedSupplier] = useState(null);

  const [supplierArr, setsupplierArr] = useState([]);
  const [productArrClone, setproductArrClone] = useState([]);
  const [loadingProducts, setloadingProducts] = useState(true);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [inquirySearch, setinquirySearch] = useState(false);
  const [chatData, setchatData] = useState([]);
  const [customerGroups, setcustomerGroups] = useState([]);

  const [AddressArr, setAddressArr] = useState([]);
  const [selectedID, setselectedID] = useState([]);

  let limit = 20;

  useEffect(() => {
    if (authState.isAuthenticated) {
      getCustomerInquiries();
      getCustomerGroups();
      getAllAdddress();
    }

    return () => {};
  }, []);

  async function getCustomerGroups() {
    /**
     * @Get_Customer_Groups
     */
    await api
      .get("/CustomerGroups/getAllGroupsForCustomer")
      .then((res) => {
        setcustomerGroups(res.data.data);
      })
      .catch((err) => {
        console.log(err, "get customer error");
        setcustomerGroups([]);
      });
  }

  const getCustomerInquiries = () => {
    api
      .post("/inquiry/getCustomerInquiries", { limit, page: 1 })
      .then((res) => {
        if (res?.data?.status) {
          setinquiryList(res?.data?.data?.rows);

          if (res?.data?.data?.rows?.length) {
            //setselectedID(res?.data?.data?.rows[0]?.Customer_Address);
            changeActivetab(
              null,
              res?.data?.data?.rows[0]?.ID,
              res?.data?.data?.rows[0]?.Quotation_Masters.length
                ? res?.data?.data?.rows[0]?.Quotation_Masters.map(
                    (item) => item.ID
                  )
                : null,
              res?.data?.data?.rows[0]?.Customer_Address
            );
          }
        }
      });
    return () => {};
  };

  const getAllAdddress = () => {
    api
      .get("/address/getAll")
      .then((res) => {
        if (res?.data?.status) {
          setAddressArr(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function changeActivetab(index, ID, quotID, obj) {
    if (index == activeInquiry) return;
    if (index != null) setactiveInquiry(index);
    // if (index == null && !ID) return; //if search result emtpy
    setloadingProducts(true);
    setSelectedSupplier(null);
    if (obj) {
      setselectedID(obj);
    } else {
      setselectedID(
        AddressArr.filter(
          (item) => item?.ID == inquiryList[index]?.AddressID
        )[0]
      );
    }

    api
      .post("/inquiry/getSingleCustomerInquiry", {
        InquiryID: ID ? ID : inquiryList[index]?.ID,
        QuotationID: quotID
          ? quotID
          : inquiryList[index]?.Quotation_Masters.length
          ? inquiryList[index]?.Quotation_Masters.map((item) => item.ID)
          : null,
      })
      .then((res) => {
        if (res?.data?.status) {
          setproductArr(res?.data?.data?.inquiryDetail);
          setproductArrClone(res?.data?.data?.inquiryDetail);
          setsupplierArr(res?.data?.data?.supplierArr);
          setloadingProducts(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function toggleInquirySearch() {
    setinquirySearch(!inquirySearch);
  }

  const addChat = (i) => {
    if (chatData.some((e) => e.id == i)) {
      var tempArr = chatData.filter((c) => {
        return c.id != i;
      });
      setchatData(tempArr);
    } else {
      let obj = {
        id: i,
        name: inquiryList[i]?.Supplier?.SupplierName,
        no: "EU123",
      };

      chatData.unshift(obj);
      if (chatData.length > 3) chatData.pop();
      setchatData([...chatData]);
    }
  };

  const removeChat = (i) => {
    chatData.splice(i, 1);
    setchatData([...chatData]);
  };

  const handleValidTillChange = (e) => {
    setinputData({
      ...inputData,
      ValidTill: e.target.value,
    });
  };

  const handleRemarksChange = (e) => {
    setinputData({
      ...inputData,
      Remarks: e.target.value,
    });
  };

  const handleDeliveryAddressChange = (e) => {
    setinputData({
      ...inputData,
      DeliveryAddress: e.target.value,
    });
  };

  const updateInquiry = async (id) => {
    let postData = {};

    for (const [key, value] of Object.entries(inputData)) {
      // if(key == 'ExpectedDate' && !value){
      //   return;
      // }

      value ? (postData[key] = value) : null;
    }

    postData.AddressID = selectedID?.ID;
    postData.DeliveryAddress =
      selectedID?.Address +
      ", " +
      selectedID?.["City.City"] +
      ", " +
      selectedID?.["State.State"] +
      ", " +
      selectedID?.["Country.Country"] +
      ", " +
      selectedID?.ZipCode;
    api
      .post(`/inquiry/updateInquiryMaster/${id}`, { postData })
      .then((res) => {
        console.log("updated Res.....", res);
        getCustomerInquiries();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  const sendInquiry = async (id) => {
    //console.log("Sending Inquiry....", supplierArr);

    swal
      .fire({
        title: "Send Inquiry?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Yes",
      })
      .then((data) => {
        if (!data.isConfirmed) return;
        api
          .post("/inquiry/updateInquiryStatusSent", {
            InquiryID: id,
            supplierArr: supplierArr.map((item) => item?.ID),
          })
          .then((res) => {
            console.log("updated Res.....", res);
            getCustomerInquiries();
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong");
          });
      });
  };

  const cancelInquiry = async (id) => {
    //console.log("Cancel Inquiry....", id);

    swal
      .fire({
        title: "Calcel Inquiry?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Yes",
      })
      .then((data) => {
        if (!data.isConfirmed) return;

        api
          .post(`/inquiry/cancelInquiryStatusCancel/${id}`)
          .then((res) => {
            console.log("updated Res.....", res);
            getCustomerInquiries();
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong");
          });
      });
  };

  //START inquiry item methods

  const deleteInquiryItem = async (id) => {
    swal
      .fire({
        title: "Delete Inquiry Item?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Yes",
      })
      .then((data) => {
        if (!data.isConfirmed) return;

        api
          .post(`/inquiry/deleteInquiryItem/${id}`)
          .then((res) => {
            console.log("delete Res.....", res);
            getCustomerInquiries();
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong");
          });
      });
  };

  const updateItem = (updatedData, id, productId) => {
    // console.log("updatedData...", updatedData.Unit, id, productId);
    // console.log("productArr...", productArr);

    let check = productArr.filter(
      (item) =>
        item.ID != id &&
        item.ProductID == productId &&
        item.Unit == updatedData.Unit
    );

    // console.log("check === ", check);
    if (check.length) {
      //same record already present
      return showAlert("Item Already Present-info");
    }
    let postData = {};

    for (const [key, value] of Object.entries(updatedData)) {
      // if(key == 'ExpectedDate' && !value){
      //   return;
      // }

      value ? (postData[key] = value) : null;
    }

    if (Object.entries(postData).length) {
      api
        .post(`/inquiry/updateInquiryItem/${id}`, { postData })
        .then((res) => {
          console.log("updated Item.....", res);
          getCustomerInquiries();
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong");
        });
    }
  };

  // END inquiry item methods
  const onSupplierChange = (data) => {
    if (data) {
      setSelectedSupplier(data);
      let products = productArrClone.filter(
        (item) => item?.Supplier?.ID === data?.ID
      );
      setproductArr(products);
    } else {
      setSelectedSupplier(null);
      setproductArr(productArrClone);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        {inquiryList.length ? (
          <div className="row">
            <div className="col-md-4">
              <InquiryList
                inquirySearch={inquirySearch}
                toggleInquirySearch={toggleInquirySearch}
                inquiries={inquiryList}
                activeInquiry={activeInquiry}
                changeActivetab={changeActivetab}
                loading={loadingProducts}
              />
            </div>
            <div className="col-md-8 pl-2">
              <div className="row">
                <div className="col-12">
                  <InquiryDetail
                    singleInquiryDetail={inquiryList[activeInquiry]}
                    handlePrint={handlePrint}
                    productArr={productArr}
                    loading={loadingProducts}
                    addChat={addChat}
                    handleValidTillChange={handleValidTillChange}
                    handleRemarksChange={handleRemarksChange}
                    handleDeliveryAddressChange={handleDeliveryAddressChange}
                    inputData={inputData}
                    updateInquiry={updateInquiry}
                    sendInquiry={sendInquiry}
                    cancelInquiry={cancelInquiry}
                    customerGroups={customerGroups}
                    itemMethods={{
                      updateItem: updateItem,
                      deleteItem: deleteInquiryItem,
                    }}
                    AddressArr={AddressArr}
                    selectedID={selectedID}
                    setselectedID={setselectedID}
                    getAllAdddress={getAllAdddress}
                    onSupplierChange={onSupplierChange}
                    supplierArr={supplierArr}
                    SelectedSupplier={SelectedSupplier}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NoInquiry />
        )}
      </div>
      <PdfWrapper>
        <CustomerInquiry
          ref={componentRef}
          data={{
            productArr: productArr,
            singleInquiryDetail: inquiryList[activeInquiry],
            SelectedSupplier: SelectedSupplier,
            supplierArr: supplierArr,
          }}
        />
      </PdfWrapper>
      <Footer />

      {chatData.length ? (
        <Chat chatData={chatData} removeChat={removeChat} />
      ) : null}
    </>
  );
}

export default MyInquiries;
