import moment from "moment";
import ShortUniqueId from "short-unique-id";
import Reader from "../../assets/img/Reader.png";
const Invoice = ({ invoiceState }) => {
  const clientDetails = invoiceState.clientDetails
    ? invoiceState.clientDetails
    : invoiceState.productDetail?.sold;
  const productDetails = invoiceState.productDetail
    ? invoiceState.productDetail
    : {};
  const uid = new ShortUniqueId();
  return (
    <div
      id="pdf"
      className="container bg-primary p-3"
        // style={{ width: "780px" }}
    >
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            // style={{ height:"1100px" }}
          >
            <div className="card-body px-2 py-4">
              <div className="row p-1 ">
                {/* <div className="col-md-6">
                  <i className="  m-3 fas fa-book-reader"></i> Bahi Khata
                </div> */}
                <div className="header-logo d-flex align-items-center justify-content-between">
                  <div className="logo bg-white text-primary px-2  py-2 pb-sm-2 pb-0 mw-100 ">
                    {/* <i className="fas fa-book-reader"></i> Bahi Khata */}
                    <img
                         src={Reader}
                         className="me-2"
                         style={{width: "30px",marginTop: "-11px"}}
                        /> 
                      Bahi Khata
                  </div>
                <div className="text-justify">
                {/* <div className="col-md-4 text-right"> */}
                  <p className="font-weight-bold mb-1">Invoice: #{uid()}</p>
                  <p className="text-muted">Date : {moment(clientDetails?.sold_at).format("DD/MM/YYYY")}</p>
                </div>
                </div>
              </div>

              <hr className="my-5" />

              <div className="row pb-5 p-2">
                <div className="col-md-6">
                  <p className="fw-bold bold mb-4">
                    Client Information
                  </p>
                  <p className="mb-1">{clientDetails?.to},</p>
                  <p>{clientDetails?.email},</p>
                  <p className="mb-1">{clientDetails?.phone},</p>
                  <p className="mb-1">{clientDetails?.client_address}.</p>
                </div>
                
                <div className="col-md-6 text-right">
                  <p className="fw-bold mb-4">Payment Details</p>
                  {clientDetails.is_gst && (
                    <>
                      <p className="mb-1">
                        <span className="text-muted">
                          GST: {clientDetails?.gst?.gst_rate}
                          {"%"}
                        </span>
                      </p>
                      <p className="mb-1">
                        <span className="text-muted">
                          GST ID: {clientDetails?.gst?.gst_number}
                        </span>
                      </p>
                    </>
                  )}
                  {!isNaN(clientDetails?.payment?.cash?.amount) && (
                    <p className="mb-1">
                      <span className="text-muted">
                        Payment Type: Rs.{clientDetails?.payment?.cash?.amount}{" "}
                        /- (Cash)
                      </span>
                    </p>
                  )}
                    
                  {!isNaN(clientDetails?.payment?.online?.amount) && (
                    <p className="mb-1">
                      <span className="text-muted">Payment Type: </span> Rs.
                      {clientDetails?.payment?.online?.amount} /- (Online)
                    </p>
                  )}
                </div>
              </div>

              <div className="row p-2">
                <div className="col-md-12">
                  <table className="table-4">
                    <thead>
                      <tr>
                        <th className="text-center border-0 text-uppercase small font-weight-bold p-1">
                          ID
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          Item
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          Model
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          Color
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          IMEI
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          HDD
                        </th>
                        <th className="text-center border-0 text-uppercase small font-weight-bold">
                          Amount in Rs.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">1</td>
                        <td className="text-center">
                          {productDetails.product}
                        </td>
                        <td className="text-center">{productDetails.model}</td>
                        <td className="text-center">{productDetails.color}</td>
                        <td className="text-center">{productDetails.imei}</td>
                        <td className="text-center">{productDetails.hdd}</td>
                        <td className="text-center">
                          {parseInt(clientDetails.sell_price.toFixed(2))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="py-3 ps-5 pe-3 d-flex align-items-end flex-column">
                    <div className="mb-2">
                      Sub Total :{" "}
                      <span className="font-weight-light">
                        {" "}
                        Rs.{parseInt(clientDetails.sell_price.toFixed(2))}
                      </span>
                    </div>
                    <div className="mb-2">
                      Paid Amount :{" "}
                      <span className="font-weight-light">
                        {" "}
                        Rs.{ parseInt(parseInt(clientDetails.payment.cash.amount) + parseInt(clientDetails.payment.online.amount))}
                      </span>
                    </div>
                    <div className="mb-2">
                      Balance :{" "}
                      <span className="font-weight-light">
                        {" "}
                        Rs.
                        {clientDetails?.gst?.gst_amount > 0 ? (parseInt(parseInt(clientDetails?.gst?.gst_amount)  +  parseInt(clientDetails?.sell_price)) - parseInt(parseInt(clientDetails.payment.cash.amount) + parseInt(clientDetails.payment.online.amount))) : parseInt(clientDetails.sell_price)   -  parseInt(parseInt(clientDetails.payment.cash.amount) + parseInt(clientDetails.payment.online.amount))}
                      </span>
                    </div>
                    {clientDetails.is_gst && (
                      <div className="mb-2">
                        Sub Total with GST :
                        <span className="font-weight-light">
                          {" "}
                          Rs.{parseInt(parseInt(clientDetails?.gst?.gst_amount)  +  parseInt(clientDetails?.sell_price)) }
                        </span>
                      </div>
                    )}
                    <div className="mb-2">
                      Total to be paid :{" "}
                      <span className="font-weight-light">
                        {" "}
                        Rs.
                        {parseInt(clientDetails?.gst?.gst_amount) ? (parseInt(parseInt(clientDetails?.gst?.gst_amount)  +  parseInt(clientDetails?.sell_price)) - parseInt(parseInt(clientDetails.payment.cash.amount) + parseInt(clientDetails.payment.online.amount))) : parseInt(clientDetails.sell_price)   -  parseInt(parseInt(clientDetails.payment.cash.amount) + parseInt(clientDetails.payment.online.amount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center bg-primary text-white p-4">
                <div className="py-3 px-5 text-center">
                  <div className="mb-2">Thank you visit again!</div>
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>
      </div>   
  );
};

export default Invoice;
