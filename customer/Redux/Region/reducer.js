import {
  GET_COUNTRIES,
  GET_COUNTRIES_ERROR,
  GET_STATES,
  GET_STATES_ERROR,
  GET_CITIES,
  GET_CITIES_ERROR,
} from "./types";

const initialState = {
  loading: true,
  countryList: [],
  stateList: [],
  cityList: [],
};
export default function (state = initialState, actions) {
  const { type, payload } = actions;

  switch (type) {
    case GET_COUNTRIES:
      //console.log("Region REDUCER....");
      return {
        ...state,
        loading: false,
        countryList: payload.data,
      };
    case GET_COUNTRIES_ERROR:
      return {
        ...state,
      };

    case GET_STATES:
      return {
        ...state,
        loading: false,
        stateList: payload.data,
      };

    case GET_STATES_ERROR:
      return {
        ...state,
      };

    case GET_CITIES:
      return {
        ...state,
        loading: false,
        cityList: payload.data,
      };

    case GET_CITIES_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
}
