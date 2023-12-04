import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import Editimage from "../../assets/img/Editimage.png";
import Editimagepencil from "../../assets/img/Editimagepencil.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import download from "../../assets/img/download.png";
import { displayRazorpay, RazorpayPayment } from "../../utils/RazorpayPayment";
import {
  getDukandarDetailService,
  ProfileUpadteService,
  ProfileProfileImageUpadteService,
  ChangePasswordService,
  selectPlan,
  getAllPlans,
  verifyPayment,
  getAllPurchasedPlans,
} from "../../services/api.service";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../../store/slices/dashboardSlice";
import { userDetails } from "../../store/slices/userSlice";
import moment from "moment";
import { FREE, MONTHLY, YEARLY } from "../../constants/plans";
import SubscriptionInvoice from "./SubscriptionInvoice";
import avatarmale from "../../assets/img/avatarmale.png";
import { setDukandarDetails } from "../../store/slices/headerSlice";
import { handlePayment as forFreePlan } from "../../helpers/paymentHelper";
import { SyncLoader } from "react-spinners";

const Profile = () => {
  const [flag, setFlag] = useState(true);
  const dispatch = useDispatch();
  // const payment_detail = useSelector(
  //   (state) => state?.user?.user?.payment_detail
  // );
  const userDets = useSelector((state) => state?.user?.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [dukandarData, setDukandarData] = useState(null);
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [errorsnewpassword, setErrorsnewpassword] = useState("");
  const [cnewpassword, setCnewpassword] = useState("");
  const [errorscnewpassword, setErrorsCnewpassword] = useState("");
  const [errorsoldpassword, setErrorsOldpassword] = useState("");
  const [image, setImage] = React.useState();
  const [isImage, setIsImage] = React.useState("d-none");
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [plans, setPlans] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState([]);
  const [track, setTrack] = React.useState(false);
  const [invoiceShow, setInvoiceShow] = React.useState(false);
  const [singleSubscription, setsingleSubscription] = React.useState({});
  const [showSubscriptionButton, setShowSubscriptionButton] =
    React.useState(false);
  const [text, setText] = React.useState(false);
  const [isLoadingProfile, setisLoadingProfile] = useState(false);
  const [isLoadingPassword, setisLoadingPassword] = useState(false);

  useEffect(async () => {
    const res = await getAllPlans();

    setPlans(res.data.data.plans);
  }, []);
  useEffect(async () => {
    const res = await getAllPurchasedPlans();
    if (res?.data?.data.length > 0) {
      setPaymentDetails(res?.data?.data);
    } else {
      const plandata = {
        plans: "free",
      };
      forFreePlan(plandata);
      setTimeout(async () => {
        await getAllPurchasedPlans();
        setTrack(true);
      }, 500);
    }
  }, [track]);

  const calculateDays = (given) => {
    const givenFormat = moment(given, "YYYY-MM-DD");
    const currentFormat = moment().format("YYYY-MM-DD");
    //Difference in number of days
    return moment.duration(givenFormat.diff(currentFormat)).asDays();
  };

  useEffect(() => {
    if (
      paymentDetails.length > 1 &&
      paymentDetails[paymentDetails.length - 1].plan_id === MONTHLY &&
      paymentDetails[paymentDetails.length - 2].plan_id === FREE
    ) {
      if (
        !calculateDays(paymentDetails[paymentDetails.length - 2]?.end_date) <= 0
      ) {
        setShowSubscriptionButton(false);
        return;
      } else {
        setShowSubscriptionButton(true);
      }
    }

    switch (
      paymentDetails.length > 0
        ? paymentDetails[paymentDetails.length - 1].plan_id
        : ""
    ) {
      case FREE:
        setShowSubscriptionButton(true);
        buttonCondition(paymentDetails, FREE);
        break;
        ``;
      case MONTHLY:
        if (
          calculateDays(paymentDetails[paymentDetails.length - 1]?.end_date) <=
          5
        ) {
          setText(true);
          buttonCondition(paymentDetails, MONTHLY);
          setShowSubscriptionButton(true);
        } else {
          setShowSubscriptionButton(true);
        }
        break;
      case YEARLY:
        if (
          calculateDays(paymentDetails[paymentDetails.length - 1]?.end_date) <=
          30
        ) {
          setText(true);
          buttonCondition(paymentDetails, YEARLY);
          setShowSubscriptionButton(true);
        } else {
          setShowSubscriptionButton(false);
        }
        break;
      default:
        break;
    }
  }, [paymentDetails]);

  const dateFormat = (date) => {
    const newDate = date.split(" ");
    const [a, b, c, ...time] = newDate;
    const newFormat = a + " " + b + " " + c + ", " + time[0] + " " + time[1];
    return newFormat;
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // checking current date with plan end date for payment
  const checkDate = (date) => {
    const currentFormat = moment().format("YYYY-MM-DD");
    const givenDateFormat = moment(date).format("YYYY-MM-DD");
    return moment(currentFormat).isAfter(givenDateFormat);
  };
  const handlePayment = async (plan) => {
    setTrack(false);

    // if(!checkDate(paymentDetails[paymentDetails.length-1]?.end_date)){
    //   toast.error(`you are currently having active plan (${paymentDetails[paymentDetails.length-1]?.plan_id})`)
    //   return
    // }
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // const data = await fetch("http://localhost:4005/payments/razorpay");
    const data = await selectPlan(plan);

    const options = {
      key: "rzp_test_81AvpkJMa4k4bN", // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Bahi khata",
      description: "Test Transaction",
      image: userDets.image || "https://picsum.photos/200/300",
      order_id: data.data.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          subscription_id: data.data.subscriptionId,
        };
        const verifiedData = await verifyPayment(body);

        if (
          verifiedData &&
          verifiedData?.data?.message === "payment verified and updated!"
        ) {
          setTrack(true);
          toast.success("Payment verified!");
        }
      },
      prefill: {
        name: userDets.firstName + userDets.lastName,
        email: userDets.email,
        contact: 9784561230 || userDets.mobile,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    paymentObject.open();
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    // let errors = this.state.errors;

    switch (name) {
      case "oldpassword":
        let olderror =
          value.length < 5
            ? "Password must be at least 5 characters long!"
            : "";
        setErrorsOldpassword(olderror);
        setOldpassword(value);
        break;
      case "newpassword":
        let newError =
          value.length < 8
            ? "Password must be at least 8 characters long!"
            : "";
        setErrorsnewpassword(newError);
        setNewpassword(value);
        break;
      case "cnewpassword":
        let cnewerror =
          value.length < 8
            ? "Password must be at least 8 characters long!"
            : newpassword === cnewpassword
            ? "Password Does not match please fill correct password"
            : "";
        setErrorsCnewpassword(cnewerror);
        setCnewpassword(value);
        break;
      default:
        break;
      // this.setState({[name]: value});
    }
  };

  function CheckPassword(inputtxt) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    if (inputtxt.match(decimal)) {
      return true;
    } else {
      toast.error(
        "Password Should contain alphanumeric with Special Character",
        { timeOut: 5000 }
      );
      setisLoadingPassword(false);
      return false;
    }
  }

  const chnagePassword = async (event) => {
    setisLoadingPassword(true);
    event.preventDefault();

    if (newpassword === cnewpassword) {
      if (CheckPassword(newpassword)) {
        var body = {
          old_password: oldpassword,
          new_password: cnewpassword,
        };
        ChangePasswordService(body)
          .then((res) => {
            document.getElementById("changePassword").reset();
            toast.success(res.data.message, { timeOut: 5000 });
            setisLoadingPassword(false);
          })
          .catch((err) => {
            toast.error(err.response.data.message, { timeOut: 5000 });
            setisLoadingPassword(false);
          });
      }
    } else {
      toast.error("New Password and Confirm Password Mismatch", {
        timeOut: 5000,
      });
      setisLoadingPassword(false);
    }
  };

  const onSubmit = async (data) => {
    setisLoadingProfile(true);

    let formImage = new FormData();

    image && formImage.append("image", image);

    await ProfileUpadteService(data)
      .then((res) => {
        !image && getDukandarDetail(localStorage.getItem("userId"));
        !image && setFlag(true);
        image &&
          ProfileProfileImageUpadteService(formImage).then((res) => {
            if (res) {
              toast.error(res.message, { timeout: 5000 });
              getDukandarDetail(localStorage.getItem("userId"));
              setFlag(true);
            }
          });
        setisLoadingProfile(false);
        toast.success(res.data.message, { timeOut: 5000 });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
        setisLoadingProfile(false);
      });
  };

  const onSelectFile = (e) => {
    const preview = document.getElementById("preview");
    if (e.target.files[0]) {
      preview.src = URL.createObjectURL(e.target.files[0]);
      preview.onload = () => URL.revokeObjectURL(preview.src);
      setImage(e.target.files[0]);
      setIsImage("d-block");
    }
  };

  const getDukandarDetail = async (id) => {
    return await getDukandarDetailService(id)
      .then((res) => {
        setDukandarData(res.data.data);
        dispatch(setDukandarDetails(res.data.data));
        return true;
      })
      .catch((err) => {
        return false;
      });
  };

  const downloadSubscriptionInvoice = (data) => {
    setInvoiceShow(true);
    setsingleSubscription(data);
    const pdfName = "invoice.pdf";
    setTimeout(() => {
      const pdf = new jsPDF("p", "pt", "a3");
      pdf.html(document.querySelector("#pdf"), {
        callback: function (pdf) {
          pdf.save(pdfName);
        },
      });
    }, 1000);
  };
  const buttonCondition = (paymentDetails, id) => {
    if (id === "free") {
      return true;
    }
    if (paymentDetails[paymentDetails.length - 1].plan_id === id) {
      if (
        calculateDays(paymentDetails[paymentDetails.length - 1]?.end_date) <= 5
      ) {
        return true;
      }
    } else {
      return false;
    }
  };
  useEffect(() => {
    getDukandarDetail(localStorage.getItem("userId"));

    dispatch(fetchInventory());
    dispatch(userDetails());
  }, []);
  return (
    <>
      <div className="container-fluid mt-3">
        {/* <ToastContainer /> */}
        <Row className="bg-white m-0 p-2 py-3">
          <Col xs={12} className="ps-2">
            <p className="fs-w600 fs-6 text-primary">Personal Information</p>
          </Col>
          <Col xs={12} className="mt-3 ps-2">
            {flag === true ? (
              <Row>
                <Col xs={12} sm={2} md={1} className="ms-1  mb-sm-2 text-break">
                  <p className="fs-14 fs-w700 text-muted pb-1">Image</p>

                  {dukandarData &&
                  dukandarData.image &&
                  dukandarData?.image.split("images")[1] !== "/null" ? (
                    <>
                      <img
                        src={dukandarData.image}
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <img
                          src={avatarmale}
                          style={{
                            height: "35px",
                            width: "35px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    </>
                  )}
                </Col>
                <Col xs={12} sm={2} md={1} className=" mb-sm-2 mb-3 text-break">
                  <p className="fs-14 fs-w700 text-muted">First Name</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.firstName
                      ? dukandarData.firstName
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} md={1} className="  mb-sm-2 text-break">
                  <p className="fs-14 fs-w700 text-muted">Last Name</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.lastName
                      ? dukandarData.lastName
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} md={1} className=" mb-sm-2 mb-3 text-break">
                  <p className="fs-14 fs-w700 text-muted">Shop Name</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.shop_name
                      ? dukandarData.shop_name
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} className=" mb-sm-2 text-break">
                  <p className="fs-14 fs-w700 text-muted">Phone Number</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.mobile
                      ? dukandarData.mobile
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} className=" mb-sm-2 mb-3 text-break">
                  <p className="fs-14 fs-w700 text-muted">Email</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.email
                      ? dukandarData.email
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} className="  mb-sm-2 text-break">
                  <p className="fs-14 fs-w700 text-muted">Address</p>
                  <p className="text-muted fs-14 fs-w500 mt-sm-2">
                    {dukandarData && dukandarData.address
                      ? dukandarData.address
                      : ""}
                  </p>
                </Col>
                <Col xs={12} sm={2} md={1} className=" mb-sm-2 mb-3 ">
                  <p className="fs-14 fs-w700 text-muted">Action</p>
                  <button
                    className="btn btn-primary btn-sm mt-sm-2"
                    onClick={() => setFlag(false)}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
            ) : (
              <Form
                className="row pt-sm-0"
                method="POST"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row className="ps-0 ms-0">
                  <Col
                    xs={6}
                    sm={2}
                    md={1}
                    className=" pe-0 mb-sm-2 text-break ms-0 "
                  >
                    <p className="fs-14 fs-w700 text-muted pb-1 ms-1">Image</p>
                    <>
                      <input
                        type="file"
                        onChange={(e) => onSelectFile(e)}
                        className="form-control d-none "
                        id="ProfilePic"
                        placeholder="Upload Your Profile Picture"
                      />
                      <label htmlFor="ProfilePic">
                        {" "}
                        <div className="ms-1 mt-0">
                          <img
                            src={avatarmale}
                            style={{
                              height: "35px",
                              width: "35px",
                              borderRadius: "50%",
                            }}
                          />
                          <img
                            src={Editimagepencil}
                            className="mb-4"
                            style={{ position: "relative", right: "0.8rem" }}
                          />
                        </div>
                      </label>
                      <div className={`${isImage}`}>
                        <img id="preview" className="img-fluid mt-2 w-50" />
                      </div>
                    </>
                  </Col>
                  <Col xs={6} sm={2} md={1} className="mb-sm-0 mb-3 ms-0 ">
                    <p className="fs-14 fs-w700 text-muted pb-1">First Name</p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="text"
                      maxLength={20}
                      defaultValue={
                        dukandarData && dukandarData.firstName
                          ? dukandarData.firstName
                          : ""
                      }
                      {...register("first_name", { required: true })}
                    />
                  </Col>
                  <Col xs={6} sm={2} md={1}>
                    <p className="fs-14 fs-w700 text-muted pb-1">Last Name</p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="text"
                      maxLength={20}
                      defaultValue={
                        dukandarData && dukandarData.lastName
                          ? dukandarData.lastName
                          : ""
                      }
                      {...register("last_name", { required: true })}
                    />
                  </Col>
                  <Col xs={6} sm={2} className="mb-sm-0 mb-3">
                    <p className="fs-14 fs-w700 text-muted pb-1">Shop Name</p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="text"
                      maxLength={20}
                      defaultValue={
                        dukandarData && dukandarData.shop_name
                          ? dukandarData.shop_name
                          : ""
                      }
                      {...register("shop_name", { required: true })}
                    />
                  </Col>
                  <Col xs={6} sm={2} md={1} className="mini-width-ph">
                    <p className="fs-14 fs-w700 text-muted pb-1">
                      Phone Number
                    </p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="text"
                      defaultValue={
                        dukandarData && dukandarData.mobile
                          ? dukandarData.mobile
                          : ""
                      }
                      {...register("mobile", {
                        required: true,
                        pattern: /^\d{10}$/,
                      })}
                    />
                  </Col>
                  <Col xs={6} sm={2} className="mb-sm-0 mb-3">
                    <p className="fs-14 fs-w700 text-muted pb-1">Email</p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="email"
                      maxLength={30}
                      defaultValue={
                        dukandarData && dukandarData.email
                          ? dukandarData.email
                          : ""
                      }
                      {...register("email", { required: true })}
                    />
                  </Col>
                  <Col xs={6} sm={2}>
                    <p className="fs-14 fs-w700 text-muted pb-1">Address</p>
                    <input
                      className="form-control fs-14 fs-w500"
                      type="text"
                      maxLength={70}
                      defaultValue={
                        dukandarData && dukandarData.address
                          ? dukandarData.address
                          : ""
                      }
                      {...register("address", { required: true })}
                    />
                  </Col>
                  <Col xs={6} sm={2} md={1} className="mb-1">
                    <p className="fs-14 fs-w700 text-muted ">Action</p>
                    {(!isLoadingProfile || isLoadingProfile !== true) && (
                      <>
                        <button
                          className="btn btn-secondary btn-sm me-3 mt-1 edit-profile-btn-times "
                          onClick={() => setFlag(true)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm mt-1 edit-profile-btn-check"
                        >
                          <i className="fas fa-check fs-12"></i>
                        </button>
                      </>
                    )}
                    {isLoadingProfile && (
                      <SyncLoader size={8} color={"#143B64"} />
                    )}
                  </Col>
                </Row>
              </Form>
            )}
            <hr />
            <div className="second-div">
              <p className="secnd-div-heading fs-w600 fs-6 text-primary mb-3">
                Change Password
              </p>
              <Form
                className="row pt-sm-0"
                id="changePassword"
                method="POST"
                onSubmit={chnagePassword}
              >
                <div className="row">
                  <div className="col-md-3 off-can-data ms-2">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Old Password
                    </p>
                    <div className="position-relative">
                      <FormControl
                        className="mt-2 mb-2 mb-md-0 pe-5 "
                        type={showOldPassword ? "text" : "password"}
                        placeholder="********"
                        name="oldpassword"
                        autoComplete="old-password"
                        onChange={handleChange}
                      />
                      <div
                        className="password-eye"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <i className="fas fa-eye" />
                        ) : (
                          <i className="fa-solid fa-eye-slash" />
                        )}{" "}
                      </div>
                    </div>

                    {/* {errorsoldpassword.length > 0 && (
                      <span className="small error text-danger">
                        {errorsoldpassword}
                      </span>
                    )} */}
                  </div>
                  <div className="col-md-3 off-can-data ms-2 ms-md-0">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      New Password
                    </p>
                    <div className="position-relative">
                      <FormControl
                        className="mt-2 mb-2 mb-md-0 pe-5 "
                        type={showNewPassword ? "text" : "password"}
                        placeholder="********"
                        name="newpassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                      />
                      <div
                        className="password-eye"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <i className="fas fa-eye" />
                        ) : (
                          <i className="fa-solid fa-eye-slash" />
                        )}
                      </div>
                    </div>
                    {errorsnewpassword.length > 0 && (
                      <span className="small error text-danger">
                        {errorsnewpassword}
                      </span>
                    )}
                  </div>
                  <div className="col-md-3 off-can-data ms-2 ms-md-0">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Confirm Password
                    </p>
                    <div className="position-relative">
                      <FormControl
                        className="mt-2 mb-2 mb-md-0 pe-5"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        name="cnewpassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                      />
                      <div
                        className="password-eye"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <i className="fas fa-eye" />
                        ) : (
                          <i className="fa-solid fa-eye-slash" />
                        )}
                      </div>
                    </div>
                    {errorscnewpassword.length > 0 && (
                      <span className="small error text-danger">
                        {errorscnewpassword}
                      </span>
                    )}
                  </div>
                  <div className="col-md-2 ms-md-5 ms-3 ps-1 off-can-data">
                    <p className="text-nowrap fs-w700 text-muted fs-14 text-md-center">
                      Action
                    </p>
                    <div className="d-md-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-2 mb-2 mb-md-0"
                      >
                        {isLoadingPassword ? (
                          <SyncLoader size={8} color={"#fff"} />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-3 border-0 shadow-sm">
              <div className="card-heading">
                <h3 className="fs-6 text-primary fs-w600">
                  My Subscription
                  <small className="profile-text mw-100 ms-2">
                    {paymentDetails.length > 1 &&
                    !checkDate(
                      paymentDetails[paymentDetails.length - 2]?.end_date
                    ) ? (
                      <>
                        You are on{" "}
                        {paymentDetails[paymentDetails.length - 2]?.plan_id}{" "}
                        Subscription right now which will expire in{" "}
                        {calculateDays(
                          paymentDetails[paymentDetails.length - 2]?.end_date
                        )}
                        {" days."}
                      </>
                    ) : (
                      <>
                        You are on{" "}
                        {paymentDetails[paymentDetails.length - 1]?.plan_id}{" "}
                        Subscription right now which will expire in{" "}
                        {calculateDays(
                          paymentDetails[paymentDetails.length - 1]?.end_date
                        )}
                        {" days."}
                      </>
                    )}
                  </small>
                </h3>
              </div>
              <div className="card-body px-0 pb-0">
                <div className="row">
                  {plans &&
                    plans.length > 0 &&
                    plans.map((item, i) => (
                      <div key={`${item}${i}`} className="col-12 mt-3 ">
                        <div
                          className="tab-border-color rounded px-3 "
                          style={{ backgroundColor: "#79b1ec1c" }}
                        >
                          <div className="d-lg-flex">
                            <div className="w-100 have-border-1 my-3">
                              <p className="text-primary fs-12 fs-w600 ">
                                {item.name}
                                {item.name === "Yearly Subscription" && (
                                  <small> (Recommended)</small>
                                )}
                              </p>
                              <h1 className="text-primary fs-25 mt-2">
                                <i className="fa fa-inr"></i>{" "}
                                {item.price
                                  ? item.price +
                                    "/" +
                                    item.id.replace("ly", " ")
                                  : "0 for 10 Days"}
                                <small className="fs-10 text-primary ms-2">
                                  {item.id === "free"
                                    ? ""
                                    : item.id === "monthly"
                                    ? "Paid every month"
                                    : "Paid every Year"}
                                </small>
                              </h1>
                              {item.id !== FREE &&
                                // paymentDetails[paymentDetails.length - 1]
                                //   ?.plan_id !== item.id &&
                                showSubscriptionButton && (
                                  // (paymentDetails[paymentDetails.length - 1]
                                  //         ?.plan_id === item.id &&
                                  //       calculateDays(
                                  //         paymentDetails[paymentDetails.length - 1]
                                  //           .end_date
                                  //       ) !== 5) &&
                                  <button
                                    className="profile_switch_button btn btn-sm btn-primary mt-2 fs-w100"
                                    id="rzp-button1"
                                    // disabled={
                                    //   paymentDetails[paymentDetails.length - 1]
                                    //     ?.plan_id === item.id &&
                                    //   calculateDays(
                                    //     paymentDetails[paymentDetails.length - 1]
                                    //       .end_date
                                    //   ) !== 0
                                    // }
                                    onClick={() => handlePayment(item.id)}
                                  >
                                    {!text &&
                                      `Switch to ${item.id} Subscription`}
                                    {text &&
                                      paymentDetails[paymentDetails.length - 1]
                                        .plan_id === item.id &&
                                      `Resume with ${item.id} Subscription`}
                                    {text &&
                                      paymentDetails[paymentDetails.length - 1]
                                        .plan_id !== item.id &&
                                      `Switch to ${item.id} Subscription`}
                                    {/* {text
                                      ? `Resume with ${item.id} Subscription`
                                      : `Switch to ${item.id} Subscription`} */}
                                  </button>
                                )}
                            </div>
                            <div className="w-75 my-3">
                              {/* <p className="text-end text-danger fs-w700 fs-12">
                            Expired on: 01 Dec 2021
                          </p> */}
                              {paymentDetails.length > 1 &&
                              paymentDetails[paymentDetails.length - 2]
                                ?.plan_id === item.id &&
                              checkDate(
                                paymentDetails[paymentDetails.length - 2]
                                  ?.end_date
                              ) ? (
                                <p className="current-subs ms-auto">
                                  Currently Active
                                </p>
                              ) : paymentDetails.length === 1 &&
                                paymentDetails[paymentDetails.length - 1]
                                  ?.plan_id === item.id ? (
                                <p className="current-subs ms-auto">
                                  Currently Active
                                </p>
                              ) : (
                                paymentDetails.length > 1 &&
                                paymentDetails[paymentDetails.length - 1]
                                  ?.plan_id === item.id && (
                                  <p className="current-subs ms-auto">
                                    Upcoming Plan
                                  </p>
                                )
                              )}
                              {paymentDetails[paymentDetails.length - 2] &&
                              paymentDetails[paymentDetails.length - 2]
                                ?.plan_id === item.id &&
                              paymentDetails[paymentDetails.length - 1]
                                ?.plan_id !== item.id &&
                              checkDate(
                                paymentDetails[paymentDetails.length - 2]
                                  ?.end_date
                              ) ? (
                                <p
                                  style={{ width: "fit-content" }}
                                  className="exp-subs ms-auto"
                                >
                                  Expired on{" "}
                                  {moment(
                                    paymentDetails[paymentDetails.length - 2]
                                      ?.end_date
                                  ).format("D MMM YYYY")}
                                </p>
                              ) : (
                                paymentDetails[paymentDetails.length - 2]
                                  ?.plan_id === item.id && (
                                  <p className="current-subs ms-auto">
                                    {" "}
                                    Currently Active{" "}
                                  </p>
                                )
                              )}
                              <div className="d-flex mt-3">
                                <div className="ms-lg-auto">
                                  <p className="text-primary fs-12 fs-w600">
                                    Start date
                                  </p>
                                  <small>
                                    {(paymentDetails[paymentDetails.length - 1]
                                      ?.plan_id === item.id &&
                                      moment(
                                        paymentDetails[
                                          paymentDetails.length - 1
                                        ]?.start_date
                                      ).format("D MMM YYYY")) ||
                                      (paymentDetails[paymentDetails.length - 2]
                                        ?.plan_id === item.id &&
                                        moment(
                                          paymentDetails[
                                            paymentDetails.length - 2
                                          ]?.start_date
                                        ).format("D MMM YYYY")) ||
                                      "NA"}
                                    {/* {(paymentDetails[paymentDetails.length - 2]
                                        ?.plan_id === item.id &&
                                        moment(
                                          paymentDetails[
                                            paymentDetails.length - 2
                                          ]?.start_date
                                        ).format("D MMM YYYY")) ||
                                        "NA"} */}
                                  </small>
                                </div>
                                <div className="ms-5">
                                  <p className="text-primary text-end fs-12 fs-w600">
                                    End date
                                  </p>
                                  <small>
                                    {(paymentDetails[paymentDetails.length - 1]
                                      ?.plan_id === item.id &&
                                      moment(
                                        paymentDetails[
                                          paymentDetails.length - 1
                                        ]?.end_date
                                      ).format("D MMM YYYY")) ||
                                      (paymentDetails[paymentDetails.length - 2]
                                        ?.plan_id === item.id &&
                                        moment(
                                          paymentDetails[
                                            paymentDetails.length - 2
                                          ]?.end_date
                                        ).format("D MMM YYYY")) ||
                                      "NA"}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <div className="card p-3 border-0 shadow-sm">
              <div className="card-heading">
                <h4 className="mb-2 ms-2 mw-100 subscription-history-heading">
                  {/* <h4 className="fs-14 fs-w600 ms-2 pb-3 text-primary"> */}
                  My Subscription Payment History & Invoices
                </h4>
                <Table responsive borderless={true}>
                  <thead>
                    <tr className="text-left">
                      <th className="fs-w700 fs-13 text-muted ">Date/Time</th>
                      <th className="fs-w700 fs-13 text-muted">Amount</th>
                      <th
                        className="fs-w700 fs-13 text-muted"
                        style={{ minWidth: "7.813rem" }}
                      >
                        Transaction ID
                      </th>
                      <th className="fs-w700 fs-13 text-muted">Subscription</th>
                      <th className="fs-w700 fs-13 text-muted">From</th>
                      <th className="fs-w700 fs-13 text-muted">Status</th>
                      <th className="fs-w700 fs-13 text-muted">Invoice</th>
                    </tr>
                  </thead>
                  <br />
                  <tbody>
                    {paymentDetails && paymentDetails.length > 0 ? (
                      paymentDetails.map((item, index) => (
                        <tr key={item._id + "-" + index} className="text-left">
                          <td className="fs-w500 fs-14 text-muted text-nowrap">
                            {dateFormat(
                              moment(item.created_at).format(
                                "D MMM YYYY HH:mm A"
                              )
                            )}
                          </td>
                          <td className="fs-w500 fs-14 text-muted text-nowrap">
                            {item.payment_detail?.order_details?.amount
                              ? item.payment_detail?.order_details?.amount / 100
                              : "0 /-"}
                          </td>
                          <td className="fs-w500 fs-14 text-muted text-nowrap">
                            {item.payment_detail?.transaction_details
                              ?.payment_id
                              ? item.payment_detail?.transaction_details
                                  ?.payment_id
                              : "-"}
                          </td>
                          <td className="fs-w500 fs-14 text-muted text-nowrap">
                            {item.plan_id}
                          </td>
                          <td className="fs-w500 fs-14 text-muted text-nowrap">
                            {moment(item.start_date).format("D MMM YYYY HH:mm")}
                          </td>
                          <td className="fs-w600 fs-14 text-success text-nowrap">
                            {item.payment_status}
                          </td>
                          <td
                            className="fs-w600 fs-14 text-nowrap"
                            style={{ color: "#7E7E7E !important" }}
                          >
                            <img
                              src={download}
                              alt="download"
                              onClick={() => {
                                downloadSubscriptionInvoice(item);
                                setInvoiceShow(true);
                                setsingleSubscription(item);
                              }}
                              className="cursor-pointer"
                              style={{ height: "0.875rem" }}
                            />
                            {/* <i
                              onClick={() => {
                                downloadSubscriptionInvoice(item)
                                setInvoiceShow(true)
                                setsingleSubscription(item)
                              }}
                              className="fa-solid fa-download fw-bold cursor-pointer"
                            ></i> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan="6">No payment history to display here</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={invoiceShow}
        size="lg"
        // fullscreen={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={true}
        backdrop={"static"}
        autoFocus={true}
      >
        <Modal.Header closeButton={false}>
          <Modal.Title
            className="text-primary  fs-6 fs-w600"
            id="contained-modal-title-vcenter"
          >
            Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-muted fs-6">
          <SubscriptionInvoice invoiceState={singleSubscription} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="ms-auto"
            variant="danger fs-12 fs-w600"
            onClick={() => {
              setInvoiceShow(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
