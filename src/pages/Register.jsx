import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import BahikhataLogo from "../assets/img/BahikhataLogo";
import RegisterAvatar from "../assets/img/RegisterAvatar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setToken } from "../helpers/token.helper";
import {
  RegisterService,
  LoginService,
  getAllPlans,
} from "../services/api.service";
import CommonUtils from "../utils/common.utils";
import RegisterConstant from "../constants/register";
import AppFormInput from "../components/AppFormInput";
import AppFormSelect from "../components/AppFormSelect";
import {
  loginFailed,
  loginProgress,
  loginSuccessfully,
} from "../reducers/user/user.actions";
import {
  getUserState,
  isUserLoginLoading,
} from "../reducers/user/user.selectors";
import { connect } from "react-redux";
import "./Page.css";
import AppFormFile from "../components/AppFormFile";
import AppLoaderButton from "../components/AppLoaderButton";
import AppLink from "../components/AppLink";
import { useHistory } from "react-router-dom";
import { handlePayment } from "../helpers/paymentHelper";

const Register = ({ loginProgress, loginFailed, loginSuccessfully }) => {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = React.useState();
  const [plans, setPlans] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(async () => {
    const res = await getAllPlans();
    setPlans(res.data.data.plans);
  }, []);

  const onSelectFile = (files) => {
    setImage(files);
  };

  const { formInputControls, plansSelectControl, userImageControl } =
    RegisterConstant;

  const catchResponse = (err) => {
    loginFailed(err.response.data.message);
    toast.error(err.response.data.message, { timeOut: 2500 });
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    loginProgress();
    let formData = new FormData();

    formInputControls.forEach(({ name, type }) => {
      if (type === "number") {
        formData.append(name, parseInt(data[name]));
      } else {
        formData.append(name, data[name]);
      }
    });
    formData.append("plans", data.plans);
    image && formData.append("image", image);
    !image && formData.append("image", null);
    if (!CommonUtils.CheckPassword(data.password)) {
      setIsLoading(false);
      toast.error(
        "Password Should contain alphanumeric with Special Character",
        { timeOut: 5000 }
      );
      return;
    }
    RegisterService(formData)
      .then((res) => {
        let loginData = {
          email: data.email,
          password: data.password,
        };
        LoginService(loginData)
          .then((response) => {
            const { token, _id } = response.data.data;
            localStorage.setItem("userId", _id);
            setToken(token);

            toast.success("Dukandar Registered successfully", {
              timeOut: 2500,
            });
            handlePayment(data);
            loginSuccessfully(response.data.data);
            setIsLoading(false);
            setTimeout(() => {
              history.push("/");
            }, 2000);
          })
          .catch((catchResponse) => setIsLoading(false));
      })
      .catch((catchResponse) => setIsLoading(false));
  };

  return (
    <div className="container">
      <ToastContainer />
      <BahikhataLogo />
      <div className="row mt-5">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <RegisterAvatar />
              <h3 className="fw-normal" style={{ color: "#143b64" }}>
                Register
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="row">
                {formInputControls.map((item) => (
                  <AppFormInput key={item.name} register={register} {...item} />
                ))}
                <AppFormSelect
                  {...plansSelectControl}
                  options={plans}
                  register={register}
                />
                <AppFormFile
                  {...userImageControl}
                  register={register}
                  onFileChange={onSelectFile}
                />
                <div className="px-2">
                  <AppLoaderButton
                    // loading={isLoading}
                    className="btn login-btn w-10 my-3 app-btn"
                    label={"Register"}
                    loaderColor={"#fff"}
                  />
                </div>
                <p className="forgot-password text-right">
                  <AppLink to={"/login"} label={"Existing User? Log in"} />
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
  loginData: getUserState(state),
  loading: isUserLoginLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  loginProgress: () => dispatch(loginProgress()),
  loginFailed: (error) => dispatch(loginFailed(error)),
  loginSuccessfully: (data) => dispatch(loginSuccessfully(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
