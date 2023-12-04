import { clearStorage } from "../../helpers/token.helper";
import StorageUtils from "../../utils/storage.utils";
import {
  USER_LOGIN_FAILED,
  USER_LOGIN_PROGRESS,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT
} from "./user.actionsTypes";

const initialState = {
  loading: false,
  userData: StorageUtils.getItemFromStorage("USER_DATA") || {}
};

export default function ownerReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_PROGRESS:
      return { ...state, ...{ loading: true } };
    case USER_LOGIN_SUCCESS:
      return { ...state, ...{ loading: false, userData: action.payload } };
    case USER_LOGIN_FAILED:
      return { ...state, ...{ loading: false, errors: action.payload } };
    case USER_LOGOUT:
      clearStorage()
      return { ...state, ...{ loading: false, errors: "", userData: {} } };
    default:
      return state;
  }
}
