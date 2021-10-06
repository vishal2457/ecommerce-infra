import React, { useContext, useEffect, useState } from "react";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { getUser } from "../../utility/commonUtility";
import { Card, CardBody } from "../UI";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/auth/auth.context";

function CommonProfile({ children, active, inProfileInfo, ButtonAction , isEdit}) {
  const router = useRouter();
  const [user, setuser] = useState({});
  const { authState, authDispatch } = useContext(AuthContext);
  const [sideMenu, setsideMenu] = useState([
    {
      title: "Dashboard",
      icon: "tachometer",
      link: "/Profile",
      active: "dashboard",
    },
    {
      title: "My Account",
      icon: "user",
      link: "/Profile/Info",
      active: "info",
    },

    // { title: "My Orders", icon: "list-ul", link: "/MyOrders" },
    // { title: "My Inquiries", icon: "info-circle", link: "/MyInquiries" },
    {
      title: "Settings",
      icon: "cog",
      link: "/Profile/Settings",
      active: "settings",
    },
   
  ])

  let manageUser =  {
       title: "Manage Users",
       icon: "users",
       link: "/Profile/ManageUsers",
       active: "manageUsers",
     }


  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push({
        pathname: "/Auth",
        query: { type: "Login" },
      });
    }
    let user = getUser();
    console.log(user, "this is user");
    setuser(user);
    if(user?.isAdmin) {
   let tempArr = sideMenu;
   tempArr.push(manageUser);
   setsideMenu(tempArr)
    }
    return () => {};
  }, []);

  // sideMenu.push(   ,)

  const logout = () => {
    localStorage.clear();
    localStorage.setItem(
      "authentication",
      JSON.stringify({ isAuthenticated: false })
    );
    authDispatch({ type: "SIGN_OUT" });
    router.push({
      pathname: "/Auth",
      query: { type: "Login" },
    });
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <Card className="cus_card shadow">
              {/* {active != 'dashboard'? (
                <>  */}
                   <div className="profile_bg"></div>
              <div className="profile_color"></div>
                {/* </>
              ) : (null)} */}
           
              <CardBody className="cus_card_body">
              {active != 'dashboard'? (
                  <div className="d-flex justify-content-between mb-2">
                  <div>
                    <img
                      className="avatar profile_avatar"
                      src="/img/user.png"
                    />
                    <p className="pl-3">{user?.name}</p>
                  </div>
                  {inProfileInfo ? (
                    <div>
                      <button className="btn btn-sm btn-outline-dark" onClick={ButtonAction}>
                      {isEdit ? 'Update' : 'Edit'}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (null)}
             

                {children}
              </CardBody>
            </Card>
          </div>
          <div className="col-md-3">
            {sideMenu.map((item, index) => {
              return (
                <Link href={item.link}>
                  <Card
                    key={index}
                    className={`cus_card cus_card_hover shadow mb-3 ${
                      active == item.active ? "cus_card_hover_active" : ""
                    }`}
                  >
                    <CardBody className="p-3">
                      <a>
                        <span>
                          {" "}
                          <i className={`fa fa-${item.icon}`}></i>
                          {item.title}{" "}
                        </span>
                      </a>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}

            <button
              type="button"
              className="btn btn-sm btn-outline-dark logout_position"
              onClick={logout}
            >
              <i class="fa fa-sign-out"></i>
              <span className="pl-2 mb-0">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CommonProfile;
