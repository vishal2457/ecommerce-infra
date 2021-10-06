import React, { useReducer, useContext, createContext } from 'react';
import { reducer } from './shop.reducer';
const ShopContext = createContext({});
const INITIAL_STATE = {
     dropDownValues: {}
};

const useShopActions = (initialCart = INITIAL_STATE) => {
  const [state, dispatch] = useReducer(reducer, initialCart);

  const getProperties = (item) => {    
    dispatch({ type: 'GET_PROPERTIES', payload: { ...item } });
  };

  return {
    state,
    getProperties
  };
};

export const ShopProvider = ({ children }) => {
  const {
    state,
    getProperties
  } = useShopActions();
//   const { rehydrated, error } = useStorage(state, rehydrateLocalState);

  return (
    <ShopContext.Provider
      value={{
       properties: state.properties,
       getProperties: getProperties
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);