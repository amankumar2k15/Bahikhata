import moment from "moment";
import ShortUniqueId from "short-unique-id";

const SubscriptionInvoice = ({ invoiceState }) => {
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
                  <div className="logo bg-white  px-2  text-primary py-2 pb-sm-2 pb-0 mw-100">
                    <i className="fas fa-book-reader"></i> Bahi Khata
                  </div>
                  <div className="text-justify">
                    {/* <div className="col-md-4 text-right"> */}
                    <p className="font-weight-bold mb-1">Invoice: #{uid()}</p>
                    {/* <p className="text-muted">Date : {moment(clientDetails?.sold_at).format("DD/MM/YYYY")}</p> */}
                  </div>
                </div>
              </div>

              <hr className="my-5" />

              <div className="row pb-5 p-2">
                <div className="col-md-6">
                  <p className="fw-bold bold mb-4">User Information</p>
                  <p className="mb-1">
                    {invoiceState?.user?.firstName +
                      invoiceState?.user?.lastName}
                    ,
                  </p>
                  <p>{invoiceState?.user?.email},</p>
                  {/* <p className="mb-1">{clientDetails?.phone},</p>
                  <p className="mb-1">{clientDetails?.client_address}.</p> */}
                </div>

                <div className="col-md-6 text-right">
                  <p className="fw-bold mb-4">Payment Details</p>

                  <p className="mb-1">
                    <span className="text-muted">
                      Transaction Id :{" "}
                      {
                        invoiceState?.payment_detail?.transaction_details
                          ?.payment_id
                      }
                    </span>
                  </p>
                  <p className="mb-1">
                    <span className="text-muted">
                      Payment Status : {invoiceState?.payment_status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="row p-2">
                <div className="col-md-12">
                  <table style={{borderSpacing:"0.75rem",width:"inherit", borderCollapse: "separate"}} className="table-5">
                    <thead>
                      <tr>
                        <th className="border-0 text-uppercase small font-weight-bold">
                          Subscription ID
                        </th>
                        <th className="border-0 text-uppercase small font-weight-bold">
                          Subscription
                        </th>
                        <th className="border-0 text-uppercase small font-weight-bold">
                          Start Date
                        </th>
                        <th className="border-0 text-uppercase small font-weight-bold">
                          End Date
                        </th>
                        <th className="border-0 text-uppercase small font-weight-bold">
                          Amount in Rs.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="" >
                          {
                            invoiceState?.payment_detail?.transaction_details
                              ?.subscription_id || "-"
                          }
                        </td>
                        <td className="">{invoiceState?.plan_id}</td>
                        <td className="">{invoiceState.start_date}</td>
                        <td className="">{invoiceState.end_date}</td>
                        <td className="text-start">
                          Rs.{invoiceState?.plan_id !== "free" ? (invoiceState?.payment_detail?.order_details?.amount /
                            100).toFixed(2) : "0.00"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="py-3 px-5 d-flex align-items-end flex-column">
                    <div className="mb-2">
                      Total paid :{" "}
                      <span className="font-weight-light">
                        Rs.
                        {invoiceState?.plan_id !== "free" ? (invoiceState?.payment_detail?.order_details?.amount /
                          100).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: "13rem" }}></div>
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

export default SubscriptionInvoice;
