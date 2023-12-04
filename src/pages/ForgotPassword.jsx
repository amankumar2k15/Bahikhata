import React from "react";
import { useForm } from "react-hook-form";
import { Link, Redirect } from "react-router-dom";
import BahikhataLogo from "../assets/img/BahikhataLogo";
import ForgotAvatar from "../assets/img/ForgotAvatar";
import { ForgotPasswordService } from "../services/api.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Page.css";
import { FormInputProp } from "../helpers/FormInputProp";
import AppFormInput from "../components/AppFormInput";
import AppLink from "../components/AppLink";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();

  const inputControl = new FormInputProp(
    "email",
    "email",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 25) 
    },
    "Enter Registered Email ID*",
    {inputCn: "fs-12 fw-400 " },
  );

  const onSubmit = (data) => {
    if (!data.email) {
      toast.error("Please Enter Email", { timeOut: 5000 });
      return;
    }
    ForgotPasswordService(data)
      .then((res) => toast.success(res.data.message, { timeOut: 2500 }))
      .catch((err) =>
        toast.error(err.response.data.message, { timeOut: 2500 })
      );
  };

  return (
    <div className="container">
      <ToastContainer />
      <BahikhataLogo />
      <div className="row mt-5">
        <div className="col-md-4 offset-md-4">
          <div className="card">
            <div className="card-header forgot-header">
              <div
                className="mw-100"
                style={{ maxWidth: "100%", display: "inline-block" }}
              >
                <ForgotAvatar />
              </div>
              <h3 className="fw-normal">Forgot Password</h3>
            </div>
            <div className="card-body box-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AppFormInput register={register} {...inputControl}  className="fs-12"/>
                <button type="submit" className="submit-btn p-2 my-3 border-0">
                  Submit
                </button>
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

export default ForgotPassword;
