import api from "../../Redux/api";
import { getLocaleString, TOKEN_PREFIX } from "../../utility/commonUtility";
const isBrowser = typeof window !== "undefined";

export const cartItemsTotalPrice = (items, coupon = null) => {
  if (items == null || !items.length) return 0;

  let cartTotal = 0;
  for (let item of items) {
    //console.log(item);
    cartTotal = item?.QuotationID
      ? item?.Price * item?.quantity + cartTotal //dont take Amount direct bcoz Amount is in string...ex. "€ 400"
      : item?.Price + cartTotal;
  }
  // console.log(typeof cartTotal);
  // return parseFloat(cartTotal);
  return getLocaleString(cartTotal);
};

const storeCartIndb = (items) => {
  //console.log("db items === ", items);
  api.post("/cart/addCart", { items }).then((res) => {
    if (res?.data?.status) {
      console.log("Products added successfully");
    }
  });
};

// Add or update item in cart
const addItemToCart_old = (state, action) => {
  if (action.payload.key == "update") {
    if (action.payload.BuyIn == action.payload.cartBuyIn) {
      const existingCartItemIndex = state.items.findIndex(
        (item) =>
          item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn
      );
      if (existingCartItemIndex > -1) {
        let newState = [...state.items];
        newState.splice(existingCartItemIndex, 1);
        newState[existingCartItemIndex] = action.payload;
        if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
          storeCartIndb(newState);
        }

        return newState;
      }
    } else {
      const existingCartItemIndex = state.items.findIndex(
        (item) =>
          item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn
      );
      if (existingCartItemIndex > -1) {
        let newState = [...state.items];
        newState.splice(existingCartItemIndex, 1);
        newState[existingCartItemIndex] = action.payload;
        if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
          storeCartIndb(newState);
        }

        return newState;
      } else {
        const existingCartItemIndex = state.items.findIndex(
          (item) =>
            item.ID === action.payload.ID &&
            item.BuyIn == action.payload.cartBuyIn
        );
        if (existingCartItemIndex > -1) {
          let newState = [...state.items];
          newState.splice(existingCartItemIndex, 1);
          newState[existingCartItemIndex] = action.payload;
          if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
            storeCartIndb(newState);
          }

          return newState;
        }
      }
    }
  }

  const existingCartItemIndex = state.items.findIndex(
    (item) =>
      item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn
  );

  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    let singleProduct = newState[existingCartItemIndex];

    singleProduct.quantity = action.payload.quantity;
    singleProduct.Price = action.payload.Price;
    // singleProduct.BuyIn = action.payload.BuyIn;
    singleProduct.defaultPricing = action.payload.defaultPricing;
    singleProduct.ExpectedDeliveryDate = action.payload.ExpectedDeliveryDate;
    if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
      storeCartIndb(newState);
      //storeCartIndb(singleProduct);
    }

    return newState;
  }
  if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
    storeCartIndb([...state.items, action.payload]);
  }

  return [...state.items, action.payload];
};

const handleLoopUpdate = (cartItems, updatedItem, type) => {
  switch (type) {
    case "same":
      const existingCartItemIndex = cartItems.findIndex(
        (item) => item.ID === updatedItem.ID && item.BuyIn == updatedItem.BuyIn
      );
      if (existingCartItemIndex > -1) {
        let newState = [...cartItems];
        newState.splice(existingCartItemIndex, 1);
        newState[existingCartItemIndex] = updatedItem;
        if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
          storeCartIndb(newState);
        }

        return newState;
      }

    case "diff":
      let check = cartItems.map((item) => {
        if (item.ID === updatedItem.ID && item.BuyIn == updatedItem.BuyIn) {
          return true;
        }
      });
      if (check) {
        const existingCartItemIndex1 = cartItems.findIndex(
          (item) =>
            item.ID === updatedItem.ID && item.BuyIn == updatedItem.BuyIn
        );
        const existingCartItemIndex2 = cartItems.findIndex(
          (item) =>
            item.ID === updatedItem.ID && item.BuyIn == updatedItem.cartBuyIn
        );

        let newState = [...cartItems];

        if (existingCartItemIndex1 > -1) {
          newState.splice(existingCartItemIndex1, 1);
        }

        if (existingCartItemIndex2 > -1) {
          newState.splice(existingCartItemIndex2, 1);
        }

        newState.push(updatedItem);
        if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
          storeCartIndb(newState);
        }

        return newState;
      } else {
        if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
          storeCartIndb([...cartItems, updatedItem]);
        }

        return [...cartItems, updatedItem];
      }

    default:
      break;
  }
};

// Add or update item in cart
const addItemToCart = (state, action) => {
  if (action.payload.key == "update") {
    // when update cart item

    if (action.payload.BuyIn == action.payload.cartBuyIn) {
      //cart item UNIT and updated UNIT are same

      return handleLoopUpdate(state.items, action.payload, "same");
    } else {
      //cart item UNIT and updated UNIT not same

      return handleLoopUpdate(state.items, action.payload, "diff");
    }
  }
  const existingCartItemIndex = state.items.findIndex(
    (item) =>
      item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn
  );

  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    let singleProduct = newState[existingCartItemIndex];

    singleProduct.quantity = action.payload.quantity;
    singleProduct.Price = action.payload.Price;
    // singleProduct.BuyIn = action.payload.BuyIn;
    singleProduct.defaultPricing = action.payload.defaultPricing;
    singleProduct.ExpectedDeliveryDate = action.payload.ExpectedDeliveryDate;
    if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
      storeCartIndb(newState);
      //storeCartIndb(singleProduct);
    }

    return newState;
  }
  if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
    storeCartIndb([...state.items, action.payload]);
  }

  return [...state.items, action.payload];
};

// add item on login.
const addItemOnLogin = (state, action) => {
  console.log(action, "this is action");
  const existingCartItemIndex = state.items.findIndex(
    (item) =>
      item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn
  );

  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    let singleProduct = newState[existingCartItemIndex];

    singleProduct.quantity = action.payload.quantity;
    singleProduct.Price = action.payload.Price;
    // singleProduct.BuyIn = action.payload.BuyIn;
    singleProduct.defaultPricing = action.payload.defaultPricing;
    singleProduct.ExpectedDeliveryDate = action.payload.ExpectedDeliveryDate;
    return newState;
  }
  return [...state.items, action.payload];
};

// cartItems, cartItemToRemove
const removeItemFromCart_old = (state, action) => {
  return state.items.reduce((acc, item) => {
    // console.log(item.ID ,action.payload.ID, action.payload.quantity, "this are ids");
    if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
      api
        .post("/cart/removeCart", { item: action?.payload || {} })
        .then((res) => {
          if (res?.data?.status) {
            console.log("Product removed");
          }
        });
    }
    if (item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn) {
      return [...acc];
    }
    return [...acc, item];
  }, []);
};

const removeItemFromCart = (state, action) => {
  if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
    api
      .post("/cart/removeCart", { item: action?.payload || {} })
      .then((res) => {
        if (res?.data?.status) {
          console.log("Product removed");
        }
      });
  }
  return state.items.reduce((acc, item) => {
    if (item.ID === action.payload.ID && item.BuyIn == action.payload.BuyIn) {
      return [...acc];
    }
    return [...acc, item];
  }, []);
};

// cartItems, cartAllItemsToRemove
const removeAllItemsFromCart = (state, action) => {
  if (isBrowser && !!localStorage.getItem(TOKEN_PREFIX)) {
    api
      .post("/cart/removeAllCart", { items: action?.payload || [] })
      .then((res) => {
        if (res?.data?.status) {
          console.log("All Products Removed");
        }
      });
  }

  return [];
};

const clearItemFromCart = (state, action) => {
  return state.items.filter((item) => item.ID !== action.payload.ID);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "REHYDRATE":
      return { ...state, ...action.payload };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "ADD_ITEM":
      return { ...state, items: addItemToCart(state, action) };

    case "ADD_ITEM_ON_LOGIN":
      return { ...state, items: addItemOnLogin(state, action) };

    case "CHECK_ITEM":
      return { ...state, items: checkItem(state, action) };

    case "CHECK_ALL_ITEM":
      return { ...state, items: checkAllItem(state, action) };

    case "REMOVE_ITEM":
      return { ...state, items: removeItemFromCart(state, action) };

    case "REMOVE_ALL_ITEMS":
      return { ...state, items: removeAllItemsFromCart(state, action) };

    case "CLEAR_ITEM_FROM_CART":
      return { ...state, items: clearItemFromCart(state, action) };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    // case "TOGGLE_RESTAURANT":
    //   return { ...state, isRestaurant: !state.isRestaurant };
    case "EMPTY_CART":
      return { ...state, items: [] };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
