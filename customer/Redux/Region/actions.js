import {
  GET_COUNTRIES,
  GET_COUNTRIES_ERROR,
  GET_STATES,
  GET_STATES_ERROR,
  GET_CITIES,
  GET_CITIES_ERROR,
} from "./types";
import API from "../api";

export const getCountries = (body) => async (dispatch) => {
  API.get("/region/countries", body)
    .then((res) => {
      dispatch({ type: GET_COUNTRIES, payload: res.data });
    })
    .catch((err) => dispatch({ type: GET_COUNTRIES_ERROR, payload: false }));
};

export const getStates = (id) => async (dispatch) => {
  API.get(`/region/states/${id}`)
    .then((res) => {
      dispatch({ type: GET_STATES, payload: res.data });
    })
    .catch((err) => dispatch({ type: GET_STATES_ERROR, payload: false }));
};

export const getCities = (state_id, country_id) => async (dispatch) => {
  API.get(`/region/cities/${state_id}/${country_id}`)
    .then((res) => {
      dispatch({ type: GET_CITIES, payload: res.data });
    })
    .catch((err) => dispatch({ type: GET_CITIES_ERROR, payload: false }));
};
