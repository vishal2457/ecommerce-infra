import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { formatPrice, getLocaleString } from '../../utility/commonUtility';

function BreakupOverlay({ position, trigger, children, breakupDetails }) {

  const popover = (
    <Popover id="popover-large" className="orderPopover">
      <Popover.Content className="popover-content">

      <table class="table table-hover table-sm m-0">
        <tbody>
          <tr>
            <td className="border-0">Sub Total</td>
            <td className="border-0 text-right">&euro;&nbsp;{getLocaleString(breakupDetails.subTotal)}</td>
          </tr>
          {/* <tr>
            <td className="border-0">Tax</td>
            <td className="border-0 text-right">&euro;&nbsp;{breakupDetails.tax}</td>
          </tr> */}
          <tr>
            <td className="border-0">Shipping Charge</td>
            <td className="border-0 text-right">&euro;&nbsp;{breakupDetails.shippingCharge}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td className="text-right">&euro;&nbsp;{breakupDetails.disconut}</td>
          </tr>
        
          <tr>
            <th>Total</th>
            <th className="text-right">&euro;&nbsp;{getLocaleString(breakupDetails.grandTotal)}</th>
          </tr>
          {/* <tr>
            <td>Pending Value</td>
            <td className="text-right">&euro;&nbsp;{breakupDetails?.pendingDispatchValue}</td>
          </tr> */}
          <tr>
            <td className="payment_method" colSpan="2">
              <i className="fa fa-money"></i>{breakupDetails.paymentMethod}
            </td>
          </tr>
        </tbody>
      </table>

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
      
      {children ? children : <div className="view_breakup">View Breakup</div>}
    </OverlayTrigger>
  )
}

export default BreakupOverlay
