import React, {Fragment} from "react";
import { connect } from "react-redux";
// import { FaPinterest, FaTwitter, FaFacebookSquare, FaInstagram } from "react-icons/fa";
//change for git
import Link from "next/link"
import { DashboardRoute } from "../utility/commonUtility";
var logo = "/img/logo/logo.png";
function Footer() {
  return (
   <Fragment>
   <div className="container pt-5 pb-0">
   <hr/>
   </div>
       <div className="container footer">
       <div className="row flex-container">
           <div className="col-md-3 text-center p-5">
               <img src={logo} className="card-img-top" alt="logo" />
               <p className="copyright_area">© 2018 all rights reserved</p>
           </div>
           <div className="col-md-3 address">
               No. 342 - London Oxford Street<br/>
               012 United Kingdom,<br/>
               Business@moontheme.nex<br/>
               +032 3456 7890
           </div>
           <div className="col-md-3 footer-menu">
               <ul>
                   <li>
                       About us
                   </li>
                   <li className="active">
                       Privacy Policy
                   </li>
                   <li>
                       Terms and Conditions
                   </li>
                   <li>
                       Contact us
                   </li>
                   <li>
                       Help
                   </li>
                   <li>
                   <Link href={{ pathname: `${DashboardRoute}/login`, query:{type: 'Seller'} }}><a  target="_blank" className="pointer">Supplier Login</a></Link>
                   </li>
                   <li>
                   <Link href={{ pathname: `/Auth`, query:{type: 'bRegister'} }}><a   className="pointer">Supplier Registration</a></Link>
                   </li>
                 
               </ul>
           </div>
           <div className="col-md-3 text-center ">
               <p className="font-weight-bold">Follow Us On Social</p>
               <div className="flex-container">
               {/* <div className="icon-color"><FaTwitter size={20} /></div>
               <div className="icon-color icon-active"><FaFacebookSquare size={20} /></div>
               <div className="icon-color"><FaInstagram size={20} /></div>
               <div className="icon-color"><FaPinterest size={20} /></div> */}
               <i className="fa fa-instagram"></i>
               <i className="fa fa-twitter"></i>
               <i className="fa fa-facebook-square"></i>   
               <i className="fa fa-pinterest"></i>
                           </div>
           </div>
           <div className="col-md-3 text-center p-5 d-none d-sm-block d-md-none">
               {/* <div className="icon-color"><FaTwitter size={30}  /></div>
               <div className="logo-text uppercase font-weight-bold">paperbird</div> */}
               <img src={logo} className="card-img-top" alt="logo" />
               <p className="copyright_area">© 2018 all rights reserved</p>
           </div>
       </div>
       </div>
   </Fragment>

  );
}

export default connect()(Footer);