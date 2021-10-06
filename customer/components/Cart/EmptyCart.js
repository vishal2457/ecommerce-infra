import Link from 'next/link'
import React from 'react'
import { origin } from '../../utility/commonUtility'
import Image from '../image/image'

function EmptyCart() {
    return (
        <div >
        <div className="d-flex justify-content-center">
        <div style={{ maxWidth: "30%" }}>
          <Image src={`${origin}/img/emptycart.png`} alt="Shop" />{" "}
        </div>
        </div>
        <div className="text-center">
            <h5 className="font-weight-bold">Your cart seems empty.</h5>
            <small className="text-muted">There is nothing in your cart, let add some items.</small>
            <br />
            <Link href="/Shop">
            <button className="btn btn-outline-dark btn-sm mt-3"><i className="fa fa-shopping-bag" />&nbsp;Start Shopping</button>
            </Link>
        </div>
        </div>
    )
}

export default EmptyCart
