import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

function StatusOverlay({
  position,
  trigger,
  children,
  isProduct,
  orderStatusLog,
}) {
  const getMonth = (date) => {
    if (!date) return;
    var dateObj = new Date(date);
    var month = dateObj.toLocaleString("default", { month: "long" });
    return `${month}`;
  };

  const getDate = (date) => {
    if (!date) return;
    var dateObj = new Date(date);
    var day = dateObj.getUTCDate();
    return `${day}`;
  };

  const popover = (
    <Popover id="popover-large" className="orderPopover">
      <Popover.Content className="popover-content">
        {orderStatusLog?.length ? (
          orderStatusLog.map((item, index) => {
            return (
              <div className={`status_box ${item?.OrderStatus}`} key={index}>
                <div className="date">
                  <div style={{ lineHeight: "14px" }}>
                    {getDate(item?.createdAt)}
                  </div>
                  <div style={{ lineHeight: "14px" }}>
                    {getMonth(item?.createdAt)}
                  </div>
                  {/* {getDateDetail(item?.createdAt)} */}
                </div>
                <i className="fa fa-circle-o"></i>
                <p className={`mb-4 px-1 singleOrder-${item?.OrderStatus}`}>
                  {item?.OrderStatus}
                </p>
              </div>
            );
          })
        ) : (
          <p>Something went wrong</p>
        )}
      </Popover.Content>
    </Popover>
  );
  return (
    <OverlayTrigger
      className="ml-3"
      placement={position ? position : "right"}
      // delay={{ show: 250 }}
      trigger={[trigger ? trigger : "hover"]}
      overlay={popover}
      rootClose={true}
    >
      {children ? (
        children
      ) : (
        <i
          className={
            "fa fa-history status_histroy_icon " +
            (isProduct == "isProduct" ? "isProduct" : "")
          }
        />
      )}
    </OverlayTrigger>
  );
}

export default StatusOverlay;
