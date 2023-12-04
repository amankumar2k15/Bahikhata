import React from "react";
import moment from "moment";

import { Button, DropdownButton, Table, Tooltip } from "react-bootstrap";
// import { useSelector } from "react-redux";
import {
  khataHeadings,
  khataTableData,
  khataHeadingsSell,
  sellTableData,
  khataHeadingsSpecific,
  userTableData,
  khataHeadingsForDebtors,
  khataHeadingsForIndividual,
} from "../../constants/buttonHeadings";
import { connect } from "react-redux";

import {
  fetchKhata,
  getPaymentData,
  setCurrentTab,
  setEditSettle,
  setKhataProductId,
  setKhataRowEdit,
  setKhataSearch,
} from "../../store/slices/khataSlice";
// import { setCurrentTab } from "../../redux/actions";
// import DynamicPagination from "../../utils/DynamicPagination";
import NoData from "../../utils/NoData";
import {
  getCreditorsAndDebitorslist,
  getInventoryReport,
  getKhataReport,
  getindivisualReport,
  getSearchProducts,
  getKhataStatusService,
  getSettleKhata,
  getIndivisualKhata,
} from "../../services/api.service";
import toastr from "toastr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import history from "../../history";
import { khata_button_headings } from "../../constants/button_headings";
import {
  setKhataStatus,
  setActiveToggle,
  setCurentTab,
} from "../../store/slices/headerSlice";
import { NavLink } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AcroFormTextField } from "jspdf";

class MainKhataData extends React.Component {
  constructor(props) {
    super(props);
    if (window.location.search == "") {
      props.dispatch(fetchKhata());
    }
    this.state = {
      // owner:dukandarData,
      isLoading: true,
      mapTableHeading: khataHeadings,
      mapTableData: khataTableData,
      tableHeading: "Your Len-Dar/Sundry Creditors",
      flag: 0,
      editBalance: false,
      downloadData: "Download Len-Dar Data",
      is_cash: false,
      is_online: false,
      cash: 0,
      payment: {
        cash: { amount: 0 },
        online: { amount: 0 },
      },
      online: 0,
      postData: {
        page: 1,
        limit: 20,
        total: 0,
        type: "creditors",
      },
      width: 0,
      settleLoader: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };
  CreditorsandDebitorsList = (dataType) => {
    let { page, limit, type } = this.state.postData;
    type = dataType ? dataType : type;
    getCreditorsAndDebitorslist({ page: page, limit: limit, type: type })
      .then((res) => {
        const { page, limit, total } = res.data.data;
        this.setState({
          isLoading: false,
          postData: {
            page: page,
            limit: limit,
            total: total,
          },
        });
        const rows = res.data.data.products.map((item) => {
          return [
            item.purchase.from,
            item.purchase.phone,
            moment(item.purchase_at).format("DD/MM/YYYY"),
            item.purchase.purchase_amount,
            item.purchase.is_cash && item.purchase.is_online
              ? "Cash & Online"
              : item.purchase.is_cash
              ? "Cash"
              : item.purchase.is_online
              ? "Online"
              : " ",
            // item.purchase.payment.cash.amount !== 0 &&
            // item.purchase.payment.online.amount !== 0 &&
            // item.purchase.payment.cash.amount !== "" &&
            // item.purchase.payment.online.amount !== ""
            //   ? "Cash & Online"
            //   : item.purchase.payment.cash.amount !== 0 &&
            //     item.purchase.payment.cash.amount !== ""
            //   ? "Cash"
            //   : "Online",
            parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
            item.purchase.balance,
            item.purchase.comment,
            item.model,
            item.color,
            item.imei,
            item.ram,
            item.hdd,
          ];
        });
        this.setState({
          mapTableData: rows,
          isLoading: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  exportInventoryReport = () => {
    switch (this.props.currentTab) {
      case "Client khata":
        getindivisualReport()
          .then((res) => {
            //data

            const link = document.createElement("a");
            link.href = res.data.data.filePath;
            link.setAttribute("download", res.data.data.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((err) => {
            toast.error(err.response.data.message, { timeOut: 5000 });
          });
        break;
      case "Debtors":
        getKhataReport()
          .then((res) => {
            const link = document.createElement("a");
            link.href = res.data.data.filePath;
            link.setAttribute("download", res.data.data.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((err) => {
            toast.error(err.response.data.message, { timeOut: 5000 });
          });
        break;
      default:
        getInventoryReport()
          .then((res) => {
            //changes

            const link = document.createElement("a");
            link.href = res.data.data.filePath;
            link.setAttribute("download", res.data.data.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((err) => {
            toast.error(err.response.data.message, { timeOut: 5000 });
          });
        break;
    }
  };
  getKhataStatus = () => {
    getKhataStatusService()
      .then((res) => {
        const khataData = res.data.data[0];
        this.props.dispatch(setKhataStatus(khataData));
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  // getKhataStatus = () => {
  //   getKhataStatusService()
  //     .then((res) => {
  //       const khataData = res.data.data[0];

  //       const status = [...khata_button_headings];
  //       // check if khataData.creditors is empty
  //       if (khataData.creditors.length !== 0) {
  //         status[0].subHeading = khataData.creditors[0].totalSum;
  //       }
  //       // check if khataData.debtors is empty
  //       if (khataData.debtors.length !== 0) {
  //         status[1].subHeading = khataData.debtors[0].totalSum;
  //       }

  //       this.props.dispatch(setKhataStatus(status))
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message, { timeOut: 5000 });
  //     });
  // };

  handleEditEditShow = (rowId, payment, soldPayment, NA) => {
    if (NA === "NA") {
      this.setState({
        payment: {
          cash: { amount: parseInt(soldPayment.cash.amount) },
          online: { amount: parseInt(soldPayment.online.amount) },
        },
      });
    } else {
      this.setState({
        payment: {
          cash: { amount: parseInt(payment.cash.amount) },
          online: { amount: parseInt(payment.online.amount) },
        },
      });
    }
    let editData = this.props.khata;
    this.props.dispatch(setEditSettle(rowId));
    this.props.dispatch(setKhataProductId(editData.mapTableData[rowId].id));
    let products = this.props.khata.products;
    let prod =
      products &&
      products.length > 0 &&
      products.filter((item) => item._id == editData.mapTableData[rowId].id);
    if (this.props.currentTab === "Debtors") {
      this.setState({ ...this.state, payment: prod[0].sold.payment });
    } else if (this.props.currentTab !== "Client khata") {
      this.setState({ ...this.state, payment: prod[0].purchase.payment });
    }
  };

  settle = (
    rowData,
    individualPurchaseBalance,
    individualSellBalance,
    otherwise
  ) => {
    this.setState({
      settleLoader: true,
    });
    let flag = false;
    if (this.props.currentTab === "Client khata") {
      if (individualPurchaseBalance === "NA") {
        if (
          parseInt(this.state.payment.cash.amount) +
            parseInt(this.state.payment.online.amount) >
            individualSellBalance ||
          parseInt(this.state.payment.cash.amount) +
            parseInt(this.state.payment.online.amount) <
            0
        ) {
          flag = true;
        }
      } else {
        if (
          parseInt(this.state.payment.cash.amount) +
            parseInt(this.state.payment.online.amount) >
            individualPurchaseBalance ||
          parseInt(this.state.payment.cash.amount) +
            parseInt(this.state.payment.online.amount) <
            0
        ) {
          flag = true;
        }
      }
    } else {
      if (
        parseInt(this.state.payment.cash.amount) +
          parseInt(this.state.payment.online.amount) >
          otherwise ||
        parseInt(this.state.payment.cash.amount) +
          parseInt(this.state.payment.online.amount) <
          0
      ) {
        flag = true;
      }
    }
    if (flag) {
      this.setState({
        settleLoader: false,
      });
      toast.error(`Amount can't be more than balance or less than zero`, {
        timeOut: 5000,
      });
    } else {
      let body = {
        product_id: this.props.khata.productId,
        type:
          this.props.currentTab === "Debtors"
            ? "debtors"
            : rowData === "NA"
            ? "debtors"
            : "creditors",
        payment: this.state.payment,
      };

      getSettleKhata(body)
        .then((response) => {
          this.setState({
            payment: { cash: { amount: 0 }, online: { amount: 0 } },
            settleLoader: false,
          });
          this.getKhataStatus();
          this.props.dispatch(setKhataRowEdit());
          setTimeout(() => {
            this.props.dispatch(fetchKhata());
          }, 1000);
          toast.success(response.data.message, { timeOut: 5000 });
        })
        .catch((err) => {
          this.setState({
            settleLoader: false,
          });
          toast.error(err.data.message, { timeOut: 5000 });
        });
    }
  };

  // setState({...this.state, payment:event})sync (event) => {
  //   this.props.dispatch(
  //     getPaymentData({
  //       paymentData: event,
  //     })
  //   );
  // };
  componentDidMount() {
    this.updateWindowDimensions();
    this.props.dispatch(setKhataRowEdit());
    window.addEventListener("resize", this.updateWindowDimensions);
    // this.getDukandarDetail()
    const search = window.location.search;
    const name = new URLSearchParams(search).get("q");
    const type = new URLSearchParams(search).get("type");
    this.props.dispatch(setCurentTab({ currentTab: "Client khata" }));
    const searchQuery = window.location.search
      ? window.location.search.slice(3)
      : "";
    let body;
    if (name && name !== "") {
      body = {
        field: "purchase_from",
        search: name,
      };
      async function searching() {
        const searchKhataData = await getIndivisualKhata({
          search: name,
          page: 1,
          limit: 20,
          type,
        });
        return searchKhataData.data.data.khata;
      }
      searching().then((res) => {
        this.props.dispatch(
          setKhataSearch({
            data: res,
            currentTab: "clientkhata",
            type,
            search: name,
          })
        );
      });
    } else {
      this.props.dispatch(fetchKhata());
      switch (this.props.currentTab) {
        case "Client khata":
          this.setState({
            tableHeading: "Displaying Khata of",
            mapTableHeading: khataHeadingsSpecific,
            mapTableData: userTableData,
            flag: 2,
            downloadData: "Download Khata",
          });
          break;
        case "Debtors":
          this.setState({
            tableHeading: "Your Den-Dar/Sundry Debtors",
            mapTableHeading: khataHeadingsSell,
            mapTableData: sellTableData,
            flag: 1,
            downloadData: "Download Den-Dar Data",
          });
          this.CreditorsandDebitorsList("debtors");
          break;
        default:
          this.setState({
            tableHeading: "Your Len-Dar/Sundry Creditors",
            mapTableHeading: khataHeadings,
            mapTableData: khataTableData,
            flag: 0,
            downloadData: "Download Len-Dar Data",
          });

          this.CreditorsandDebitorsList("creditors");
          break;
      }
    }
  }
  render() {
    if (this.props.currentTab === "Debtors") {
      var { tableHeading, downloadData, mapTableData, flag, isLoading } =
        this.props.khata;
      flag = 1;
      var mapTableHeading = khataHeadingsForDebtors;
    } else if (this.props.currentTab === "Client khata") {
      var { tableHeading, downloadData, mapTableData, flag, isLoading } =
        this.props.khata;
      flag = 2;
      var mapTableHeading = khataHeadingsForIndividual;
    } else {
      var {
        tableHeading,
        downloadData,
        mapTableHeading,
        mapTableData,
        flag,
        isLoading,
      } = this.props.khata;
    }

    return (
      <>
        <div className="row mx-0">
          {/* <ToastContainer /> */}
          <div className="p-3 card">
            <div className="d-sm-flex justify-content-between align-items-center">
              <div>
                <span className="d-inline-block text-primary fs-6 fs-w600 mb-3 ms-2">
                  {tableHeading.split("of")[0]}{" "}
                  {tableHeading.split("of")[1] && "of"}{" "}
                  <span className="ind-name">
                    {tableHeading.split("of")[1]}
                  </span>
                </span>
              </div>
              <div>
                <button
                  className="btn btn-outline-secondary btn-sm mb-2 mb-sm-0 ms-2 ms-sm-0 download-inventory w-auto"
                  onClick={this.exportInventoryReport}
                  type="submit"
                  disabled={this.props.khata.mapTableData.length <= 0}
                >
                  {this.props.currentTab === "Client khata"
                    ? "Download Khata"
                    : this.props.currentTab === "Debtors"
                    ? "Download Den-Dar Data"
                    : "Download Len-Dar Data"}
                  <i className="ms-2 fas fa-file-download"></i>
                </button>
              </div>
            </div>
            <Table responsive>
              <thead>
                <tr>
                  {mapTableHeading.map((tableHeading, tableHeadingIndex) => (
                    <th
                      key={tableHeadingIndex}
                      className="text-nowrap fs-14 fs-w700"
                    >
                      {tableHeading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapTableData &&
                  mapTableData.map((data, dIndex) => {
                    return (
                      <tr key={dIndex}>
                        {data.row.map((field, fIndex) => (
                          <>
                            {this.props.currentTab === "Client khata" && (
                              <>
                                {fIndex !== 11 && fIndex !== 17 ? (
                                  <td
                                    key={fIndex}
                                    className={
                                      (fIndex === 6 && flag === 0) ||
                                      (fIndex === 12 && flag === 2)
                                        ? `text-danger`
                                        : fIndex === 0 ||
                                          fIndex === 1 ||
                                          fIndex === 5
                                        ? "text-nowrap"
                                        : ""
                                    }
                                    title={field}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    style={
                                      (fIndex === 6 && flag === 1) ||
                                      (fIndex === 19 && flag === 2)
                                        ? { color: "#06B04A" }
                                        : null
                                    }
                                  >
                                    {
                                      fIndex === 0 && (
                                        // this.props.currentTab != "Client khata" ? (
                                        <a href="#">
                                          <NavLink
                                            to={`/clientkhata?q=${
                                              data.row[0]
                                            }&type=${
                                              this.props.currentTab ===
                                              "Debtors"
                                                ? "debit"
                                                : data.type &&
                                                  data.type === "debit"
                                                ? "debit"
                                                : "credit"
                                            }`}
                                            exact
                                            onClick={() => {
                                              window.localStorage.setItem(
                                                "mainTab",
                                                "Khata"
                                              );
                                              this.getKhataStatus();
                                              this.props.dispatch(
                                                setCurentTab({
                                                  currentTab: "Client khata",
                                                })
                                              );
                                              this.props.dispatch(
                                                setActiveToggle("Khata")
                                              );
                                            }}
                                          >
                                            {data.row[0]}
                                          </NavLink>
                                        </a>
                                      )
                                      // )
                                      // : fIndex === 0 ? (
                                      //   field
                                      // ) : (
                                      //   ""
                                      // )
                                    }
                                    {fIndex === 13 &&
                                      this.props.currentTab ===
                                        "Client khata" && (
                                        <td
                                          title={data.row[13]}
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          className={`  ${
                                            this.state.width < 420
                                              ? "comment-break  fs-12"
                                              : data.row[13]?.length > 0 &&
                                                " fs-12 cursor-pointer"
                                          }`}
                                        >
                                          {data.row[13].length > 15 &&
                                          this.state.width > 420
                                            ? data.row[13].slice(0, 15) + "..."
                                            : data.row[13]}{" "}
                                        </td>
                                      )}
                                    {fIndex === 18 &&
                                      this.props.currentTab ===
                                        "Client khata" && (
                                        <td
                                          title={data.row[18]}
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          className={`  ${
                                            this.state.width < 420
                                              ? "comment-break  fs-12"
                                              : data.row[18]?.length > 0 &&
                                                " fs-12 cursor-pointer"
                                          }`}
                                        >
                                          {data.row[18].length > 15 &&
                                          this.state.width > 420
                                            ? data.row[18].slice(0, 15) + "..."
                                            : data.row[18]}{" "}
                                        </td>
                                      )}
                                    {
                                      fIndex === 1 && (
                                        // this.props.currentTab != "Client khata" ? (
                                        <a href="#">
                                          <NavLink
                                            to={`/clientkhata?q=${
                                              data.row[1]
                                            }&type=${
                                              this.props.currentTab ===
                                              "Debtors"
                                                ? "debit"
                                                : data.type &&
                                                  data.type === "debit"
                                                ? "debit"
                                                : "credit"
                                            }`}
                                            exact
                                            onClick={() => {
                                              window.localStorage.setItem(
                                                "mainTab",
                                                "Khata"
                                              );
                                              this.getKhataStatus();
                                              this.props.dispatch(
                                                setCurentTab({
                                                  currentTab: "Client khata",
                                                })
                                              );
                                              this.props.dispatch(
                                                setActiveToggle("Khata")
                                              );
                                            }}
                                          >
                                            {data.row[1]}
                                          </NavLink>
                                        </a>
                                      )
                                      // )
                                      // : fIndex === 1 ? (
                                      //   field
                                      // ) : (
                                      //   ""
                                      // )
                                    }

                                    {this.props.currentTab === "Client khata" &&
                                    field &&
                                    fIndex === 0
                                      ? " "
                                      : this.props.currentTab ===
                                          "Client khata" && fIndex === 1
                                      ? " "
                                      : this.props.currentTab ===
                                          "Client khata" &&
                                        (fIndex === 13 || fIndex === 18)
                                      ? " "
                                      : field}
                                  </td>
                                ) : this.props.khata.editSettle &&
                                  this.props.khata.rowId === dIndex ? (
                                  <>
                                    {data.row[16] === "NA" && fIndex === 17 ? (
                                      <>
                                        <td>-</td>
                                      </>
                                    ) : data.row[10] === "NA" &&
                                      fIndex === 11 ? (
                                      <>
                                        <td>-</td>
                                      </>
                                    ) : (
                                      <td>
                                        <div style={{ width: "13.75rem" }}>
                                          <DropdownButton
                                            variant="btn-sm fs-12 dropdown-specific-border"
                                            id="dropdown-item-button"
                                            title="Mode of Payment"
                                          >
                                            <div className="dropdown-item">
                                              <div className="row">
                                                <div className="col-4">
                                                  <input
                                                    type="checkbox"
                                                    id="cash"
                                                    className="form-check-input"
                                                    style={{
                                                      borderRadius: "1px",
                                                      borderColor: "#143B64",
                                                    }}
                                                    defaultChecked={
                                                      data?.payment?.cash
                                                        ?.amount ||
                                                      data?.soldPayment?.cash
                                                        ?.amount
                                                    }
                                                    name="cashChecked"
                                                    onChange={(e) =>
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          cash: {
                                                            amount: e.target
                                                              .checked
                                                              ? parseInt(
                                                                  data?.payment
                                                                    ?.cash
                                                                    ?.amount
                                                                ) ||
                                                                parseInt(
                                                                  data
                                                                    ?.soldPayment
                                                                    ?.cash
                                                                    ?.amount
                                                                )
                                                              : 0,
                                                          },
                                                        },
                                                        is_cash:
                                                          e.target.checked,
                                                      })
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="cash"
                                                    className="ms-2 fs-12 fw-400 payment-style"
                                                  >
                                                    Cash
                                                  </label>
                                                </div>
                                                <div className="col-8 ">
                                                  <input
                                                    type="number"
                                                    style={{
                                                      width: "7.25rem",
                                                      height: "1.938rem",
                                                    }}
                                                    name="cash"
                                                    value={
                                                      this.state.payment.cash
                                                        .amount
                                                      //   ||
                                                      // data?.soldPayment?.cash
                                                      //   ?.amount ||
                                                      // 0

                                                      // data.payment.cash.amount
                                                      //   ? data.payment.cash
                                                      //       .amount
                                                      //   : ""
                                                      // this.state.payment?.cash
                                                      //   ?.amount
                                                      //   ? this.state.payment
                                                      //       ?.cash?.amount
                                                      //   : ""
                                                    }
                                                    // defaultValue={parseInt(
                                                    //   data.purchase.payment.cash.amount
                                                    // )}
                                                    onChange={(e) => {
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          cash: {
                                                            amount:
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : parseInt(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                          },
                                                        },
                                                      });
                                                    }}
                                                    className={"form-control"}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {/* <Dropdown.Divider /> */}
                                            <div className="dropdown-item">
                                              <div className="row">
                                                <div className="col-4">
                                                  <input
                                                    type="checkbox"
                                                    id="online"
                                                    name="onlineChecked"
                                                    className="form-check-input"
                                                    style={{
                                                      borderRadius: "1px",
                                                      borderColor: "#143B64",
                                                    }}
                                                    defaultChecked={
                                                      data.payment?.online
                                                        ?.amount ||
                                                      data.soldPayment?.online
                                                        ?.amount
                                                        ? true
                                                        : false
                                                    }
                                                    onChange={(e) => {
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          online: {
                                                            amount: e.target
                                                              .checked
                                                              ? parseInt(
                                                                  data?.payment
                                                                    ?.online
                                                                    ?.amount
                                                                ) ||
                                                                parseInt(
                                                                  data
                                                                    ?.soldPayment
                                                                    ?.online
                                                                    ?.amount
                                                                )
                                                              : 0,
                                                          },
                                                        },
                                                        is_online:
                                                          e.target.checked,
                                                      });
                                                    }}
                                                  />
                                                  <label
                                                    htmlFor="online"
                                                    className="fs-12 ms-2 fw-400 payment-style"
                                                  >
                                                    Online
                                                  </label>
                                                </div>
                                                <div className="col-8">
                                                  <input
                                                    type="number"
                                                    style={{
                                                      width: "7.25rem",
                                                      height: "1.938rem",
                                                    }}
                                                    name="online"
                                                    value={
                                                      this.state.payment.online
                                                        .amount
                                                      //   ||
                                                      // data?.soldPayment?.online
                                                      //   ?.amount ||
                                                      // 0 // data.payment.online.amount
                                                      //   ? data.payment.online
                                                      //       .amount
                                                      //   : ""
                                                      // this.state.payment?.online
                                                      //   ?.amount
                                                      //   ? this.state.payment
                                                      //       ?.online?.amount
                                                      //   : ""
                                                    }
                                                    onChange={(e) =>
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          online: {
                                                            amount:
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : parseInt(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                          },
                                                        },
                                                      })
                                                    }
                                                    // defaultValue={parseInt(
                                                    //   data.purchase.payment.online.amount
                                                    // )}
                                                    className={"form-control"}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </DropdownButton>
                                        </div>
                                      </td>
                                    )}
                                  </>
                                ) : (
                                  <td
                                    key={fIndex}
                                    className={
                                      fIndex === 6 && flag === 0
                                        ? `text-danger`
                                        : fIndex === 0 ||
                                          fIndex === 1 ||
                                          fIndex === 5
                                        ? "text-nowrap"
                                        : ""
                                    }
                                    title={field}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    style={
                                      fIndex === 6 && flag === 1
                                        ? { color: "#06B04A" }
                                        : null
                                    }
                                  >
                                    {field}
                                  </td>
                                )}
                              </>
                            )}

                            {this.props.currentTab !== "Client khata" && (
                              <>
                                {fIndex !== 0 &&
                                fIndex !== 1 &&
                                fIndex !== 6 &&
                                fIndex !== 5 &&
                                fIndex !== 7 ? (
                                  <td>{field}</td>
                                ) : fIndex === 7 ? (
                                  <td
                                    title={data.row[7]}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    className={`  ${
                                      this.state.width < 420
                                        ? "comment-break  fs-12"
                                        : data.row[7]?.length > 0 &&
                                          " cursor-pointer  fs-12"
                                    }`}
                                  >
                                    {data.row[7].length > 15 &&
                                    this.state.width > 420
                                      ? data.row[7].slice(0, 15) + "..."
                                      : data.row[7]}
                                  </td>
                                ) : fIndex === 6 ? (
                                  <td
                                    className={flag === 0 ? "text-danger" : ""}
                                    style={{
                                      color: flag === 0 ? null : "#06b04a",
                                    }}
                                  >
                                    {field}
                                  </td>
                                ) : fIndex === 0 || fIndex === 1 ? (
                                  <td>
                                    <a href="#">
                                      <NavLink
                                        to={`/clientkhata?q=${field}&type=${
                                          this.props.currentTab === "Debtors"
                                            ? "debit"
                                            : data.type && data.type === "debit"
                                            ? "debit"
                                            : "credit"
                                        }`}
                                        exact
                                        onClick={() => {
                                          window.localStorage.setItem(
                                            "mainTab",
                                            "Khata"
                                          );
                                          this.getKhataStatus();
                                          this.props.dispatch(
                                            setCurentTab({
                                              currentTab: "Client khata",
                                            })
                                          );
                                          this.props.dispatch(
                                            setActiveToggle("Khata")
                                          );
                                        }}
                                      >
                                        {field}
                                      </NavLink>
                                    </a>
                                  </td>
                                ) : fIndex === 5 ? (
                                  <>
                                    {this.props.khata.editSettle &&
                                    this.props.khata.rowId === dIndex ? (
                                      <td>
                                        <div style={{ width: "13.75rem" }}>
                                          <DropdownButton
                                            variant="btn-sm fs-12 dropdown-specific-border"
                                            id="dropdown-item-button"
                                            title="Mode of Payment"
                                          >
                                            <div className="dropdown-item">
                                              <div className="row">
                                                <div className="col-4">
                                                  <input
                                                    type="checkbox"
                                                    id="cash"
                                                    className="form-check-input"
                                                    style={{
                                                      borderRadius: "1px",
                                                      borderColor: "#143B64",
                                                    }}
                                                    defaultChecked={
                                                      this.state.payment?.cash
                                                        ?.amount
                                                    }
                                                    name="cashChecked"
                                                    onChange={(e) => {
                                                      this.setState({
                                                        ...this.state,
                                                        is_cash:
                                                          e.target.checked,
                                                      });
                                                      //
                                                    }}
                                                  />
                                                  <label
                                                    htmlFor="cash"
                                                    className="ms-2 fs-12 fw-400 payment-style"
                                                  >
                                                    Cash
                                                  </label>
                                                </div>
                                                <div className="col-8 ">
                                                  <input
                                                    type="number"
                                                    style={{
                                                      width: "7.25rem",
                                                      height: "1.938rem",
                                                    }}
                                                    name="cash"
                                                    value={
                                                      this.state.payment?.cash
                                                        ?.amount
                                                        ? this.state.payment
                                                            ?.cash?.amount
                                                        : ""
                                                    }
                                                    // defaultValue={parseInt(
                                                    //   data.purchase.payment.cash.amount
                                                    // )}
                                                    onChange={(e) => {
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          cash: {
                                                            amount:
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : parseInt(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                          },
                                                        },
                                                      });
                                                    }}
                                                    className={"form-control"}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {/* <Dropdown.Divider /> */}
                                            <div className="dropdown-item">
                                              <div className="row">
                                                <div className="col-4">
                                                  <input
                                                    type="checkbox"
                                                    id="online"
                                                    name="onlineChecked"
                                                    className="form-check-input"
                                                    style={{
                                                      borderRadius: "1px",
                                                      borderColor: "#143B64",
                                                    }}
                                                    defaultChecked={
                                                      this.state.payment?.online
                                                        ?.amount
                                                    }
                                                    onChange={(e) =>
                                                      this.setState({
                                                        ...this.state,
                                                        is_online:
                                                          e.target.checked,
                                                      })
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="online"
                                                    className="fs-12 ms-2 fw-400 payment-style"
                                                  >
                                                    Online
                                                  </label>
                                                </div>
                                                <div className="col-8">
                                                  <input
                                                    type="number"
                                                    style={{
                                                      width: "7.25rem",
                                                      height: "1.938rem",
                                                    }}
                                                    name="online"
                                                    value={
                                                      this.state.payment?.online
                                                        ?.amount
                                                        ? this.state.payment
                                                            ?.online?.amount
                                                        : ""
                                                    }
                                                    onChange={(e) =>
                                                      this.setState({
                                                        ...this.state,
                                                        payment: {
                                                          ...this.state.payment,
                                                          online: {
                                                            amount:
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : parseInt(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                          },
                                                        },
                                                      })
                                                    }
                                                    // defaultValue={parseInt(
                                                    //   data.purchase.payment.online.amount
                                                    // )}
                                                    className={"form-control"}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </DropdownButton>
                                        </div>
                                      </td>
                                    ) : (
                                      <td>{field}</td>
                                    )}
                                  </>
                                ) : (
                                  <td></td>
                                )}
                              </>
                            )}
                          </>
                        ))}
                        <td>
                          {data.row[6] !== 0 &&
                          this.props.khata.editSettle &&
                          this.props.khata.rowId === dIndex ? (
                            <div className="d-flex justify-content-center">
                              {this.state.settleLoader === false && (
                                <>
                                  <button
                                    className="btn btn-secondary btn-sm me-3 "
                                    onClick={() => {
                                      this.props.dispatch(setKhataRowEdit());
                                      this.setState({
                                        ...this.state,
                                        payment: {
                                          cash: { amount: 0 },
                                          online: { amount: 0 },
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm "
                                    onClick={() =>
                                      this.settle(
                                        data.row[10],
                                        data.row[9],
                                        data.row[15],
                                        data.row[3]
                                      )
                                    }
                                  >
                                    <i className=" fas fa-check "></i>
                                  </button>
                                </>
                              )}
                              {this.state.settleLoader && (
                                <SyncLoader size={6} color={"#143B64"} />
                              )}
                            </div>
                          ) : (
                            data.row[6] !== 0 && (
                              <>
                                {data.row[12] === "NA" ? (
                                  data.row[19] ? (
                                    <Button
                                      variant="primary btn-sm mr-3"
                                      // disabled={data.row[6] == 0}
                                      onClick={() => {
                                        this.handleEditEditShow(
                                          dIndex,
                                          data.payment,
                                          data.soldPayment,
                                          data.row[10]
                                        );
                                      }}
                                      // onClick={() => this.settle(data.id)}
                                    >
                                      Settle
                                    </Button>
                                  ) : (
                                    " "
                                  )
                                ) : data.row[12] ? (
                                  <Button
                                    variant="primary btn-sm mr-3"
                                    // disabled={data.row[6] == 0}
                                    onClick={() => {
                                      this.handleEditEditShow(
                                        dIndex,
                                        data.payment,
                                        data.soldPayment,
                                        data.row[10]
                                      );
                                    }}
                                    // onClick={() => this.settle(data.id)}
                                  >
                                    Settle
                                  </Button>
                                ) : (
                                  " "
                                )}
                              </>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className="d-flex">{/* <DynamicPagination /> */}</div>
            {mapTableData && mapTableData.length <= 0 ? (
              isLoading ? (
                <div className="noState">
                  <p className="text-muted fs-w600 fs-6 text-center">
                    <SyncLoader size={10} color="#143B64" />
                  </p>
                </div>
              ) : (
                <NoData />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const khata = state.khata;
  const header = state.header;
  const inventory = state.inventory;
  return {
    khata,
    header,
    inventory,
  };
};
export default connect(mapStateToProps)(MainKhataData);
