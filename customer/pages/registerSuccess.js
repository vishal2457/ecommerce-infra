import React from 'react'
import Link from 'next/link'

function registerSuccess() {
    return (
        <div className="registerSuccess">
            <div className="img-div">
            <img
                  src="/img/logo/logo.png"
                  alt="Logo"
                  className="img-fluid"
                />
            </div>
            
            <h5>Thank you for registeration !</h5>
            <p>Your profile is under review</p>
            <Link href="/"><p className="pointer">Home</p></Link>
        </div>
    )
}

export default registerSuccess
