import React from "react";
import { Link } from "react-router-dom";

const AppLink = ({ to, label }) => {
  return (
    <Link
      to={to}
      style={{
        color: "#143B64",
        fontWeight: "400"
      }}
    >
      {label}
    </Link>
  );
};

export default AppLink;
