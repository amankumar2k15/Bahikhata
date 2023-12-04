import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Redirect } from "react-router-dom";
import { setToken } from "../helpers/token.helper";
import { LoginService } from "../services/api.service";
import { toast, ToastContainer } from "react-toastify";
import Carousel from "react-bootstrap/Carousel";
import HeaderLogo from "../assets/img/HeaderLogo";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import LoginConstant from "../constants/login";
import AppFormInput from "../components/AppFormInput";
import LoginFormInput from "../components/PurchaseForm/LoginFormFile";
import {
  getUserState,
  isUserLoginLoading,
} from "../reducers/user/user.selectors";
import {
  loginFailed,
  loginProgress,
  loginSuccessfully,
} from "../reducers/user/user.actions";
import StorageUtils from "../utils/storage.utils";
import "./Page.css";
import AppLoaderButton from "../components/AppLoaderButton";
import AppLink from "../components/AppLink";

const Login = ({
  loading,
  loginProgress,
  loginFailed,
  loginSuccessfully,
  authToken,
}) => {
  const history = useHistory();
  if (authToken) {
    history.replace("/");
  }
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register } = useForm();
  const { carouselItems, formControls, userStorageKey } = LoginConstant;

  const showToast = (isError, message) => {
    const option = { timeOut: 5000 };
    if (isError) {
      toast.error(message, option);
      loginFailed(message);
      return;
    }
    toast.success(message, option);
  };

  const onSubmit = (formData) => {
    setIsLoading(true);

    loginProgress();
    if (!formData.email || !formData.password) {
      setIsLoading(false);
      showToast(true, "Please Enter Username & Password");
      return;
    }
    LoginService(formData)
      .then((response) => {
        const { message, data } = response.data;
        // showToast(false, message);
        const { token, _id } = data;
        localStorage.setItem("userId", _id);
        setToken(token);
        StorageUtils.setItemInStorage("USER_DATA", data);
        loginSuccessfully(data);
        history.replace("/");
        setIsLoading(false);
        toast.success("Dukandar login successfully", { timeOut: 3000 });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Please enter valid email  and password.", {
          timeOut: 5000,
        });
      });
  };

  return (
    <div className="container container-login">
      <ToastContainer />
      {/* Header */}
      <div className="image w-100 h-auto">
        <HeaderLogo />
      </div>
      <div className="row mt-sm-5 mt-2">
        {/* Carousel */}
        <div className="col-md-7">
          <div className="mw-100 login-carousel-wrapper">
            <Carousel>
              {carouselItems.map(({ interval, caption, component }) => {
                return (
                  <Carousel.Item
                    key={caption.replace(/ /gi, "")}
                    interval={interval}
                  >
                    {component}
                    <Carousel.Caption className="carousel-caption d-flex justify-content-center mw-100">
                      {caption}
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
        </div>
        {/* Login Form */}
        <div className="col-md-5">
          <div className="card p-sm-3 p-2 box1" style={{ color: "#143b64" }}>
            <div className="m-1 m-sm-3 p-2">
              <h3 className="fw-normal mb-3">Login</h3>
              <p className="app-btn-link">Please login to continue</p>
            </div>
            <div className="card-body p-sm-4 p-2 mt-0 ">
              <form onSubmit={handleSubmit(onSubmit)}>
                {formControls.map((item) => (
                  <LoginFormInput
                    key={item.name}
                    register={register}
                    {...item}
                  />
                ))}
                <p className="forgot-password text-right forgot-pass-right mt-2 p-2 fw-normal">
                  <AppLink to={"/forgot-password"} label={"Forgot Password?"} />
                </p>
                <AppLoaderButton
                  loading={isLoading}
                  className="login-btn p-2 fs-20"
                  label={"Login"}
                  loaderColor={"#fff"}
                />
                <p className="forgot-password text-center mt-2">
                  <AppLink
                    to={"/register"}
                    label={"Don't have an account? Create a new account"}
                  />
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: isUserLoginLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  loginProgress: () => dispatch(loginProgress()),
  loginFailed: (error) => dispatch(loginFailed(error)),
  loginSuccessfully: (data) => dispatch(loginSuccessfully(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
