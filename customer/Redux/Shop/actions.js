import {
  FILTER_KEY,
  getLocalStorage,
  setLocalStorage,
} from "../../utility/commonUtility";
import api from "../api";
import {
  SET_INITIAL_FILTERS,
  GET_PRODUCTS,
  GENERIC_ERROR,
  GSM_FILTER,
  CHANGE_SLIDER,
  UPDATE_SLIDER,
  TOGGLE_FILTER_SEARCH,
  QUERY_STRING,
  GET_GROUPS,
  EMPTY_PRODUCTS_ON_LOAD,
  GET_FILTERED_PRODUCTS_SHOP,
  TOGGLE_SHOP_TYPE,
  SIZE_CHANGE,
  GET_SEARCH_PRODUCTS,
} from "./types";

export const getProducts = (filterObj) => async (dispatch) => {
  await api
    .post("/products/allProducts", filterObj)
    .then((res) => dispatch({ type: GET_PRODUCTS, payload: res.data }))
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};

export const getFilteredProducts = (filterObj) => async (dispatch) => {
  //console.log("get filtered products action");
  await api
    .post("/products/allProducts", filterObj)
    .then((res) =>
      dispatch({ type: GET_FILTERED_PRODUCTS_SHOP, payload: res.data })
    )
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};

//gsm filter
export const gsmFilter = (value) => async (dispatch) => {
  await api
    .post("/products/gsmFilter", value)
    .then((res) => dispatch({ type: GSM_FILTER, payload: res.data }))
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};

/**
 * @sets_intial_filters
 */
export const setInitialFilters = () => async (dispatch) => {
  let filters = getLocalStorage(FILTER_KEY);
  if (!filters) {
    setLocalStorage(FILTER_KEY, []);
    filters = [];
  }
  dispatch({ type: SET_INITIAL_FILTERS, payload: filters });
};

/**
 * @empty_product_state_oon_useeffect
 */

export const emptyProducts = () => async (dispatch) => {
  dispatch({ type: EMPTY_PRODUCTS_ON_LOAD });
};

export const setFilters = (filterObj) => async (dispatch) => {
  let filters = getLocalStorage(FILTER_KEY);

  if (filterObj.header) {
    if (!filters || filters.length == 0) {
      if (filterObj.ID == "ALL") return false;

      setLocalStorage(FILTER_KEY, [
        {
          ProductGroup: filterObj.ProductGroup,
          ID: filterObj.ID,
          header: true,
        },
      ]);
      filters = [];
    } else if (filterObj.ID == "ALL") {
      if (!getLocalStorage(FILTER_KEY)) return;
      setLocalStorage(
        FILTER_KEY,
        filters.filter((item) => !item.header)
      );
      return false;
    } else {
      let checkList = filters.filter((item) => {
        if (
          (Object.keys(item)[0] == "ProductGroup" ||
            Object.keys(item)[1] == "ProductGroup") &&
          item.header == true
        ) {
          return item;
        }
      });
      let checkListId = filters.filter((item) => {
        if (
          (Object.keys(item)[0] == "ProductGroup" ||
            Object.keys(item)[1] == "ProductGroup") &&
          item.ID == filterObj.ID
        ) {
          return item;
        }
      });

      // console.log("checkList....", checkList);
      // console.log("checkListId....", checkListId);

      let newFilter = filters;
      if (checkList.length) {
        newFilter = filters.map((item) =>
          item.header
            ? {
                ...item,
                ProductGroup: filterObj.ProductGroup,
                ID: filterObj.ID,
              }
            : { ...item }
        );
      } else if (checkListId.length) {
        newFilter = filters.map((item) =>
          item.ID == filterObj.ID
            ? {
                ...item,
                header: true,
              }
            : { ...item }
        );
      } else {
        newFilter.push({
          ProductGroup: filterObj.ProductGroup,
          ID: filterObj.ID,
          header: true,
        });
      }

      setLocalStorage(FILTER_KEY, newFilter);
    }
  } else {
    if (!filters) {
      setLocalStorage(FILTER_KEY, [filterObj]);
      filters = [];
    } else {
      let checkList = filters.filter((item) => {
        if (
          (Object.keys(item)[0] == "ProductGroup" ||
            Object.keys(item)[1] == "ProductGroup") &&
          item.header == true
        ) {
          return item;
        }
      });

      if (checkList?.[0]?.ProductGroup == filterObj.ProductGroup) {
        let myFilters = filters.filter((item) => !item.header);
        myFilters.push(filterObj);
        setLocalStorage(FILTER_KEY, myFilters);
      } else {
        filters.push(filterObj);

        setLocalStorage(FILTER_KEY, filters);
      }
    }
  }

  // if (!filters) {
  //   setLocalStorage(FILTER_KEY, [filterObj]);
  //   filters = [];
  // } else {
  //   filters.push(filterObj);
  //   setLocalStorage(FILTER_KEY, filters);
  // }
};

export const removeFilters = (filterObj) => async (dispatch) => {
  let filters = getLocalStorage(FILTER_KEY);
  if (!filters) return;
  let index = filters.findIndex(
    (filter) =>
      filter[Object.keys(filter)[0]] == filterObj[Object.keys(filterObj)[0]]
  );
  filters.splice(index, 1);
  setLocalStorage(FILTER_KEY, filters);
};

export const onUpdate = (update) => async (dispatch) => {
  // console.log(update, "ON UPDATE");
  dispatch({ type: UPDATE_SLIDER, payload: update });
};

export const onChange = (values) => async (dispatch) => {
  // console.log(values, "ON CHANGE");
  dispatch({ type: CHANGE_SLIDER, payload: values });
};

export const toggleFilters = (key) => async (dispatch) => {
  dispatch({ type: TOGGLE_FILTER_SEARCH, payload: key });
};

export const queryString = (key, value) => (dispatch) => {
  // console.log(key, "this is key");
  dispatch({ type: QUERY_STRING, payload: { key, value } });
};

//get groups for the customer
// hasmukh(30/03/2021)

export const getCustomerGroups = () => async (dispatch) => {
  await api
    .get("/CustomerGroups/getAllGroupsForCustomer")
    .then((res) => dispatch({ type: GET_GROUPS, payload: res.data }))
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};


/**
 * @Toggle_shop_type
 */
export const toggleShopType = (type) => async (dispatch) => {
  dispatch({type: TOGGLE_SHOP_TYPE, payload: type});
}
export const onSizeChange = (obj) => async (dispatch) => {
  // console.log(obj, "ON UPDATE");
  dispatch({ type: SIZE_CHANGE, payload: obj });
};

/**
 * @get_Searched_Products get products based on search-suggestion 
 * @param {obj} keyword from query params
 */
export const getSearchedProducts = (obj) => async (dispatch) => {
  await api
    .post("/customerHeader/searchSuggestionProducts", obj)
    .then((res) => dispatch({ type: GET_SEARCH_PRODUCTS, payload: res.data }))
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};
