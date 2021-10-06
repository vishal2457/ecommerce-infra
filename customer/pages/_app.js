import React, {useEffect, useState} from "react";
import withReduxStore from "../Redux/with-redux-store";
import { Provider } from "react-redux";
import "../App.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/auth/auth.provider";
import { ShopProvider } from "../contexts/shop/use-shop";
import { CartProvider } from "../contexts/cart/user-cart";
import { InquiryProvider } from "../contexts/Inquiry/user-inquiry";
import { ToastContainer } from "react-toastify";
import NProgress from "nprogress";
import Router from "next/router";
import ChatList from "../components/Chat/ChatList";
import { CHAT_TOGGLE_LIST, SET_SOCKET } from "../Redux/Chat/types";
import Chat  from "../components/Chat/Chat";
import WithSocket from "../components/Shared/WithSocket";

function MyApp({ Component, pageProps, reduxStore, socket }) {

  useEffect(() => {
    NProgress.configure({ showSpinner: true });

    Router.onRouteChangeStart = () => {
      NProgress.start();
    };
    
    Router.onRouteChangeComplete = () => {
      NProgress.done();
    };
    
    Router.onRouteChangeError = () => {
      NProgress.done();
    };
    NProgress.done(true);


    // checkHost(document.location.host);
    Router.events.on("routeChangeComplete", () => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
    reduxStore.dispatch({type: SET_SOCKET, payload: socket})

    // socketCode();
    return () => {};
  }, []);


  const toggleChatList = () => {
    reduxStore.dispatch({type: CHAT_TOGGLE_LIST})
  }

  return (
    <Provider store={reduxStore}>
      <ShopProvider>
        <CartProvider>
          <InquiryProvider>
            <AuthProvider>
              <div id="main">
              <ChatList toggleUserList={toggleChatList} />
              <Chat />
                <Component {...pageProps} />
                <ToastContainer
                  position="top-right"
                  autoClose={8000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  draggable={false}
                  pauseOnVisibilityChange
                  closeOnClick
                  pauseOnHover
                />
              </div>
            </AuthProvider>
          </InquiryProvider>
        </CartProvider>
      </ShopProvider>
      
    </Provider>
  );
}

export default  WithSocket(withReduxStore(MyApp));
