import { CHANGE_SLIDER, RESET_SLIDER, UPDATE_SLIDER } from "./types";

export const onUpdateSlider = (update) =>  async (dispatch) => {
    // console.log(update, "updaye");
    dispatch({type: UPDATE_SLIDER, payload: update})
  };
  
  export const onChangeSlider = (values) =>  async (dispatch) => {
    dispatch({type: CHANGE_SLIDER, payload: values})
  };

  export const resetSlider = () => async (dispatch) => {
    dispatch({type: RESET_SLIDER})
  }