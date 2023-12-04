import React from "react";

const NoData = ({type}) => {
  return (
    <div className="noState">
      <p className="text-muted fs-w600 fs-6 text-center">
        No Data Found. <br /> 
        {type === "dashboard" ? "Add your inventory/stock details by clicking the 'Add Product' button." :  "Please do the entry if you have sold by clicking the 'Sell' button in Available inventory page."}
      </p>
    </div>
  );
};

export default NoData;
