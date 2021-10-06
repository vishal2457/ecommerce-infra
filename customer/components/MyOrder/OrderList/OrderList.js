import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import { CgSearch } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { Card, CardHeader } from "../../UI";
import ContentLoader from "react-content-loader";

function OrderList({
  orders,
  activeOrder,
  changeActivetab,
  orderSearch,
  toggleOrderSearch,
  setpendingDispatchValue,
  pendingDispatchValue,
  loading,
}) {
  const [tempOrders, settempOrders] = useState([]);
  const [initialTimeout, setinitialTimeout] = useState(null);

  useEffect(() => {
    settempOrders(orders);
    return () => {};
  }, [orders]);

  useEffect(() => {
    //check to reduce an api call if search input empty
    if (tempOrders.length != orders.length) {
      settempOrders(orders);
      changeActivetab(null, orders[0]?.ID);
    }
    return () => {
      // console.log(tempOrders)
    };
  }, [orderSearch]);

  //search order list with fuse
  async function onSearch({ currentTarget }) {
    const Fuse = (await import("fuse.js")).default;
    const fuse = new Fuse(orders, {
      keys: ["PurchaseOrderNo"],
      includeScore: true,
    });

    const results = fuse.search(currentTarget.value);

    if (!currentTarget.value) {
      settempOrders(orders);
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        changeActivetab(null, orders[0]?.ID);
      }, 400);
      setinitialTimeout(timeout);
    } else {
      settempOrders(results.map((character) => character.item));
      clearTimeout(initialTimeout);
      let timeout = setTimeout(() => {
        changeActivetab(null, results[0]?.item?.ID);
      }, 400);
      setinitialTimeout(timeout);
    }
  }

  return (
    <div className="col-md-4">
      {loading ? (
        // <p className="text-center">Data Not Found</p>

        <>
          {[1, 2, 3].map((item, index) => {
            return (
              <div className="col-md-4" key={index}>
                <ContentLoader
                  width={300}
                  height={150}
                  viewBox="0 0 450 200"
                  backgroundColor="#f0f0f0"
                  foregroundColor="#dedede"
                >
                  <rect
                    x="0"
                    y="0"
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
            <div className="col-md-5">
              <p className="lead mb-0 font-weight-bold">My Orders</p>
            </div>
            <div className="col-md-7">
              {orderSearch ? (
                <div className="filter-search">
                  <div className="input-group">
                    <span class="input-group-text" id="basic-addon1">
                      #
                    </span>
                    <input
                      className="form-control"
                      name="search"
                      type="number"
                      placeholder="Search Order No."
                      onChange={onSearch}
                      autoFocus
                    />
                  </div>
                  <span
                    className="filterSearchBox text-center pt-1 pointer"
                    onClick={toggleOrderSearch}
                  >
                    <FaTimes className="pointer" size={15} />{" "}
                  </span>
                </div>
              ) : (
                <div className="filter-search">
                  <div
                    className="filterSearchBox text-center pt-1 pointer"
                    onClick={toggleOrderSearch}
                  >
                    <CgSearch size={15} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-scroll m-0 p-0">
            {tempOrders.length != 0 ? (
              tempOrders.map((item, index) => {
                return (
                  <>
                    <OrderCard
                      orderDetail={item}
                      active={activeOrder == index}
                      changeActivetab={changeActivetab}
                      index={index}
                      setpendingDispatchValue={setpendingDispatchValue}
                      pendingDispatchValueState={pendingDispatchValue}
                    />
                  </>
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

export default OrderList;
