import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import constSlice from "./slices/constSlice";
import modelSlice from "./slices/modelSlice";
import pwaReducer from "./slices/pwaSlice";
import priceSlice from "./slices/priceSlice";

const rootReducer = combineReducers({
  consts: constSlice,
  model: modelSlice,
  user: userReducer,
  pwa: pwaReducer,
  price: priceSlice,
});

export default rootReducer;
