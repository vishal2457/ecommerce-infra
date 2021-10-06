import * as axios from "axios";
import { APIURL, showAlert, TOKEN_PREFIX } from "../utility/commonUtility";

const fetchClient = () => {
  const defaultOptions = {
    baseURL: APIURL,
    headers: {
      "Content-Type": "application/json",
    },
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_PREFIX);
    config.headers.Authorization = token ? token : null;
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err?.response?.status == 401) {
        localStorage.removeItem(TOKEN_PREFIX);
        window.location.href = "Auth?type=Login"
        // showAlert(`${err.response.data.msg}-err`)
      } else {
        err?.response?.data?.msg
          ? showAlert(`${err.response.data.msg}-err`)
          : showAlert("Something went wrong-err");
      }
      return Promise.reject(err);

      // initializeStore.dispatch(logoutUser(err.response));
    }
  );

  return instance;
};

export default fetchClient();
