import {
  GET_SINGLE_PRODUCT,
  GENERIC_ERROR,
  OVERWRITE_PRODUCT,
  RESET_STATE,
} from "./types";
import Toast from "../../components/Toast";
const initialState = {
  product: null,
  productID: null,
  loading: true,
  tempProduct: null,
  noProduct: false,
  relatedProducts: [],
  CustomersPricing: []
};
export default function (state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case GET_SINGLE_PRODUCT:
      return {
        ...state,
        product: payload.finalData.data.data,
        productID: payload.finalData.data.data.ID,
        loading: false,
        CustomersPricing: payload.CustomersPricing,
        tempProduct: payload.finalData.data.data,
        relatedProducts: payload.finalData.data.relatedProducts
          ? payload.finalData.data.relatedProducts
          : [],
      };

    case OVERWRITE_PRODUCT:
      const { key, value, product } = payload.obj;
      let tempPro = product ? product : state.tempProduct;
      const {
        ColorID,
        GrainID,
        PaperPrintibilityID,
        PaperQualityID,
        PaperClassID,
        GsmID,
        UomID,
      } = tempPro;

      let obj = {
        ColorID,
        GrainID,
        PaperPrintibilityID,
        PaperQualityID,
        PaperClassID,
        GsmID,
        UomID,
      };

      for (let i of Object.keys(obj)) {
        if (i == key) {
          obj[key] = value.ID;
        }
      }

      if (!payload?.data?.data) {
        Toast({
          type: "info",
          message: "No Product with this specification !",
          image: null,
          ID: "1",
        });
      }

      const removeFirstElement = (arr) => {
        arr.shift();
        return arr;
      }

      return {
        ...state,
        product: payload?.data?.data?.length ? payload.data.data[0] : state.product,
        productID: payload?.data?.data[0]?.ID,
        loading: false,
        tempProduct: payload?.data.data?.length ? payload.data.data[0] : obj,
        noProduct: payload.data?.data?.length ? false : true,
        relatedProducts: payload?.data?.data?.length
        ? removeFirstElement(payload?.data?.data)
        : [],
      };

    case RESET_STATE:
      return {
        ...state,
        product: null,
        loading: true,
        noProduct: false,
        relatedProducts: [],
      };

    case GENERIC_ERROR:
    default:
      return state;
  }
}
