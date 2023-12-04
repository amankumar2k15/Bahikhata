import React, { useState } from "react";
import { FREE, MONTHLY, YEARLY } from "../constants/plans";
import { handlePayment } from "../helpers/paymentHelper";

const AppFormSelect = ({
  name,
  validation,
  placeholder,
  divClass,
  inputClass,
  options,
  labelKey,
  register,
}) => {
  const [plan, setplan] = useState("");
  const registerValue = validation
    ? register(name, validation)
    : register(name);
  return (
    <div className={`form-group ${divClass}`}>
      <select
        className={`form-control capitalize-text ${inputClass}`}
        {...registerValue}
        onChange={(e) => setplan(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.length > 0 &&
          options.map((option) => {
            const label = labelKey ? option[labelKey] : option;
            return (
                  <option key={label} value={option.id} className="capitalize-text"  >
                {label} { (plan === MONTHLY && option.id === MONTHLY) ? "Rs.550/-":(plan === YEARLY && option.id === YEARLY) ?  "Rs.6000/-" :(plan === FREE && option.id === FREE) ? "Rs.0/-" :"" }
              </option>
            );
          })}
      </select>
      <div style={{height:"0.2rem"}}>
      {plan && (plan === MONTHLY ? (
        <p className="register-plan  ">
          You need to pay Rs.550/month for this plan
        </p>
      ) : plan === YEARLY ? (
        <p className="register-plan ">
          You need to pay Rs.6000/year for this plan
        </p>
      ) : (
        <p className="register-plan ">No need to pay for this plan</p>
      ))}
      </div>
    </div>
  );
};

export default AppFormSelect;
