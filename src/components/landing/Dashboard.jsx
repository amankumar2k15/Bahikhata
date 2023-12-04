import React from "react";
import "./LandingStyle.css";
import dashboard1 from "../../assets/img/dashboard1.png";
import tri_left2 from "../../assets/img/tri_left2.png";
import ItemsPurchasedToday from "../../assets/img/ItemsPurchasedToday.png";

function dashboard({ img }) {
  return (
    <div className="container-fluid mt-5 p-0">
      <div className="row">
        <div className="col-sm-6">
          <div className="dash-text">
            <div>
              <h3 className="landing-titles">
                It's all in one solution for the mobile re-seller
              </h3>
            </div>
            <div>
              <p className="landing-subtitles2 mt-3">
                Discover the latest features of futuristic khata management and
                take your business to next level. This system is easy to use and
                saves lots of time.
              </p>
            </div>
            <div>
              <h6 className="landing-subtitles3 mt-3">
                Lifeline of your business. Go from messy business owner to
                well-managed visionary business owner.
              </h6>
            </div>
          </div>
          <img className="dash-img1" src={tri_left2} alt="" />
        </div>
        <div className="col-sm-6 dash-img2">
          <img className="dash-screen" src={img} alt="" />
        </div>
      </div>
    </div>
  );
}

export default dashboard;
