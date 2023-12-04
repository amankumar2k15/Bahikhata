import React from "react";
import LoginDetail from "../../assets/img/LoginDetail1.svg";
function LoginDetails1() {
  return (
    <div className="container-fluid margin position-relative">
      <div className="row">
        <img src={LoginDetail} className="col-sm-5 bg-img" />
        <div className="col-sm-1"></div>
        <div className="col-sm-5 mt-5">
          <div className=" position-absolute margin-10">
            <h3 className="landing-titles pt-5">
              Login to your account is safe and easy
            </h3>
            <p className="landing-subtitles2 mt-3">
              Discover the latest features of futuristic khata management and
              take your business to next level. This system is easy to use and
              saves lots of time.
            </p>
            <h6 className="landing-subtitles3 mt-3">
              Lifeline of your business. Go from messy business ower to
              well-managed visionary business owner.
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDetails1;
