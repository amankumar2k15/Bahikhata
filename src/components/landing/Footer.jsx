import React from "react";
import "./LandingStyle.css";
import footerboard from "../../assets/img/footerboard1.png";

function Footer() {
  return (
    <div className="container-fluid p-0">
      <div className="footer-img">
        <div className="footer-rect">
          <div className="footer-text row">
            <div className="col-sm-6">
              <h3 className="register-text">Register Here to know More</h3>
              <p className="landing-subtitles2 footer-t2">
                Discover the latest features of futuristic khata management and
                take your business to next level.
              </p>
            </div>
            <div className="col-sm-6">
              <button className="btn-reg footer-btn landing-btn-text fs-20">
                Register Here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
