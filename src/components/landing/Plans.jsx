import React from "react";
import "./LandingStyle.css";
import plan from "../../assets/img/plan.png";
import tri_right from "../../assets/img/tri_right.png";

function Plans() {
  return (
    <div className="container-fluid  p-0">
      <div className="plan-img position-absolute"></div>
      <div className="plan-outer">
        <div className="plan-text">
          <div className="text-center">
            <h3 className="landing-titles text-light">Choose a Plan</h3>
            <h6 className="landing-subtitles2 plan-sub-cont text-light">
              Discover the latest features of futuristic khata management and
              take your business to next level. This system is easy to use and
              saves lots of time.
            </h6>
          </div>
        </div>
        <div className="d-sm-flex justify-content-around mt-5 ">
          <div className="plan-inner ">
            <div className="plan-price">
              <h6 className="plan-heading">Free Subscription</h6>
              <h3 className="price"> &#8377; 0 for 15 days</h3>
              <button className="plan-btn landing-subtitles fs-20">
                Get Started
              </button>
            </div>
          </div>
          <div className="plan-inner ">
            <div className="plan-price">
              <h6 className="plan-heading">Monthly Subscription</h6>
              <h3 className="price">&#8377; 550 per month</h3>
              <button className="plan-btn landing-subtitles fs-20">
                Get Started
              </button>
            </div>
          </div>
          <div className="plan-inner ">
            <div className="plan-price">
              <h6 className="plan-heading">
                Yearly Subscriptions
                <span className="recommended"> (Recommended)</span>
              </h6>
              <h3 className="price">&#8377; 6000 per year</h3>
              <button className="plan-btn landing-subtitles fs-20">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100">
        <img className="plan-tri" src={tri_right} alt="" />
      </div>
    </div>
  );
}

export default Plans;
