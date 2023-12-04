import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import {
  getOpeningStockStatus,
  getStockLoadingStatus
} from "../reducers/stock/stock.selectors";
import { useHistory } from "react-router-dom";
import StockNotificationConstant from "../constants/stock-notification";
import CommonUtils from "../utils/common.utils";

const AppStockNotification = ({ loading, stock }) => {
  const history = useHistory();
  const pathname = CommonUtils.getPathFromHistory(history);
  const type = CommonUtils.getCharRemoveFromPath(pathname);
  const data = StockNotificationConstant[type];

  return (
    <div className="container-fluid pt-3">
      <div className="d-flex new-off-can">
        <div className="column-first">
          <h2 className="text-primary fs-600 fs-20 mb-2">{data.header_left}</h2>
          <small className="text-muted fs-14 fs-w400">
            {data.sub_header_left}
          </small>
        </div>
        {!loading && data.header_right !== null && (
          <div className="column-second ms-auto text-end mt-sm-0 mt-3">
            <h2 className="text-primary fs-18 fs-w600 mb-2">
              {data.header_right}
              {stock.stock}
            </h2>
            <small className="text-muted fs-14 fs-w400">
              {moment(stock.date).format("Do MMM YYYY")}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state),
  stock: getOpeningStockStatus(state)
});

export default connect(mapStateToProps)(AppStockNotification);
