import React from "react";
import { OverlayTrigger, Popover, ListGroup } from "react-bootstrap";

function ActionProductOverlay({
  heading,
  component,
  position,
  trigger,
  children,
  Edit,
  Chat,
  Delete,
  Close,
  Open,
  Status,
  isOpen,
  isQuot,
  openCompare,
  addToCart,
}) {
  const popover = (
    <Popover id="popover-large" className="orderPopover">
      <Popover.Content className="popover-content">
        <ListGroup variant="flush">
          {Status == "draft" ? (
            <ListGroup.Item className="action_item" onClick={Edit}>
              <i className="fa fa-pencil" />
              Edit
            </ListGroup.Item>
          ) : (
            ""
          )}

          {isQuot && !isOpen ? (
            <ListGroup.Item className="action_item" onClick={Open}>
              <i className="fa fa-chevron-down" />
              Open Details
            </ListGroup.Item>
          ) : (
            ""
          )}

          {isQuot && isOpen ? (
            <ListGroup.Item className="action_item" onClick={Close}>
              <i className="fa fa-chevron-up" />
              Close Details
            </ListGroup.Item>
          ) : (
            ""
          )}

          {isQuot ? (
            <ListGroup.Item className="action_item" onClick={openCompare}>
              <i className="fa fa-list-ul" />
              Compare
            </ListGroup.Item>
          ) : (
            ""
          )}

          {/* <ListGroup.Item className="action_itm" onClick={Delete}><i className="fa fa-trash" />Delete</ListGroup.Item> */}

          {Status == "draft" ? (
            <ListGroup.Item className="action_item" onClick={Delete}>
              <i className="fa fa-trash" />
              Delete
            </ListGroup.Item>
          ) : (
            ""
          )}

          {isQuot ? (
            <ListGroup.Item className="action_item" onClick={addToCart}>
              <i className="fa fa-shopping-cart" />
              Add To Cart
            </ListGroup.Item>
          ) : (
            ""
          )}
          <ListGroup.Item className="action_item" onClick={Chat}>
            <i className="fa fa-comment-o" />
            Chat
          </ListGroup.Item>
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
      {children ? (
        children
      ) : (
        <i className="fa fa-ellipsis-v more_action from_product" />
      )}
    </OverlayTrigger>
  );
}

export default ActionProductOverlay;
