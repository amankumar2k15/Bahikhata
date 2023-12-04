import {
  LOAD_STATUS_FAILED,
  LOAD_STATUS_PROGRESS,
  LOAD_STATUS_SUCCESS,
  PRODUCT_STATUS_FAILED,
  PRODUCT_STATUS_PROGRESS,
  PRODUCT_STATUS_SUCCESS
} from "./stock.actionTypes";

export const productStatusProgress = () => ({ type: PRODUCT_STATUS_PROGRESS });

export const productStatusFailed = (error) => ({
  type: PRODUCT_STATUS_FAILED,
  payload: error
});

export const productStatusSuccessfully = (product) => ({
  type: PRODUCT_STATUS_SUCCESS,
  payload: product
});

export const loadAllStatusProgress = () => ({ type: LOAD_STATUS_PROGRESS });

export const loadAllStatusFailed = (error) => ({
  type: LOAD_STATUS_FAILED,
  payload: error
});

export const loadAllStatusSuccessfully = (product) => ({
  type: LOAD_STATUS_SUCCESS,
  payload: product
});
