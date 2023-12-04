import React from "react";
import "./LandingStyle.css";
import Group1 from "../../assets/img/Group1_.png";
import Group2 from "../../assets/img/Group2.png";
import Group3 from "../../assets/img/Group3.png";
import Group4 from "../../assets/img/Group4.png";
import Group5 from "../../assets/img/Group5.png";
import Group6 from "../../assets/img/Group6.png";
import Group7 from "../../assets/img/Group7.png";
import Group8 from "../../assets/img/Group8.png";

const addon=() =>{
  return (
    <div className="container-fluid mt-1 p-0">
      <div className="addon-head">
        <h3 className="landing-titles">Value Add-ons</h3>
      </div>

      <div className="addon-top addon-head p-5">
        <div className="row">
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group1} alt="" />
            <h4 className="landing-btn-text addon-text">
              Login to your account its safe and handy.
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group2} alt="" />
            <h4 className="landing-btn-text">
              Now invoice management is just a click away.
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group3} alt="" />
            <h4 className="landing-btn-text">
              Manage your inventory in few minutes.
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group4} alt="" />
            <h4 className="landing-btn-text">
              Manage and monitor your sales in an efforless way.
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group5} alt="" />
            <h4 className="landing-btn-text">
              Manage and monitor individual client records.
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group6} alt="" />
            <h4 className="landing-btn-text">
              Manage and monitor financials in minutes
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group7} alt="" />
            <h4 className="landing-btn-text">
              No hidden cost, subscription based service for easy access
            </h4>
          </div>
          <div className="col-sm col-md-4 col-lg-3">
            <img src={Group8} alt="" />
            <h4 className="landing-btn-text">
              Track the mobile from whom you have purchased and sold.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
export default addon;
