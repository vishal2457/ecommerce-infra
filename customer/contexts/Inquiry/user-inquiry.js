import React, { useReducer, useContext, createContext } from "react";
import { useStorage } from "../../utility/use-storage";
import { reducer } from "./inquiry-reducer";
const InquiryContext = createContext({});

const INITIAL_STATE = {
  selectedItems: [],
};

const userInquiryActions = (intialState = INITIAL_STATE) => {
  const [state, dispatch] = useReducer(reducer, intialState);
  const addItemHandler = (item, inputData, key, changeType) => {
    dispatch({ type: "ADD_ITEM", payload: { item, inputData, key, changeType }});
  };

  const removeItemHandler = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: { ...item }});
  };

  const emptySelectedItems = () => {
    dispatch({type: "EMPTY_SELECTED_ITEMS", payload: []})
  }

  const rehydrateLocalState = (payload) => {
    dispatch({ type: "REHYDRATE", payload });
  };

  return {
    addItemHandler,
    rehydrateLocalState,
    removeItemHandler,
    state,
    emptySelectedItems
  };
};

export const InquiryProvider = ({ children }) => {
  const {
    addItemHandler,
    removeItemHandler,
    rehydrateLocalState,
    state,
    emptySelectedItems
  } = userInquiryActions();
  const { rehydrated, error } = useStorage(state, rehydrateLocalState);
  return (
    <InquiryContext.Provider
      value={{
        selectedItems: state.selectedItems,
        addItem: addItemHandler,
        removeItem: removeItemHandler,
        emptySelectedItems
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};
export const useInquiry = () => useContext(InquiryContext);
