import React from "react";
import "./LandingStyle.css";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../assets/img/group1.png";
import tri_left from "../../assets/img/tri_left.png";
import logo_ from "../../assets/img/logo_.png";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  return (
    <div className="container-fluid p-0 m-0 ">
      <div className="background-img ">
        <div className="row pt-sm-5 justify-content-between">
          <div className="col-sm-5 ms-5 ps-5 ">
            <div className="logo_ ">
              <img src={logo_} alt="logo_" />
            </div>
          </div>
          <div className="col-sm-5 btns">
            <div className=" d-flex justify-content-sm-end justify-content-center pe-sm-5 ps-xs-3">
              <button
                className="text-white btn text-mobile btn-link text-decoration-none sign-btn fs-20 ml-5"
                onClick={(event) => {
                  event.stopPropagation();
                  history.push("/login");
                }}
              >
                Login
              </button>
              <button className="signup-btn btn-text-font fs-18">
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            <div className="text-wrapper">
              <div className="text-cont1">
                <h3 className="landing-titles">
                  Want to increase sales but confused in management
                </h3>
              </div>
              <div className="text-cont2">
                <h6 className="landing-subtitles">
                  Give modern age features to your sales management. It'works
                  and speeds up your sales. Effortlessly do this.
                </h6>
                <div className="text-cont3 pb-sm-5">
                  <p className="landing-subtitles2">
                    Do you want to enjoy these features?
                  </p>
                  <button className="btn-reg fs-20 mb-5">Register Here</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-5"></div>
      </div>
      <img className="img1" src={tri_left} />

      {/* <Carousel className="carousel-height">
        <Carousel.Item></Carousel.Item>
      </Carousel> */}
    </div>
  );
}

export default Register;
