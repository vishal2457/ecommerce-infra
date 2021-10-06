import React, { useEffect, useRef, useState, useContext } from "react";
import dynamic from "next/dynamic";
import OrderDetail from "../components/MyOrder/OrderDetail/OrderDetail";
import OrderList from "../components/MyOrder/OrderList/OrderList";
import Header from "../layout/Header";
import api from "../Redux/api";
import PdfWrapper from "../Pdf/PdfWrapper";
import PurchaseOrder from "../Pdf/PurchaseOrder";
import { useReactToPrint } from "react-to-print";
import NoOrders from "../components/MyOrder/NoOrders";
import { AuthContext } from "../contexts/auth/auth.context";
import { useDispatch, useSelector } from "react-redux";
import { startChat } from "../Redux/Chat/action";
// import Conditional from "../components/Shared/Conditional";
// import ContentLoader from "react-content-loader";

const Chat = dynamic(() =>
  import("../components/Chat/Chat").then((mod) => mod.Chat)
);
const Footer = dynamic(() => import("../layout/Footer"));
let limit = 15;

function MyOrders() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useContext(AuthContext)?.authState;
  const {socket} = useSelector((state) => state?.Chat);

  let userData = React.useMemo(() => {
    return user ? JSON.parse(user) : null;
  }, [user]);

  const componentRef = useRef(); //component refernce
  const [orderList, setorderList] = useState([]); //all orders list
  const [activeOrder, setactiveOrder] = useState(0); //seleceted order
  const [productArr, setproductArr] = useState([]);
  const [loadingProducts, setloadingProducts] = useState(true); //loader for loading single products
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [orderSearch, setorderSearch] = useState(false); //toggle order search bar
  const [chatData, setchatData] = useState([]);

  const getCustomerOrders = () => {
    api.post("/order/getCustomerOrders", { limit, page: 1 }).then((res) => {
      if (res?.data?.status) {
        setorderList(res?.data?.data?.rows);

        if (res?.data?.data?.rows?.length) {
          changeActivetab(null, res?.data?.data?.rows[0]?.ID);
        }
      }
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCustomerOrders();
    }

    return () => {};
  }, []);

  /**
   * @param {number} index index of to be selected order
   * @param {number} ID id of to be selected order
   * @changes selected tab
   */
  function changeActivetab(index, ID) {
    if (index == activeOrder) return;
    if (index != null) setactiveOrder(index);
    setloadingProducts(true);
    api
      .get(`/order/getSingleCustomerOrder/${ID ? ID : orderList[index]?.ID}`)
      .then((res) => {
        if (res?.data?.status) {
          setproductArr(res?.data?.data);
          setloadingProducts(false);
        }
      })
      .catch((err) => {
        setloadingProducts(false);
        console.log(err);
      });
  }

  function toggleOrderSearch() {
    setorderSearch(!orderSearch);
  }

  /**
   * @param {object} item details
   * @param {number} i add chat
   */
  const addChat = (item, index) => {
    let supplier = orderList[index]?.Supplier;
    let obj = {
      ID: `${userData?.reference_id}-${supplier?.ID}`,
      SupplierID: supplier?.ID,
      SupplierName: supplier?.SupplierName,
      CustomerID: userData?.reference_id,
      UserID: userData?.id,
      Username: userData?.name,
      UserEmail: userData?.email,
    };
    dispatch(startChat(obj, socket));
  };

  //remove chat
  const removeChat = (i) => {
    chatData.splice(i, 1);
    setchatData([...chatData]);
  };

  /**
   * @Confirm_Order_Recieved
   */

  const orderReceived = async ({ DispatchID, PoDetailID, PoDetailStatus }) => {
    let { OrderStatus, ID } = orderList[activeOrder];
    const swal = (await import("sweetalert2")).default;
    swal
      .fire({
        title: "Are you sure ?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .post("/dispatch/orderReceived", {
              DispatchID,
              PoID: ID,
              PoDetailID,
              PoStatus: OrderStatus,
              PoDetailStatus,
            })
            .then((res) => {
              // call method to reflect changes
              getCustomerOrders();
              //console.log(res.data);
              swal.fire({
                title: res.data.msg,
                icon: "info",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  };

  return (
    <>
      <Header />
      <div className="container">
        {orderList.length ? (
          <div className="row">
            <OrderList
              orderSearch={orderSearch}
              toggleOrderSearch={toggleOrderSearch}
              orders={orderList}
              activeOrder={activeOrder}
              changeActivetab={changeActivetab}
              loading={loadingProducts}
            />
            <OrderDetail
              singleOrderDetail={orderList[activeOrder]}
              handlePrint={handlePrint}
              productArr={productArr}
              loading={loadingProducts}
              addChat={addChat}
              orderReceived={orderReceived}
            />
          </div>
        ) : (
          <NoOrders />
        )}
      </div>
      <PdfWrapper>
        <PurchaseOrder
          ref={componentRef}
          data={{
            productArr: productArr,
            singleOrderDetail: orderList[activeOrder],
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

export default MyOrders;
