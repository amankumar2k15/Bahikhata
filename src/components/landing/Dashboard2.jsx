import React from "react";
import "./LandingStyle.css";
import dashboard2 from "../../assets/img/dashboard2.png";
import DashboardTotalInventory from "../../assets/img/DashboardTotalInventory.png";
import tri_right from "../../assets/img/tri_right.png";

function Dashboard2({ img }) {
  return (
    <div className="container-fluid p-0 ">
      <div className="row mt-5">
        <div className="row mt-5 p-0">
          <div className="dashboard2-img1 row p-0">
            <img className="col-sm-6 mt-sm-5" src={img} alt="" />
            <div className="col-sm-1"></div>
            <div className="col-sm-5">
              <div className="dash2-text">
                <h3 className="landing-titles">
                  It's all in one solution for the mobile re-sellers
                </h3>
                <p className="landing-subtitles2 mt-3">
                  Discover the latest features of futuristic khata management
                  and take your business to next level. This system is easy to
                  use and saves lots of time.
                </p>
                <h6 className="landing-subtitles3 mt-3">
                  Lifeline of your business. Go from messy business ower to
                  well-managed visionary business owner.
                </h6>
              </div>
            </div>
            <div className="w-100">
              <img className="plan-tri" src={tri_right} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard2;
