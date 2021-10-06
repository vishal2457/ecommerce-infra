import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

function CustomTooltip({ children, renderComponent, position }) {
  return (
    <OverlayTrigger
      placement={position ? position : "top"}
      delay={{ show: 250, hide: 400 }}
      overlay={<Tooltip id="button-tooltip">{renderComponent}</Tooltip>}
      rootClose={true}
    >
      {children}
    </OverlayTrigger>
  );
}

export default CustomTooltip;
