import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import dashboardInventoryReducer from "./slices/dashboardSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productsSlice";
import khataReducer from "./slices/khataSlice";
import headerReducer from "./slices/headerSlice";
import ownerReducer from "../reducers/user/user.reducer";
import stockReducer from "../reducers/stock/stock.reducer";



const rootReducer = combineReducers({
  header: headerReducer,
  inventory: dashboardInventoryReducer,
  user: userReducer,
  products: productReducer,
  khata: khataReducer,
  owner: ownerReducer,
  stock: stockReducer
});

// export default createStore(rootReducer);
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});
