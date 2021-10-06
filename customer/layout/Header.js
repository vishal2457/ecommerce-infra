import React, { Fragment, useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import {
  Navbar,
  Nav,
  NavDropdown,
  FormControl,
  InputGroup,
  Button,
  Dropdown,
  DropdownButton,
  Spinner,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdEuroSymbol } from "react-icons/md";
import { useRouter } from "next/router";
import { logout, redirectUser } from "../Redux/Auth/actions";
import {
  setNotification,
  getNotification,
  removeNotification,
  clearNotification,
} from "../Redux/layout/Header/action";

import { setFilters } from "../Redux/Shop/actions";
import { io } from "socket.io-client";
import Router from "next/router";

import NProgress from "nprogress";

var logo = "/img/logo/logo.png";
import Link from "next/link";
import {
  checkHost,
  getToken,
  APIURL,
  NOTIFICATION_KEY,
  DashboardRoute,
  getUser,
  TOKEN_PREFIX,
  FILTER_KEY,
  getLocalStorage,
  setLocalStorage,
} from "../utility/commonUtility";

import { useCart } from "../contexts/cart/user-cart";
import { AuthContext } from "../contexts/auth/auth.context";
import api from "../Redux/api";
import { toast } from "react-toastify";

const limit = 10;
let token = null;

function Header(props) {
  let {socket} = props;
  const router = useRouter();
  const [state, setstate] = useState({
    isLoggedIn: false,
  });
  const [user, setuser] = useState(null);
  const [redirectData, setredirectData] = useState({ path: "", ref: "" });
  const { items, CartItemTotalPrice, emptyCart } = useCart();
  const { authState, authDispatch } = useContext(AuthContext);

  const [searchValue, setsearchValue] = useState("");

  const [showSearchList, setshowSearchList] = useState(false);
  const [productGroups, setproductGroups] = useState([
    { ID: "ALL", ProductGroup: "ALL" },
  ]);
  const [selectedGroups, setselectedGroups] = useState({
    ID: "",
    ProductGroup: "",
  });
  const [suggestionList, setsuggestionList] = useState([]);
  const [authenticated, setauthenticated] = useState(null);
  const [notificationData, setnotificationData] = useState(null);
  const [show, setShow] = useState(false);
  const [notificationTab, setnotificationTab] = useState({ open: true });

  // SOCKET CODE START

  const socketCode = () => {
    //get token from localstorage

    //authenticate socket
    socket?.on("authenticated", (data) => {
      setauthenticated(data ? data : false);
      console.log(data, "this is authentication");

      if (data) {
        // get latest notification
        socket?.on(NOTIFICATION_KEY, (data) => {
          toast.info(data?.title);
          setnotificationData(data);
        });
      }
    });
  };

  //console.log(notificationData);

  useEffect(() => {
    NProgress.done(true);
    checkHost(document.location.host);
    Router.events.on("routeChangeComplete", () => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });

    socketCode();
    return () => {};
  }, []);

  // SOCKET CODE END

  useEffect(() => {
    (async () => {
      await api
        .get(`/master/getAllProductGroup/ProductGroup`)
        .then((res) => {
          setproductGroups([...productGroups, ...res?.data?.data]);
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {};
    })();

    let filters = getLocalStorage(FILTER_KEY);
    if (!filters) {
      setLocalStorage(FILTER_KEY, []);
      filters = [];
    }
  }, []);

  useEffect(() => {
    const { redirectSuccessfull } = props;
    if (redirectSuccessfull) {
      redirectsuccess(redirectData.path, redirectData.ref);
    }
    setuser(getUser());
    setstate({
      isLoggedIn: authState.isAuthenticated,
    });
    return () => {};
  }, [redirectData]);

  const login = () => {
    router.push({
      pathname: "/Auth",
      query: { type: "Login" },
    });
  };

  const auth = () => {
    const { logout } = props;
    logout(user);
    emptyCart();
    setstate({ isLoggedIn: false });
    authDispatch({ type: "SIGN_OUT" });
    login();
  };

  const redirectsuccess = async (path, ref) => {
    if (!path) {
      router.push({
        pathname: `${DashboardRoute}/redirect/${user.id}/${path}`,
        query: {
          ref,
          user_: Math.floor(1000 + Math.random() * 9000),
          path: Math.random().toString(36).substring(7),
        },
      });
    } else {
      router.push({
        pathname: `${DashboardRoute}/redirect/${user.id}/${path}`,
        query: {
          ref,
          user_: Math.floor(1000 + Math.random() * 9000),
          path: Math.random().toString(36).substring(7),
        },
      });
    }
  };

  const redirectToAdmin = async (path, ref) => {
    const { redirectUser } = props;
    if (localStorage.getItem(TOKEN_PREFIX)) {
      await redirectUser();
    }
    setredirectData({ path, ref });
  };

  const showSearchData = async (e) => {
    // console.log(e.target.value);
    setsearchValue(e.target.value);
    if (e.target.value && e.target.value.length > 2) {
      api
        .post("/customerHeader/searchSuggestionsList", {
          keyword: e.target.value,
          limit,
          // GroupID: getLocalStorage(FILTER_KEY).filter((item) => item.header)[0]
          //   ?.ID
          //   ? getLocalStorage(FILTER_KEY).filter((item) => item.header)[0]?.ID
          //   : null,
        })
        .then((res) => {
          setsuggestionList(res?.data?.data);
          setshowSearchList(true);
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong");
        });
    } else {
      setshowSearchList(false);
    }
  };

  const onSearchClicked = () => {
    setshowSearchList(false);
    setsearchValue("");

    // if (getLocalStorage(FILTER_KEY).filter((item) => item.header).length) {
    //   router.push({
    //     pathname: "/Shop",
    //   });
    // }

    router.push({
      pathname: "/Shop",
    });
  };

  const onProductGroupClick = (selected) => {
    setselectedGroups(selected);
  };

  const onProductGroupChange = (selected) => {
    props.setFilters({
      ProductGroup: selected.ProductGroup,
      ID: selected.ID,
      header: true,
    });

    setselectedGroups({
      ...selectedGroups,
      ID: selected.ID,
      ProductGroup: selected.ProductGroup,
    });
  };

  const NotificationCount = ({ children }) => {
    return authState.NotificationCount?.length ? children : null;
  };

  const onSuggestionClick_old = (id) => {
    setsuggestionList([]);
    setsearchValue("");
    router.push({
      pathname: "/Product",
      query: { id },
    });
  }



  const onSuggestionClick = (id) => {
    setsuggestionList([]);
    setsearchValue("");

    router.push({
      pathname: "/Shop",
      query: { type: "search", keyword: id },
    });
  };

  const getNotificationsLocal = () => {
    const { getNotification } = props;
    if (notificationTab.open) getNotification({ page: 1, limit: 10 });
    setnotificationTab({ open: !notificationTab.open });
  };

  const removeNotificationLocal = async (type) => {
    const { removeNotification } = props;
    removeNotification(type);
    let route = type.split("-").pop();
    router.push(`/${route}`);
  };

  return (
    <Fragment>
      <div className="header-bg header">
        <div className="container">
          <div className="flexbox--- justify-content-between">
            <div className="d-flex--- ">
              <div className="row header-first">
                <div className="col-md-3 col-sm-6 text-center logo-header">
                  {/* <IconContext.Provider
                    value={{
                      style: { fontSize: "30px", size: "50", color: "#dc3545" },
                    }}
                  > */}
                  <div>
                    <a href="/">
                      <img
                        src={logo}
                        className="card-img-top logo"
                        alt="logo"
                      />
                    </a>
                  </div>
                  {/* </IconContext.Provider> */}
                </div>
                <div className="col-md-7 col-sm-6 header-menu">
                  <Navbar expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="mr-auto">
                        <div
                          className={`nav-item nav-link ${
                            router.route == "/" ? "active" : ""
                          } `}
                        >
                          <Link href="/">Home</Link>
                        </div>
                        <Link href="/" className="">
                          UBER UNS
                        </Link>

                        <div
                          className={`nav-item nav-link ${
                            router.route == "/Shop" ? "active" : ""
                          } `}
                        >
                          <Link href="/Shop">Shop</Link>
                        </div>

                        {/* <NavDropdown title="News" id="basic-nav-dropdown">
                          <NavDropdown.Item>
                            <Link href="/Shop">Shop</Link>
                          </NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.2">
                            Another action
                          </NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">
                            Something
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.4">
                            Separated link
                          </NavDropdown.Item>
                        </NavDropdown> */}

                        <div
                          className={`nav-item nav-link ${
                            router.route == "/" ? "" : ""
                          } `}
                        >
                          <Link href="/">News</Link>
                        </div>

                        <div
                          className={`nav-item nav-link ${
                            router.route == "/" ? "" : ""
                          } `}
                        >
                          <Link href="/">Kontakt</Link>
                        </div>
                        <div
                          className={`nav-item nav-link ${
                            router.route == "/Inquiry" ? "active" : ""
                          } `}
                        >
                          <Link href="/Inquiry" className="">
                            Inquiry
                          </Link>
                        </div>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                </div>
                <div className="col-md-2 header-login">
                  <div>
                    {authState.isAuthenticated ? (
                      <>
                        <DropdownButton
                          menuAlign="left"
                          className="notification_button"
                          variant=""
                          id="dropdown-item-button"
                          title={
                            <div className="cart-icon">
                              <i className="fa fa-bell"></i>

                              <div className="notificaiton-counter">
                                {props?.notificationCount
                                  ? props?.notificationCount || 0
                                  : getUser().notificationCount}
                              </div>
                            </div>
                          }
                          onClick={getNotificationsLocal}
                        >
                          <Dropdown.Header>
                            {/* Notifications
                            <Button
                              variant="light"
                              className="clear_btn"
                              onclick={props.clearNotification}
                            >
                              clear
                            </Button> */}

                            <div className="d-flex justify-content-between">
                              <h4>Notifications</h4>
                              <span
                                className="chip pointer bg-secondary rounded text-white"
                                onClick={props.clearNotification}
                              >
                                <small>Clear</small>
                              </span>
                            </div>
                          </Dropdown.Header>
                          <Dropdown.Divider />
                          {props.loading ? (
                            <div className="text-center">
                              <Spinner
                                animation="grow"
                                variant="primary"
                                size="sm"
                              />
                              <Spinner
                                animation="grow"
                                variant="danger"
                                size="sm"
                              />
                              <Spinner
                                animation="grow"
                                variant="warning"
                                size="sm"
                              />
                              <Spinner
                                animation="grow"
                                variant="info"
                                size="sm"
                              />
                              <Spinner
                                animation="grow"
                                variant="dark"
                                size="sm"
                              />
                            </div>
                          ) : (
                            <Fragment>
                              {props?.notifications &&
                              props?.notifications.length > 0 ? (
                                props.notifications.map((notify, index) => (
                                  <Dropdown.Item key={index}>
                                    <div
                                      className="nav-item d-flex justify-content-between small"
                                      onClick={() =>
                                        removeNotificationLocal(
                                          notify.NotificationType
                                        )
                                      }
                                    >
                                      <div className="dot">
                                        <i className="fa fa-bell"></i>
                                        <div className="noti-order-no">
                                          {notify.NotificationType.substring(
                                            0,
                                            notify.NotificationType.indexOf("-")
                                          )}
                                        </div>
                                        <div className="name">
                                          {notify.Description}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="badge badge-secondary">
                                          {notify.count}
                                        </div>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                ))
                              ) : (
                                <span className="ml-5">
                                  No New Notificaitons
                                </span>
                              )}
                            </Fragment>
                          )}
                        </DropdownButton>

                        {/* NOTIFICATION END */}

                        <DropdownButton
                          alignRight
                          className="user-buttons"
                          variant=""
                          id="dropdown-item-button"
                          title={
                            <Fragment>
                              <i className="fa fa-user"></i>
                              <span>{user?.name}</span>
                            </Fragment>
                          }
                        >
                          <Dropdown.Item as="button">
                            <Link href="/Profile">
                              <span>Profile</span>
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item as="button">
                            <Link href="/MyOrders">
                              <span>My Orders</span>
                            </Link>
                          </Dropdown.Item>
                          <Dropdown.Item as="button">
                            <Link href="/MyInquiries">
                              <span>My Inquiries</span>
                            </Link>
                          </Dropdown.Item>
                          <Dropdown.Item as="button" onClick={auth}>
                            Logout
                          </Dropdown.Item>
                        </DropdownButton>
                      </>
                    ) : (
                      <button
                        className="btn btn-secondary login-btn"
                        onClick={login}
                      >
                        <i className="fa fa-sign-in"></i>
                        <span>Login</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-center header-second">
            <div className="col-md-3 text-center header-category">
              {/* {productGroups && productGroups.length > 0 && (
                <ReactSelectDropdown
                  arr={productGroups || []}
                  bindName="ProductGroup"
                  bindValue="ID"
                  value={
                    getLocalStorage(FILTER_KEY)?.filter(
                      (item) => item.header
                    )[0]?.ID || productGroups[0].ID
                  }
                  //value={productGroups[0].ProductGroup}
                  onChange={onProductGroupChange}
                  placeholder="Select Product Group"
                />
              )} */}
            </div>

            <div className="col-md-7 header-search">
              <InputGroup>
                <FormControl
                  placeholder="Search Product"
                  aria-label="Search Product"
                  aria-describedby="basic-addon2"
                  onChange={showSearchData}
                  value={searchValue}
                />
                <InputGroup.Append>
                  <Button variant="secondary" onClick={onSearchClicked}>
                    <BsSearch />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              {showSearchList
                ? suggestionList &&
                  suggestionList.length > 0 && (
                    <div className="search_product_dd">
                      <ul class="list-group">
                        {suggestionList.map((item, index) => (
                          <li key={index} class="list-group-item py-2">
                            <button
                              className="btn btn-light py-0"
                              onClick={() => onSuggestionClick(item?.key)}
                            >
                              <small dangerouslySetInnerHTML={{__html: item?.name}}></small>
                              {/* <small dangerouslySetInnerHTML={{__html: item?.name}}>{item?.name}</small> */}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                : ""}
            </div>
            <div className="col-md-2 text-center header-cart">
              <Link href="/Cart">
                <span className="d-flex justify-content-center align-items-center pointer">
                  <div className="cart-icon">
                    <AiOutlineShoppingCart size={25} />
                    {/* <span className='badge badge-warning' id='lblCartCount'> {items.length} </span>

                  <p className="pointer">
                  
                  </p> */}
                    <div className="notificaiton-counter">{items?.length}</div>
                  </div>

                  {/* <p className="px-2 cart_item_number">{items.length}</p> */}
                  <span className="px-2 header-cart-value">
                    {/* <span className="yourcart pointer">Your cart</span> */}
                    <span className="euro-sign">
                      <MdEuroSymbol size={18} />
                      &nbsp;
                      {CartItemTotalPrice()}
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
const mapStateToProps = (state) => ({
  redirectSuccessfull: state.Auth.redirectSuccessfull,
  groupFilter: state.Shop.setFilters,
  notifications: state.Header.notifications,
  notificationCount: state.Header.count,
  loading: state.Header.loading,
  socket: state.Chat.socket
});

const mapDispatchToProps = {
  logout,
  redirectUser,
  setFilters,
  setNotification,
  getNotification,
  removeNotification,
  clearNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
