import Loginavatar1 from "../assets/img/Loginavatar1";
import Loginavatar2 from "../assets/img/Loginavatar2";
import Loginavatar3 from "../assets/img/Loginavatar3";
import Loginavatar4 from "../assets/img/Loginavatar4";
import { FormInputProp } from "../helpers/FormInputProp";

const carouselItems = [
  {
    interval: 100500,
    component: <Loginavatar1 />,
    caption: "Login to your account its safe and handy."
  },
  {
    interval: 1400,
    component: <Loginavatar2 />,
    caption: "Now invoice management is just a click away."
  },
  {
    interval: 1400,
    component: <Loginavatar3 />,
    caption: "Manage your inventory in few minutes."
  },
  {
    interval: 1400,
    component: <Loginavatar4 />,
    caption: "Increase your sales exponentially in less efforts."
  }
];

const formControls = [
  new FormInputProp(
    "email",
    "email",
    { required: true },
    "Enter Email ID*",
    { divCn: " fs-12", inputCn: " fs-16 fw-400 box2 p-3" }
  ),
  new FormInputProp(
    "password",
    "password",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 15) 
    },
    "Enter Password*",
    { divCn: "mt-4 ", inputCn: "fs-16 fw-400 box2 p-3 pe-5" }
  )
];

const LoginConstant = {
  carouselItems,
  formControls,
  userStorageKey: "USER_DATA"
};

export default LoginConstant;
