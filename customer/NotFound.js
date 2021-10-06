import { useRouter } from 'next/router';
import React from 'react'

const NotFound = () =>{
    const router = useRouter();
    return(
        <div className="container">
            <h1>404 - Page Not Found!</h1>
           <button className="btn btn-primary btn-sm" onClick={router.back()}>Go Back</button>
        </div>
    )
}

export default NotFound;