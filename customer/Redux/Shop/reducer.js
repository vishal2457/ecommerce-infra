import { SHOP_TYPE } from "../../utility/commonUtility";
import {
  GET_PRODUCTS,
  SET_INITIAL_FILTERS,
  GSM_FILTER,
  UPDATE_SLIDER,
  CHANGE_SLIDER,
  TOGGLE_FILTER_SEARCH,
  QUERY_STRING,
  GET_GROUPS,
  EMPTY_PRODUCTS_ON_LOAD,
  GET_FILTERED_PRODUCTS_SHOP,
  TOGGLE_SHOP_TYPE,
  SIZE_CHANGE,
  GET_SEARCH_PRODUCTS,
} from "./types";

const initialState = {
  filters: null,
  products: [],
  count: 0,
  loading: true,
  type: SHOP_TYPE.GRID,
  domain: [0, 1000],
  values: [0, 1000],
  update: [0, 1000],
  size: {
    length: [10, 1000],
    width: [10, 1000],
  },
  reversed: false,
  filterSearch: {
    ProductGroup: { query: "", active: false },
    ProductSubgroup: { query: "", active: false },
    PaperClass: { query: "", active: false },
    PaperQuality: { query: "", active: false },
    PaperPrintibility: { query: "", active: false },
    PaperColor: { query: "", active: false },
    MeasurementUnit: { query: "", active: false },
    PaperGrain: { query: "", active: false },
    PaperColor: { query: "", active: false },
  },
  groups: [],
};

export default function (state = initialState, actions) {

  const { type, payload } = actions;
  
  switch (type) {
    case SET_INITIAL_FILTERS:
      return {
        ...state,
        filters: payload,
      };

    case EMPTY_PRODUCTS_ON_LOAD:
      return {
        ...state,
        products: [],
      };

    case GET_PRODUCTS:
      
      return {
        ...state,
        loading: false,
        count: payload.data.count,
        products: state.products.concat(payload.data.rows),
      };

    case GET_FILTERED_PRODUCTS_SHOP:
      return {
        ...state,
        loading: false,
        count: payload.data.count,
        products: payload.data.rows,
      };

    case GSM_FILTER:
      return {
        ...state,
        loading: false,
        count: payload.data.count,
        products: payload.data.rows,
      };

    case UPDATE_SLIDER:
      return {
        ...state,
        loading: false,
        values: payload,
      };

    case CHANGE_SLIDER:
      return {
        ...state,
        loading: false,
        update: payload,
      };

    case TOGGLE_FILTER_SEARCH:
      return {
        ...state,
        filterSearch: {
          ...state?.filterSearch,
          [payload]: {
            query: "",
            active: !state?.filterSearch[payload]?.active,
          },
        },
      };

    case QUERY_STRING:
      return {
        ...state,
        filterSearch: {
          ...state?.filterSearch,
          [payload?.key]: {
            query: payload.value,
            active: state?.filterSearch[payload?.key].active,
          },
        },
      };
    case GET_GROUPS:
      return {
        ...state,
        loading: false,
        groups: payload.data,
      };

    case TOGGLE_SHOP_TYPE:
      return {
        ...state,
        type: payload,
      };

    case SIZE_CHANGE:
      return {
        ...state,
        loading: false,
        size: payload,
      };

    case GET_SEARCH_PRODUCTS:
      console.log(payload);
      return {
        ...state,
        loading: false,
        count: payload.data.count,
        products: payload.data.rows,
      };

    default:
      return { ...state };
  }
}
