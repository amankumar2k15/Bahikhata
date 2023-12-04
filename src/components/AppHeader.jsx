import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  getDukaandarData,
  getStockLoadingStatus
} from "../reducers/stock/stock.selectors";
import CommonUtils from "../utils/common.utils";

const AppHeader = ({ loading, dukandaar }) => {
  const history = useHistory();
  const pathname = CommonUtils.getPathFromHistory(history);

  const AppTitle = () => (
    <h1 className="fs-w600 page-info-text text-primary">
      {pathname === "/dashboard" ? "Dashboard" : "Khata"}
    </h1>
  );

const AppUserImage = () => (
    <Link to="/profile">
      <div className="user-img ps-2">
        
        <img
          src={dukandaar.image}
          alt={dukandaar.firstName}
          style={{
            height: "35px",
            width: "35px",
            borderRadius: "50%"
          }}
        />
      </div>
    </Link>
);

  const AppUserTitle = () => (
    <div className="user-name-deg text-end">
      <h6 className="user-info-text text-primary fs-w600">
        {dukandaar.firstName} {dukandaar.lastName}
      </h6>
      <p className="header-muted fs-w500 fs-14">Owner</p>
    </div>
  );
  return (
    <div className="container-fluid ps-0">
      <ToastContainer />
      <div className="d-sm-flex align-items-center">
        <div className="header-logo d-flex align-items-center">
          <div>
            <Link to="/" className="text-decoration-none text-primary">
              <div className="logo bg-white px-3  py-2 pb-sm-2 pb-0">
                <i className="fas fa-book-reader"></i> Bahi Khata
              </div>
            </Link>
            <div className="page-info ms-3 d-sm-none d-block">
              <AppTitle />
            </div>
          </div>
          <div className="page-info ms-3 d-sm-block d-none">
            <AppTitle />
          </div>
          {!loading && (
            <div className="user-info ms-auto d-flex align-items-center d-sm-none d-block">
              <AppUserTitle />
              <div>
                <AppUserImage />
              </div>
            </div>
          )}
        </div>
        {!loading && (
          <div className="user-info ms-auto d-flex align-items-center d-sm-block d-none">
            <div className="d-flex">
              <AppUserTitle />
              <AppUserImage />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state),
  dukandaar: getDukaandarData(state)
});

export default connect(mapStateToProps)(AppHeader);
