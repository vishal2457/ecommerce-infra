import { getCustomerPricing } from "../../utility/commonUtility";
import api from "../api";
import {
  GET_SINGLE_PRODUCT,
  GENERIC_ERROR,
  OVERWRITE_PRODUCT,
  RESET_STATE,
} from "./types";

//get single product
export const getProducts = (id, authenticated) => async (dispatch) => {
  // console.log(id, "this is id");
  await api
    .get(`/products/getSinglePublishedProduct/${id}`)
    .then(async (res) => {
      if (authenticated) {
        api
          .get("/CustomerGroups/getAllGroupsForCustomer")
          .then(async (customerGroups) => {
            let CustomersPricing = await getCustomerPricing(
              res.data.data.data?.Pricings,
              customerGroups.data.data
            );
            dispatch({
              type: GET_SINGLE_PRODUCT,
              payload: { finalData: res.data, CustomersPricing },
            });
          })
          .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
      } else {
        let CustomersPricing = await getCustomerPricing(
          res.data.data.data?.Pricings,
          []
        );
        dispatch({
          type: GET_SINGLE_PRODUCT,
          payload: { finalData: res.data, CustomersPricing },
        });
      }
    })
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};

//get single product using properties
export const overwriteProduct = (obj) => async (dispatch) => {
  await api
    .post("/products/singleProdFromProperties", obj)
    .then((res) =>
      dispatch({ type: OVERWRITE_PRODUCT, payload: { data: res.data, obj } })
    )
    .catch((err) => dispatch({ type: GENERIC_ERROR, payload: err }));
};

export const resetStateOnUnmount = () => async (dispatch) => {
  dispatch({ type: RESET_STATE });
};
