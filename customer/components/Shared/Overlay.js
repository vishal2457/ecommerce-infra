import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

function Overlay({heading, component, position, trigger, children}) {
    const popover = (
        <Popover id="popover-large" className="orderPopover">
          <Popover.Title>
            <div className="d-flex justify-content-between">
              <div className="popover_title">{heading}</div>
            </div>
          </Popover.Title>
          <Popover.Content className="popover-content">
              {component}
          </Popover.Content>
        </Popover>
      );
    return (
        <OverlayTrigger
        className="ml-3"
        placement={position ? position : "right"}
        // delay={{ show: 250 }}
        trigger={[trigger ? trigger : 'hover']}
        overlay={popover}
        rootClose={true}
      >
     {children ? children : <i className="fa fa-info-circle" style={{zIndex: '2', position: 'relative'}} /> }   
      </OverlayTrigger>
    )
}

export default Overlay
