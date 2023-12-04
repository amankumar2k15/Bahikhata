import { loadStatus } from "../../services/api.service";
import {
  loadAllStatusFailed,
  loadAllStatusProgress,
  loadAllStatusSuccessfully,
} from "./stock.actions";

export const loadDashboardStatus =
  (...data) =>
  (dispatch) => {
    dispatch(loadAllStatusProgress());
    loadStatus(...data)
      .then(([r1, r2, r3, r4, r5]) => {
        const dukaandar = r1.data.data;
        const [inventory] = r2.data.data;
        const openingStock = r3.data.data;
        const [khata] = r4.data.data;
        const { limit, page, total, products } = r5.data.data;
        dispatch(
          loadAllStatusSuccessfully({
            dukaandar,
            status: { dashboard: inventory, khata },
            postData: { limit, page, total },
            products,
            openingStock,
          })
        );
      })
      .catch((error) =>
        dispatch(loadAllStatusFailed("Error in loadDashboardStatus"))
      );
  };

// export const loadProductStatus = () => (dispatch) => {
//   dispatch(loginStart());
//   getDashboardStatusService()
//     .then((response) => dispatch(loginSuccessfully(response.data)))
//     .catch((error) => dispatch(loginFailed(error.message)));
// };

// export const loadOpeningStockStatus = () => (dispatch) => {
//   dispatch(loginStart());
//   getOpeningStockService()
//     .then((response) => dispatch(loginSuccessfully(response.data)))
//     .catch((error) => dispatch(loginFailed(error.message)));
// };

// export const loadKhataStatus = () => (dispatch) => {
//   dispatch(loginStart());
//   getKhataStatusService()
//     .then((response) => dispatch(loginSuccessfully(response.data)))
//     .catch((error) => dispatch(loginFailed(error.message)));
// };
