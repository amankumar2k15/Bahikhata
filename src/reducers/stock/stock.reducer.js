import {
  LOAD_STATUS_FAILED,
  LOAD_STATUS_PROGRESS,
  LOAD_STATUS_SUCCESS,
  PRODUCT_STATUS_FAILED,
  PRODUCT_STATUS_PROGRESS,
  PRODUCT_STATUS_SUCCESS
} from "./stock.actionTypes";
import moment from "moment";

const initialState = {
  loading: false,
  search: "",
  postData: {
    page: 1,
    limit: 20,
    total: 0
  },
  products: [],
  currentTab: "Inventory",
  dukaandar: {
    address: "",
    email: "",
    firstName: "",
    image: "",
    lastName: "",
    mobile: "",
    payment_detail: [],
    shop_name: ""
  },
  status: {
    dashboard: { totalInventory: [], totalPurchase: [], totalSold: [] },
    khata: { creditors: [], debtors: [] }
  },
  openingStock: { date: "", stock: 0 }
};

export default function stockReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCT_STATUS_PROGRESS:
      return { ...state, ...{ loading: true } };
    case PRODUCT_STATUS_SUCCESS:
      return { ...state, ...{ loading: false, ...action.payload } };
    case PRODUCT_STATUS_FAILED:
      return { ...state, ...{ loading: false, errors: action.payload } };
    case LOAD_STATUS_PROGRESS:
      return { ...state, ...{ loading: true } };
    case LOAD_STATUS_SUCCESS:
      const {
        payload: { dukaandar, postData, products, status, openingStock }
      } = action;
      return {
        ...state,
        ...{
          loading: false,
          dukaandar,
          postData,
          products,
          status,
          openingStock
        }
      };
    case LOAD_STATUS_FAILED:
      return { ...state, ...{ loading: false, errors: action.payload } };
    default:
      return state;
  }
}
