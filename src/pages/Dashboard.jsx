import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadDashboardStatus } from "../reducers/stock/stock.thunks";
import {
  getDahboardPostData,
  getStockLoadingStatus
} from "../reducers/stock/stock.selectors";
import { getUserId } from "../reducers/user/user.selectors";

const DashboardV2 = ({
  loading,
  dukandaarId,
  postData,
  loadDashboardStatus
}) => {
  useEffect(() => {
    loadDashboardStatus(dukandaarId, postData);
  }, []);

  return (
    <div className="container-fluid mt-3">
      {/* <ToastContainer /> */}
      <div className="row mx-0">
        <div className="p-sm-3 pb-0 rounded  bg-white">
          <div className="d-sm-flex justify-content-between">
            <h2 className="text-primary fs-6 fs-w600">TEst </h2>
            <div
              className="p-2 mt-sm-0 mt-2 download-inventory cursor"
              
            >
              <span className="me-1">Download Inventory </span>
              {/* <FontAwesomeIcon icon="fa-file-arrow-down" /> */}
              <i className="fa-solid fa-file-arrow-down"></i>
              {/* <FontAwesomeIcon icon="columns" className="" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state),
  dukandaarId: getUserId(state),
  postData: getDahboardPostData(state)
});

export default connect(mapStateToProps, { loadDashboardStatus })(DashboardV2);
// export default DashboardV2;
