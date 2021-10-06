import { CHANGE_SLIDER, RESET_SLIDER, UPDATE_SLIDER } from "./types";


let intialState = {
    domain: [0, 1000],
    values: [0, 1000],
    update: [0, 1000],
    reversed: false,
    loading: true
}

export default function (state = intialState, actions) {
    const { type, payload } = actions;
    switch (type) {
    
        case UPDATE_SLIDER:
            return {
              ...state,
              values: payload,
            };
      
          case CHANGE_SLIDER:
            return {
              ...state,
              update: payload,
            };

            case RESET_SLIDER:
              return {
                ...state,
                values: [0,1000]
              }
    
        default: return  {...state}
    }
}