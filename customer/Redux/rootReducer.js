import { combineReducers } from "redux";
import Products from "./Products/reducer";
import Auth from "./Auth/reducer";
import Region from "./Region/reducer";
import Shop from "./Shop/reducer";
import Inquiry from "./Inquiry/reducer";
import Header from "./layout/Header/reducer";
import Chat from "./Chat/reducer";

export default combineReducers({
  Products,
  Auth,
  Region,
  Shop,
  Inquiry,
  Header,
  Chat
});
