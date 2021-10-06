import React from "react";
import { OverlayTrigger, Popover, ListGroup } from "react-bootstrap";

function InquiryDetailOverlay({
  position,
  trigger,
  children,
  Print,
  Send,
  Cancel,
  Status,
  Edit,
  isEdit,
  isQuot,
  compareProductList,
}) {
  const popover = (
    <Popover id="popover-large" className="orderPopover">
      {/* <Popover.Title>
            <div className="d-flex justify-content-between">
              <div className="popover_title">{heading}</div>
            </div>
          </Popover.Title> */}
      <Popover.Content className="popover-content">
        <ListGroup variant="flush">
          <ListGroup.Item className="action_item" onClick={Print}>
            <i className="fa fa-print" />
            Print
          </ListGroup.Item>
          {Status == "draft" ? (
            <>
              <ListGroup.Item className="action_item" onClick={Edit}>
                <i className="fa fa-pencil" />
                Edit
              </ListGroup.Item>
              <ListGroup.Item className="action_item" onClick={Send}>
                <i className="fa fa-paper-plane-o" />
                Send
              </ListGroup.Item>
              <ListGroup.Item className="action_item" onClick={Cancel}>
                <i className="fa fa-times" />
                Cancel
              </ListGroup.Item>
            </>
          ) : isQuot ? (
            <>
              <ListGroup.Item
                className="action_item"
                onClick={compareProductList}
              >
                <i className="fa fa-list-ul" />
                Compare
              </ListGroup.Item>
            </>
          ) : (
            <></>
          )}
        </ListGroup>
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
      {children ? children : <i className="fa fa-ellipsis-v more_action" />}
    </OverlayTrigger>
  );
}

export default InquiryDetailOverlay;
