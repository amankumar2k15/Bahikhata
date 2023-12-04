import React from "react";
import moment from "moment";
const Stocks = (props) => {
  const data = props.setData;
  const stock = props.setStock;
  // const date = new Date();
  return (
    <div className="container-fluid pt-3">
    <div className="d-flex new-off-can">
    <div className="column-first">
          <h2 className="text-primary fs-600 fs-20 fs-w600 mb-2 lh-30">{data.header_left}</h2>
          <small className="text-muted fs-14 fs-w400 ">
            {data.sub_header_left}
          </small>
        </div>
        {data.header_right !== null && (
          <div className="column-second ms-auto text-end mt-sm-0 mt-3">
            <h2 className="text-primary fs-18 fs-w600 mb-2">
              {data.header_right}
              {stock.stock}
            </h2>
            <small className="text-muted fs-14 fs-w400">
              {moment(stock.date).format("Do MMM YYYY")}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stocks;
