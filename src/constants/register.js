import {
  FormFileProp,
  FormInputProp,
  FormSelectProp
} from "../helpers/FormInputProp";

const formInputControls = [
  new FormInputProp(
    "text",
    "first_name",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 20)  
    },
    "Enter First Name*",
    { divCn: "col-sm-6 mt-3" ,inputCn: "fs-14 fw-400 h-100"}

  ),
  new FormInputProp(
    "text",
    "last_name",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 20) 
    },
    "Enter Last Name*",
    { divCn: "col-sm-6 mt-3",inputCn: "fs-14 fw-400 h-100" }
  ),
  new FormInputProp(
    "text",
    "shop_name",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 40) 
    },
    "Enter Shop Name*",
    { divCn: "col-sm-6 mt-3",inputCn: "fs-14 fw-400 h-100" }
  ),
  new FormInputProp(
    "text",
    "address",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 50) 
    },
    "Enter Shop Address*",
    { divCn: "col-sm-6 mt-3",inputCn: "fs-14 fw-400 h-100 "}
  ),
  new FormInputProp(
    "number",
    "mobile",
    {
      required: true,
      // pattern: /^\d{10}$/
      onChange: (e) => e.target.value = e.target.value.slice(0, 10) 
    },
    "Enter Mobile Number*",
    { divCn: "col-sm-6 mt-3",inputCn: "fs-14 fw-400 h-100" }
  ),
  new FormInputProp(
    "email",
    "email",
    {required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 30)     
    },
    "Enter Email*",
    { divCn: "col-sm-6 mt-3",inputCn: "fs-14 fw-400 h-100" }
  ),
  new FormInputProp(
    "password",
    "password",
    { required: true,
      onChange: (e) => e.target.value = e.target.value.slice(0, 15) 
    },
    "Enter Password*",
    { divCn: "col-sm-6 mt-3", inputCn: "fs-14 fw-400 h-100" }
  )
];

const plansSelectControl = new FormSelectProp(
  "plans",
  { required: true },
  "Choose Payment Plan",
  [],
  "id",
  { divCn: "col-sm-6 mt-3" ,inputCn: "fs-14 fw-400 p-1 h-100" }
);

const userImageControl = new FormFileProp(
  "images",
  "Choose Profile Image",
  "image/*",
  null,
  { divCn: "col-sm-6 mt-3"  }
);

const RegisterConstant = {
  formInputControls,
  plansSelectControl,
  userImageControl
};

export default RegisterConstant;
