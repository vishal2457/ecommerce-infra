import React from 'react'
import Link from 'next/link'


function registerSuccess() {

    return (
        <div className="text-center m-5">
            <h5>Your Order has been placed successfully !</h5>
            <Link href="/Shop"><p className="pointer">Shop More</p></Link>
        </div>
    )
}

export default registerSuccess
