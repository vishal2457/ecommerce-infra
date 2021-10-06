import configFunc from "./config.js";
import swal from "sweetalert2";

import qs from "query-string";

let mode = {
  development: "development",
  production: "production",
  test: "test",
};
/**
 * * CHANGE ENV VARIABLE ACCORDING TO DEPLOYMENT
 */
let env = mode.development;
export function checkHost(host) {
  // if (/localhost/.test(host)) {
  //   console.log(host, /localhost/.test(host));
  //   env = mode.development;
  // }
}

let config = configFunc(env);

export const APIURL = config.ApiUrl;
export const ResourceApiUrl = `${APIURL}/static/resources/`;
export const FILTER_KEY = "_paperbird_filter";
export const TOKEN_PREFIX = "Paperbird__eu";
export const USER_DATA = "USER_DATA";
export const USER_LOCATION = "USER_LOCATION";
export const STANDARD_GROUP = 1;
export const DashboardRoute = config.DashboardRoute;
const isBrowser = typeof window !== "undefined";
export const origin = isBrowser && location.origin;
export const NOTIFICATION_KEY = "PAPERBIRD_CUSTOMER_NOTIFICATION";
export const NOTIFICATION_COUNT = "USER_NOTIFICATIONS";
export const PRICE_EXCULSIVE_MESSAGE = "Note*: Prices are exclusive of taxes";
export const SOCKET_KEYS = {
  CHECK_USER_STATUS: 'CHECK_USER_STATUS',
  SEND_STATUS_UPDATE: 'SEND_STATUS_UPDATE',
  JOIN: 'JOIN',
  SEND_MESSAGE: "SEND_MESSAGE",
  MESSAGE: "MESSAGE",
  TYPING: "TYPING",
  ON_TYPING: "ON_TYPING",
  STOP_TYPING: "STOP_TYPING",
  ON_STOP_TYPING: "ON_STOP_TYPING"
}
export const SHOP_TYPE =  {
  GRID: "GIRD",
  LIST: "LIST"
}
export const ORDER_STATUS = {
  pending: "Pending",
  confirm: "Confirm",
  reject: "Reject",
  inProgress: "InProgress",
  dispatched: "Dispatched",
  delivered: "Delivered",
  canceled: "Canceled",
  partialConfirm: "PartialConfirm",
  partialDispatch: "PartialDispatch",
  partialDelivery: "PartialDelivery",
};

  export const CHAT_TYPES =  {
    CUSTOMER:"Customer",
    SUPPLIER: "Supplier"
  }

/**
 * @Dispatch_Status
 */
export const DISPATCH_STATUS = {
  draft: "draft",
  confirm: "confirm",
  cancel: "cancel",
  delivered: "delivered",
};

export const UOM_TYPES = {
  sheets: "Sheets",
  ries: "Ries",
  pallete: "Pallete",
  rolls: "Rolls",
  kg: "kg",
};

/*
 * used in
 * components/cart/steptwo/index
 */
export const PAYMENT_METHODS = [
  { name: "International shipping", ID: "InternationalShipping" },
];

//check if token is availble or not
export const isLoggedIn = () => {
  return !!localStorage.getItem("authentication");
};

var logoutUser = () => async (dispatch) => {
  dispatch({ type: LOGOUT_USER, payload: "No user found" });
};

export const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key) => {
  let item = null;
  if (isBrowser) {
    item = localStorage.getItem(key);
  }
  if (item && item != "undefined") return JSON.parse(item);
  return null;
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_PREFIX);
};

/**
 *
 * @param {Date} date pass a date format
 * @param {*} type get a specific formatted date
 * @returns Formatted date
 */
export const dateFormatter = (date, type) => {
  if (!date) return;
  var today = new Date(date);
  if (type == "getInIso") {
    return today.toISOString().replace(/T.*/, "").split("-").join("-");
  } else {
    return today.toLocaleDateString("en-US");
  }
};

export const calculateWeight = (weight, quantity, defaultQuantity) => {
  if (typeof weight) parseFloat(weight);
  if (typeof quantity) parseInt(quantity);
  if (typeof defaultQuantity) parseInt(defaultQuantity);
  return (quantity * weight) / defaultQuantity;
};

/**
 *
 * @param {[]]} pricingArr Pricing Array of product
 * @param {[]} customerGroups All groups in which customer is assigned
 * @returns return customer specific pricing.
 */
export const getCustomerPricing = (pricingArr, customerGroups) => {
  if (!pricingArr?.length || !customerGroups) return;
  let singlePricingArr = [];
  let pricingIndex = 0;
  let pricingLen = pricingArr.length;
  let customerGroupsLocal = customerGroups;
  while (pricingIndex < pricingLen) {
    let singlePricing = pricingArr[pricingIndex];
    let customerIndex = 0;
    let customerLen = customerGroupsLocal.length;

    while (customerIndex < customerLen) {
      let singleCustomerPricing = customerGroupsLocal[customerIndex];

      if (singlePricing?.GroupID == singleCustomerPricing?.GroupID) {
        singlePricingArr.push(singlePricing);
      }

      customerIndex++;
    }

    pricingIndex++;
  }

  //if no pricing found assign standard pricing
  if (!singlePricingArr.length) {
    singlePricingArr = pricingArr.filter(
      (item) => item?.GroupID == STANDARD_GROUP
    );
  }

  return singlePricingArr;
};

export const getCustomerGroup = (pricingArr, customerGroups) => {
  var group = pricingArr.filter((item) => {
    if (customerGroups && customerGroups.length) {
      return (
        item.GroupID ==
        customerGroups.map((i) => (i.GroupID > 1 ? i.GroupID : 1))
      );
    } else {
      return item;
    }
  });
  return group.length ? group[0].GroupID : 1;
};

export const getDateDetail = (date) => {
  if (!date) return;
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleTimeString("en-us", options);
};

/**
 *
 * @param {string} status order status
 * @returns message accroding to the order status
 */
export const getOrderMessage = (status) => {
  const {
    confirm,
    pending,
    reject,
    dispatched,
    partialDispatch,
    partialDelivery,
    delivered,
  } = ORDER_STATUS;
  if (status == confirm) {
    return `Your order has been confirmed by the supplier.`;
  } else if (status == pending) {
    return `Your order is still being processed⌛ by supplier.`;
  } else if (status == reject) {
    return `Woops! Your order is rejected by the supplier`;
  } else if (status == dispatched) {
    return `Your order has been dispatched`;
  } else if (status == partialDispatch) {
    return `This product is partially dispatched`;
  } else if (status == partialDelivery) {
    return `This product is partially delivered`;
  } else if (status == delivered) {
    return `This product is delivered`;
  } else {
    return `Looks like something is wrong on our side.`;
  }
};

export const getButton = (status) => {
  const { confirm, pending, reject } = ORDER_STATUS;
  if (status == confirm) {
    return `Cancel`;
  } else if (status == pending) {
    return `Cancel`;
  } else if (status == reject) {
    return `Inquire`;
  } else {
    return `Something went wrong`;
  }
};

/**
 * @param {string} status order status from db
 * @returns formatted status
 */
export const getFormattedStatus = (status) => {
  const {
    confirm,
    pending,
    reject,
    partialConfirm,
    partialDispatch,
    dispatched,
    delivered,
    partialDelivery,
  } = ORDER_STATUS;
  if (status == confirm) {
    return `Confirmed`;
  } else if (status == pending) {
    return `Pending`;
  } else if (status == reject) {
    return `Rejected`;
  } else if (status == partialConfirm) {
    return `Partially Confirmed`;
  } else if (status == partialDispatch) {
    return `Partial Dispatch`;
  } else if (status == dispatched) {
    return `Dispatched`;
  } else if (status == delivered) {
    return `Delivered`;
  } else if (status == partialDelivery) {
    return `Partial Delivery`;
  } else {
    return `Something went wrong`;
  }
};

/**
 *
 * @param {[]} pricing product pricing (Make sure customer pricing is right if user is logged in)
 * @param {Number} quantity user input quantity or default product quantity
 * @param {Boolean} authentication user loggedin (not needed now but dont remove)
 * @param {Number} globalQuantity Global quantity for input by user from shop page
 * @returns Calculated price of product.
 */
export const calculatePrice = (
  pricing,
  quantity,
  authentication,
  globalQuantity
) => {
  let PricingUnit;
  let singlePricing;
  let finalPricing;

  singlePricing = pricing;
  PricingUnit = singlePricing[0].PricingUnit;

  if (singlePricing) {
    if (!quantity && !globalQuantity) {
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = (quantity * value.Price) / PricingUnit;
            // console.log(finalPricing, "rest element");
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = (quantity * value.Price) / PricingUnit;
          }
        }
      }
    } else if (globalQuantity) {
      if (!globalQuantity || globalQuantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            globalQuantity >= value.Quantity &&
            globalQuantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = (globalQuantity * value.Price) / PricingUnit;
            // console.log(finalPricing, "rest element");
          } else if (globalQuantity > value.Quantity) {
            //greater than last
            finalPricing = (globalQuantity * value.Price) / PricingUnit;
          }
        }
      }
    } else if (quantity) {
      // console.log(quantity, "this is qqqqq");
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = (quantity * value.Price) / PricingUnit;
            // console.log(finalPricing, "rest element");
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = (quantity * value.Price) / PricingUnit;
          }
        }
      }
    }
  }
  // console.log(finalPricing);
  return finalPricing?.toFixed(4);
};

/**
 *
 * @param {[]} pricing product pricing (Make sure customer pricing is right if user is logged in)
 * @param {Number} quantity user input quantity or default product quantity
 * @param {Boolean} authentication user loggedin (not needed now but dont remove)
 * @param {Number} globalQuantity Global quantity for input by user from shop page
 * @returns Calculated price of product.
 */
export const calculatePriceForSheets = (
  pricing,
  quantity,
  authentication,
  globalQuantity
) => {
  let PricingUnit;
  let singlePricing;
  let finalPricing;

  singlePricing = pricing;
  PricingUnit = singlePricing[0].PricingUnit;

  if (singlePricing) {
    if (!quantity && !globalQuantity) {
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = value.Price;
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = value.Price;
          }
        }
      }
    } else if (quantity) {
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = value.Price;
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = value.Price;
          }
        }
      }
    }
  }
  //  console.log(finalPricing);
  return finalPricing?.toFixed(4);
};

/**
 *
 * @param {[]} pricing product pricing (Make sure customer pricing is right if user is logged in)
 * @param {Number} quantity user input quantity or default product quantity
 * @param {Boolean} authentication user loggedin (not needed now but dont remove)
 * @param {Number} globalQuantity Global quantity for input by user from shop page
 * @returns Default price of the product
 */
export const getQuantityAsPerPrice = (
  pricing,
  quantity,
  authentication,
  globalQuantity
) => {
  let PricingUnit;
  let singlePricing;
  let finalPricing;

  singlePricing = pricing;
  PricingUnit = singlePricing[0].PricingUnit;

  if (singlePricing) {
    if (!quantity && !globalQuantity) {
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = value.Price;
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = value.Price;
          }
        }
      }
    } else if (quantity) {
      if (!quantity || quantity == 1) {
        finalPricing = singlePricing[0].Price_Ranges[0].Price / PricingUnit;
      } else {
        for (let [index, value] of singlePricing[0].Price_Ranges.entries()) {
          if (
            //rest element
            index != singlePricing[0].Price_Ranges.length - 1 &&
            quantity >= value.Quantity &&
            quantity < singlePricing[0].Price_Ranges[index + 1].Quantity
          ) {
            finalPricing = value.Quantity;
          } else if (quantity > value.Quantity) {
            //greater than last
            finalPricing = value.Quantity;
          }
        }
      }
    }
  }
  //  console.log(finalPricing);
  return finalPricing?.toFixed(4);
};

export const getUser = () => {
  return getLocalStorage("USER_DATA");
};

export const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl =
    window.location.protocol +
    "" +
    window.location.host +
    window.location.pathname +
    qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

export const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};

/**
 * @Format_Price
 * @returns formatted price
 */
export const formatPrice = (price) => {
  if (!price) return price;
  return parseFloat(price).toFixed(3);
};

// hasmukh (02/04/2021)
// unique number generator using current date time

export const uniqueNumber = () => {
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  ];

  var uniqueNumber = components.join("");

  //console.log(uniqueNumber);

  return uniqueNumber;
};

/**
 * @getMinQtyMsg minimum qty msg for user understand
 * @param {string} active packageType
 * @param {number} minQty minimum order qty set by supplier
 * @param {number} pricingUnit
 * @param {number} packagingUnit
 * @returns {string} minimum qty msg for user understand
 */
export const getMinQtyMsg = ({
  productUom,
  active,
  minQty,
  pricingUnit,
  packagingUnit,
}) => {
  let msg = `* MOQ ${minQty} ${active}`;

  if (active == UOM_TYPES.sheets || active == UOM_TYPES.rolls) {
    msg = `* MOQ ${minQty} ${active}`;
  }

  if (active == UOM_TYPES.ries) {
    msg = `* MOQ ${Math.ceil(minQty / packagingUnit)} ${active}`;
  }

  if (active == UOM_TYPES.pallete) {
    productUom == UOM_TYPES.rolls
      ? (msg = `* MOQ ${Math.ceil(minQty / packagingUnit)} Carton`)
      : (msg = `* MOQ ${Math.ceil(minQty / packagingUnit)} ${active}`);
  }

  return msg;
};

/**
 * @checkMinQty check order qty is valid
 * @param {string} active packageType
 * @param {number} qty entered qty
 * @param {number} pricingUnit
 * @param {number} packagingUnit
 * @returns boolean
 */
export const checkMinQty = ({ active, qty, minQty, packagingUnit }) => {
  if (active == UOM_TYPES.sheets || active == UOM_TYPES.rolls) {
    if (qty < minQty) {
      return false;
    }
  }

  if (active == UOM_TYPES.ries) {
    if (qty < Math.ceil(minQty / packagingUnit)) {
      return false;
    }
  }

  if (active == UOM_TYPES.pallete) {
    if (qty < Math.ceil(minQty / packagingUnit)) {
      return false;
    }
  }
  return true;
};

/**
 * @getMinQty return MOQ
 * @param {string} active packageType
 * @param {number} packagingUnit
 * @returns {Number} MOQ
 */
export const getMinQty = ({ active, minQty, packagingUnit }) => {
  if (active == UOM_TYPES.ries || active == UOM_TYPES.pallete) {
    return Math.ceil(minQty / packagingUnit);
  }

  return minQty;
};

export const showAlert = (type, ConfirmBtnText) => {
  //Add custom or icon type in the last (Your notification-custom) to fire custom alert
  if (type.includes("custom")) {
    var message = type.split("-")[0];
    type = "custom";
  }
  if (type.includes("err")) {
    var message = type.split("-")[0];
    type = "err";
  }
  if (type.includes("info")) {
    var message = type.split("-")[0];
    type = "info";
  }
  if (type.includes("confirmation")) {
    var message = type.split("-")[0];
    type = "confirm";
  }
  switch (type) {
    case "Deleted":
      swal.fire({
        title: "Deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      break;
    case "Inserted":
      swal.fire({
        title: "Inserted",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      break;
    case "Updated":
      swal.fire({
        title: "Updated",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      break;
    case "custom":
      swal.fire({
        text: message,
        icon: "success",
      });
      break;
    case "err":
      swal.fire({
        text: message,
        icon: "error",
      });
      break;
    case "info":
      swal.fire({
        text: message,
        icon: "info",
      });
      break;
    case "confirm":
      return swal.fire({
        text: message,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: ConfirmBtnText,
      });

    case "confirmDelete":
      return swal.fire({
        title: "Are you sure",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

    default:
      swal.fire({
        title: "Some error occurred",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      break;
  }
};

export const windowScrollUp = () => {
  return window.scroll(0, 0);
};

export const getLocaleString = (amount) => {
  //amount format Like 1,234,567.89(US) to 1.234.567,89(GR)
  //de-DE for German (Germany), 
  //hi-IN for INDIA 
  //en-US for USA
  
  if(amount){
    return (amount).toLocaleString('de-DE');    
  } return 0
  
};


