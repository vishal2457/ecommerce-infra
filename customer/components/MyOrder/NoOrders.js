import Link from 'next/link'
import React from 'react'
import { origin } from '../../utility/commonUtility'
import Image from '../image/image'

function NoOrders() {
    return (
        <div >
        <div className="d-flex justify-content-center">
        <div style={{ maxWidth: "30%" }}>
          <Image src={`${origin}/img/noproduct.png`} alt="Shop" />{" "}
        </div>
        </div>
        <div className="text-center">
            <h5 className="font-weight-bold">You haven't placed any order yet</h5>
            <small className="text-muted">After placing order you can track them from here.</small>
            <br />
            <Link href="/Shop">
            <button className="btn btn-outline-dark btn-sm mt-3"><i className="fa fa-shopping-bag" /> Start Shopping</button>

            </Link>
        </div>
        </div>
    )
}

export default NoOrders
