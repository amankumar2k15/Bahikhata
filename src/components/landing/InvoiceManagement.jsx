import React from "react";
import LoginDetail from "../../assets/img/InvoiceManagement.svg";
function InvoiceManagement() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-5 mt-5">
          <div className="margin-10">
            <h3 className="landing-titles pt-5">
              Now Invoice management is just a click away.
            </h3>
            <p className="landing-subtitles2 mt-3">
              Discover the latest features of futuristic khata management and
              take your business to next level. This system is easy to use and
              saves lots of time.
            </p>
            <h6 className="landing-subtitles3 mt-3">
              Lifeline of your business. Go from messy business ower to
              well-managed visionary business owner.
            </h6>
          </div>
        </div>
        <div className="col-sm-1 "></div>
        <div className="col-sm-5 bg-img1">
          <img src={LoginDetail} className="invoice-img" />
        </div>
      </div>
    </div>
  );
}

export default InvoiceManagement;
