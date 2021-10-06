import React, { useReducer, useContext, createContext } from "react";
import { reducer, cartItemsTotalPrice } from "./cart.reducer";
import { useStorage } from "../../utility/use-storage";
const CartContext = createContext({});
const INITIAL_STATE = {
  items: [],
};

const useCartActions = (initialCart = INITIAL_STATE) => {
  const [state, dispatch] = useReducer(reducer, initialCart);
  const addItemHandler = (obj) => {
    let {
      product,
      defaultPricing,
      Quantity,
      BuyIn,
      Price,
      Pricings,
      InquiryID,
      QuotationID,
      QuotationDetailID,
      DeliveryAddress,
      AddressID,
      expDelDate_display,
    } = obj;
    // // console.log(obj)
    // delete product.Pricings
    // product.Pricings = pricingArr
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        defaultPricing: defaultPricing,
        quantity: Quantity,
        BuyIn,
        Price,
        Pricings: Pricings || null,
        InquiryID: InquiryID || null,
        QuotationID: QuotationID || null,
        QuotationDetailID: QuotationDetailID || null,
        ExpectedDeliveryDate: obj?.ExpectedDeliveryDate,
        DeliveryAddress: DeliveryAddress || null,
        AddressID: AddressID || null,
        expDelDate_display: expDelDate_display || null,
        Amount: obj?.Amount || null,
        key: obj?.key || null,
        cartBuyIn: obj?.cartBuyIn || null,
      },
    });
  };

  const addItemOnLogin = (item, quantity, active) => {
    dispatch({
      type: "ADD_ITEM_ON_LOGIN",
      payload: { ...item, quantity, buyin: active },
    });
  };

  const checkItemHandler = (item, checked) => {
    dispatch({ type: "CHECK_ITEM", payload: { ...item, checked } });
  };

  const checkAllItemHandler = (checked) => {
    dispatch({ type: "CHECK_ALL_ITEM", payload: { checkAll: checked } });
  };

  const removeItemHandler = (item, quantity = 0) => {
    dispatch({ type: "REMOVE_ITEM", payload: { ...item, quantity } });
  };

  const removeAllItemsHandler = (items) => {
    dispatch({ type: "REMOVE_ALL_ITEMS", payload: items });
  };

  const clearItemFromCartHandler = (item) => {
    dispatch({ type: "CLEAR_ITEM_FROM_CART", payload: item });
  };
  const emptyCart = () => {
    dispatch({ type: "EMPTY_CART" });
  };

  const clearCartHandler = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  const toggleCartHandler = () => {
    dispatch({ type: "TOGGLE_CART" });
  };
  const couponHandler = (coupon) => {
    dispatch({ type: "APPLY_COUPON", payload: coupon });
  };
  const removeCouponHandler = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };
  const rehydrateLocalState = (payload) => {
    dispatch({ type: "REHYDRATE", payload });
  };
  const toggleRestaurant = () => {
    dispatch({ type: "TOGGLE_RESTAURANT" });
  };
  const isInCartHandler = (ID) => {
    return state.items?.some((item) => item.ID === ID);
  };
  const getItemHandler = (ID) => {
    return state.items?.find((item) => item.ID === ID);
  };
  const getCartItemsPrice = () => cartItemsTotalPrice(state.items).toFixed(4);
  const getCartItemsTotalPrice = () =>
    cartItemsTotalPrice(state.items, state.coupon);

  const getDiscount = () => {
    const total = cartItemsTotalPrice(state.items);
    const discount = state.coupon
      ? (total * Number(state.coupon?.discountInPercent)) / 100
      : 0;
    return discount.toFixed(2);
  };
  const getItemsCount = state.items?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  return {
    state,
    getItemsCount,
    rehydrateLocalState,
    addItemHandler,
    removeItemHandler,
    removeAllItemsHandler,
    clearItemFromCartHandler,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    getCartItemsPrice,
    couponHandler,
    removeCouponHandler,
    getDiscount,
    toggleRestaurant,
    checkItemHandler,
    checkAllItemHandler,
    addItemOnLogin,
    emptyCart,
  };
};

export const CartProvider = ({ children }) => {
  const {
    state,
    rehydrateLocalState,
    getItemsCount,
    addItemHandler,
    removeItemHandler,
    removeAllItemsHandler,
    clearItemFromCartHandler,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    couponHandler,
    removeCouponHandler,
    getCartItemsPrice,
    getDiscount,
    emptyCart,
    checkItemHandler,
    checkAllItemHandler,
    addItemOnLogin,
  } = useCartActions();
  const { rehydrated, error } = useStorage(state, rehydrateLocalState);

  return (
    <CartContext.Provider
      value={{
        isOpen: state.isOpen,
        items: state.items,
        coupon: state.coupon,
        isRestaurant: state.isRestaurant,
        cartItemsCount: state.items?.length,
        itemsCount: getItemsCount,
        addItem: addItemHandler,
        addItemOnLogin: addItemOnLogin,
        checkItem: checkItemHandler,
        removeItem: removeItemHandler,
        removeAllItems: removeAllItemsHandler,
        removeItemFromCart: clearItemFromCartHandler,
        clearCart: clearCartHandler,
        isInCart: isInCartHandler,
        getItem: getItemHandler,
        toggleCart: toggleCartHandler,
        CartItemTotalPrice: getCartItemsTotalPrice,
        calculateSubTotalPrice: getCartItemsPrice,
        applyCoupon: couponHandler,
        removeCoupon: removeCouponHandler,
        calculateDiscount: getDiscount,
        checkAllItem: checkAllItemHandler,
        emptyCart: emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
