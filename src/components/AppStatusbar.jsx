import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, NavLink, Redirect, useHistory } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import StatusBarConstant from "../constants/statusbar";
import {
  getDashboardStatus,
  getStockLoadingStatus,
} from "../reducers/stock/stock.selectors";
import CommonUtils from "../utils/common.utils";

const AppStatusbar = ({ loading, status }) => {
  const history = useHistory();
  const pathname = CommonUtils.getPathFromHistory(history);

  const [activeTab, setActiveTab] = useState("");
  const [activeStatus, setActiveStatus] = useState([]);

  const isDashboardCard = StatusBarConstant.dashboard.some(
    (item) => item.path === pathname
  );

  const dataKey = isDashboardCard ? "dashboard" : "khata";

  const getDashboardCard = (x) => {
    const [cards] = status[dataKey][x.dataKey];
    const { totalNumber = 0, totalSum = 0 } = cards || [
      { totalNumber: 0, totalSum: 0, gstSum: 0 },
    ];
    return {
      ...x,
      leftAmount: totalNumber,
      rightAmount: gstSum ? totalSum + gstSum : totalSum,
    };
  };

  const getKhataCard = (x) => {
    const [cards] = status[dataKey][x.dataKey] || [{ totalSum: "Khata" }];
    const { totalSum = 0, gstSum = 0 } = cards;
    return {
      ...x,
      subHeading: gstSum ? gstSum + totalSum : totalSum,
    };
  };

  useEffect(() => {
    const data = StatusBarConstant[dataKey].map((item) => {
      if (pathname.includes(item.type)) {
        setActiveTab(item.type);
      }
      return isDashboardCard ? getDashboardCard(item) : getKhataCard(item);
    });
    setActiveStatus(data);
  }, [pathname, loading]);

  const AppLoader = ({ type }) => (
    <div className="text-center py-3">
      <SyncLoader size={10} color={activeTab === type ? "#fff" : "#143B64"} />
    </div>
  );

  return (
    <div className="container-fluid pt-3">
      <div
        className={
          isDashboardCard
            ? "make-scroll"
            : "make-scrolls flex-container align-items-stretch"
        }
      >
        {activeStatus.map((item, index) => (
          <div className={index === 1 ? "mx-1" : ""} key={item.type}>
            <NavLink
              to={item.path}
              className={`nav-link px-0 ${
                activeTab === item.title ? "active-nav" : ""
              }`}
              activeClassName="active-nav"
              {...(activeTab === item.title ? `aria-current="page"` : "")}
              exact
              onClick={() => {}}
            >
              {isDashboardCard ? (
                <div className="card p-2-5 tab-border-color shadow-sm">
                  <div className="row">
                    <div className="col-6 have-border">
                      <p className="fs-12 fs-w600">{item.leftText}</p>
                      {loading ? (
                        <AppLoader type={item.type} />
                      ) : (
                        <h1>{item.leftAmount}</h1>
                      )}
                    </div>
                    <div className="col-6 ps-3">
                      <p className="fs-12 fs-w600">{item.rightText}</p>
                      {loading ? (
                        <AppLoader type={item.type} />
                      ) : (
                        <h1>{item.rightAmount}</h1>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    item.title === "Debtors"
                      ? `card px-sm-3 px-0 py-2 mx-sm-3`
                      : `card px-sm-3 px-0 py-2`
                  }
                >
                  <div className="card-heading">
                    <p className="fs-12 fs-w600">{item.heading}</p>
                  </div>
                  {loading ? (
                    <AppLoader type={item.type} />
                  ) : (
                    <div className="card-body-text">
                      <h1 className="fs-40">{item.subHeading || 0}</h1>
                    </div>
                  )}
                </div>
              )}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state),
  status: getDashboardStatus(state),
});

export default connect(mapStateToProps)(AppStatusbar);
