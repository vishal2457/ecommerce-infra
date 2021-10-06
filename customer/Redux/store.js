import { createStore, applyMiddleware } from 'redux'
import rootReducer from "./rootReducer";
import thunk from "redux-thunk"

export function initializeStore (initialState = {}) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk) )
}