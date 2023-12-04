import React, { useState, useEffect } from "react";

const LoginFormInput = ({
  type,
  name,
  validation,
  placeholder,
  divClass,
  inputClass,
  register
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [iconTop, setIconTop] = useState("33%");
  const registerValue = validation
    ? register(name, validation)
    : register(name);
  const isPasswordType = type === "password";
  const wrapper = document.querySelector(".position-relative");

  useEffect(() => {
    if (wrapper) {
      const pH = wrapper.clientHeight;
      const cT = (pH - 22) / 2;
      const cTop = (100 * cT) / pH;
      setIconTop(`${Math.round(cTop)}%`);
    }
  }, [wrapper]);

  return (
    <div className={`form-group  position-relative  ${divClass}`}>
      <input
        type={isPasswordType ? (showPassword ? "text" : "password") : type}
        className={`form-control login-input  ${inputClass}`}
        placeholder={placeholder}
        {...registerValue}
      />
      {isPasswordType && (
        <div
          className="password-eye-percentage-login"
         
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
           <><div>
               <i className="fas fa-eye" />
           </div>
            </>
          ) : (
           <>
           <div>
           <i className="fa-solid fa-eye-slash" />
           </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginFormInput;
