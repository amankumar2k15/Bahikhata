import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userImg from "../../assets/img/avatarmale.png";
import {
  Nav,
  Navbar,
  DropdownButton,
  Dropdown,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, NavLink, Redirect } from "react-router-dom";
import SearchProduct from "../SearchProduct";
import Stocks from "../Dashboard/Stocks";
import { header_messages } from "../../constants/headerMessages";
import {
  button_headings,
  khata_button_headings,
} from "../../constants/button_headings";
import { SyncLoader } from "react-spinners";
import { clearStorage } from "../../helpers/token.helper";
import {
  getDashboardStatusService,
  getKhataStatusService,
  getOpeningStockService,
  getDukandarDetailService,
  getAdvanceProductStatusService,
  getSearchProducts,
} from "../../services/api.service";

import history from "../../history";
import toastr from "toastr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "react-router-dom/cjs/react-router-dom.min";
import {
  fetchInventory,
  resetSearch,
  setSearch,
} from "../../store/slices/dashboardSlice";
let dateset;
import Dashboard from "../Dashboard/Dashboard";
import { connect } from "react-redux";
import moment from "moment";
import {
  SEARCH_KHATA_CREDITORS,
  SEARCH_KHATA_DEBTORS,
  SEARCH_KHATA_INDVIDUAL,
} from "../../constants/searchPlaceholders";
import {
  fetchKhata,
  resetKhataSearch,
  setCurrentTab,
  setKhataSearch,
} from "../../store/slices/khataSlice";
import { setType } from "../../store/slices/headerSlice";
// import { fetchKhata } from "../../store/slices/khataSlice";
// import { setCurrentTab } from "../../store/slices/khataSlice";

let flag = false;
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(setType("all"));
    props.dispatch(fetchInventory());
    this.state = {
      activeToggle: "dashboard",
      data: header_messages,
      from: "",
      to: "",
      // from: moment().format("YYYY-MM-DD"),
      // to: moment().format("YYYY-MM-DD"),
      isLoading: true,
      openingStock: 0,
      hideValue: "",
      dashboardStatus: button_headings,
      khataStatus: khata_button_headings,
      isLoggedOut: false,
      currentTab: "",
      search: "",
      dukandarData: null,
      soldBalance: false,
      postData: {
        page: 1,
        limit: 20,
        total: 0,
      },
      date: new Date().toISOString().slice(0, 10),
    };
  }

  onLogout = () => {
    clearStorage();
    this.setState({
      isLoggedOut: true,
    });
    window.refresh();
  };
  hendleMainTab = (tab) => {
    window.localStorage.setItem("mainTab", tab);
    window.dispatchEvent(new Event("storage"));

    if (tab == "Khata") {
      this.getKhataStatus();
    } else if (tab == "dashboard") {
      flag = true;
      // this.getDashboardStatus();
    }

    this.setState(
      {
        activeToggle: tab,
      },
      () => {
        if (
          window.location.pathname === "/bahikhata/dev/app/" ||
          window.location.pathname === "/bahikhata/dev/app/khata"
        ) {
          if (tab == "Khata") {
            history.push("/bahikhata/dev/app/khata");
          } else if (tab == "dashboard") {
            history.push("/bahikhata/dev/app/");
          }
          // this.props.dispatch(setActiveTab(tab == "Khata" ? "Creditors" : "Dashboards"))
          this.setState({
            activeToggle: tab,
            currentTab: tab == "Khata" ? "Creditors" : "Dashboards",
            hideValue: tab == "Khata" ? "Creditors" : "Dashboards",
          });
        }
      }
    );

    return true;
  };

  // dashboard status
  getDashboardStatus = () => {
    getDashboardStatusService()
      .then((res) => {
        // setDashboardStatus(res.data.data);
        const { totalInventory, totalPurchase, totalSold } = res.data.data[0];
        const status = [...button_headings];
        // check if totalInventory is empty
        if (totalInventory.length !== 0) {
          status[0].subHeadingTextLeft = totalInventory[0].totalNumber;
          status[0].subHeadingTextRight = totalInventory[0].totalSum;
        }
        // check if totalPurchase is empty
        if (totalPurchase.length !== 0) {
          status[1].subHeadingTextLeft = totalPurchase[0].totalNumber;
          status[1].subHeadingTextRight = totalPurchase[0].totalSum;
        }
        // check if totalSold is empty
        if (totalSold.length !== 0) {
          status[2].subHeadingTextLeft = totalSold[0].totalNumber;
          status[2].subHeadingTextRight = totalSold[0].totalSum;
        }
        this.setState({
          dashboardStatus: status,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  // Khata Status
  getKhataStatus = () => {
    getKhataStatusService()
      .then((res) => {
        const khataData = res.data.data[0];

        const status = [...khata_button_headings];
        // check if khataData.creditors is empty
        if (khataData.creditors.length !== 0) {
          status[0].subHeading = khataData.creditors[0].totalSum;
        }
        // check if khataData.debtors is empty
        if (khataData.debtors.length !== 0) {
          status[1].subHeading =
            khataData.debtors[0].totalSum + khataData.debtors[0].gstSum;
        }

        this.setState({
          khataStatus: status,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  getDukandarDetail = async (id) => {
    return await getDukandarDetailService(id)
      .then((res) => {
        this.setState({
          dukandarData: res.data.data,
        });
        return true;
      })
      .catch((err) => {
        return false;
      });
  };

  // get Stock
  getOpeningStock = () => {
    getOpeningStockService()
      .then((res) => {
        this.setState({
          openingStock: res.data.data,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  handleAdvanceSercSubmit = (event) => {
    event.preventDefault();
    let body;
    if (
      event.target.elements.product_name ||
      event.target.elements.product_imei ||
      event.target.elements.product_model ||
      event.target.elements.product_user ||
      event.target.elements.product_color ||
      event.target.elements.product_number
    ) {
      body = {
        product: event.target.elements.product_name
          ? event.target.elements.product_name.value
          : null,
        imei: event.target.elements.product_imei
          ? event.target.elements.product_imei.value
          : null,
        model: event.target.elements.product_model
          ? event.target.elements.product_model.value
          : null,
        first_name: event.target.elements.product_user
          ? event.target.elements.product_user.value
          : null,
        last_name: event.target.elements.product_user
          ? event.target.elements.product_user.value
          : null,
        color: event.target.elements.product_color
          ? event.target.elements.product_color.value
          : null,
        mobile: event.target.elements.product_number
          ? event.target.elements.product_number.value
          : null,
        from: "",
        to: "",
        is_sold: "",
      };
      window.localStorage.setItem("advanceSearch", JSON.stringify(body));
      window.localStorage.setItem(
        "advanceSearch-section",
        this.state.currentTab
      );
      window.dispatchEvent(new Event("storage"));
    } else {
      window.localStorage.removeItem("advanceSearch");
      window.localStorage.removeItem("advanceSearch-section");
      window.dispatchEvent(new Event("storage"));
    }
  };
  updateallfunction = (section) => {
    if (window.localStorage.getItem("mainTab") == "Khata") {
      this.getKhataStatus();
    } else if (window.localStorage.getItem("mainTab") == "profile") {
    } else {
      // this.getDashboardStatus();
    }
  };
  advanceSearch = async () => {
    let body = {
      product: this.state.search !== "" ? this.state.search : "",
      imei: "",
      model: "",
      first_name: "",
      last_name: "",
      color: "",
      mobile: "",
      from: this.state.from,
      to: this.state.to,
      balance: this.state.soldBalance,
      is_sold:
        window.location.pathname === "/bahikhata/dev/app/sales" ? true : false,
    };
    let searchData = await getAdvanceProductStatusService({
      page: this.state.postData.page,
      limit: this.state.postData.limit,
      body,
    })
      .then(async (res) => await res.data?.data?.products)
      .catch((err) => toast.error("No data found."));
    this.props.dispatch(setSearch({ searchData, body }));
  };

  // phone number validation
  phonenumber = (phone) => {
    var isPhone = /^\d{10}$/;
    if (phone.match(isPhone)) {
      return true;
    } else {
      // toast.error("Please enter a valid phone number");
      return false;
    }
  };

  // search khata functions
  SearchProductsForKhata = async (currentTab) => {
    if (!this.state.search) {
      const khataTabs = currentTab === "Debtors" ? "debtors" : "creditors";
      this.props.dispatch(fetchKhata(khataTabs));
      return;
    }
    let body;
    if (this.phonenumber(this.state.search)) {
      if (currentTab === "Debtors") {
        body = {
          field: "sold_phone",
          search: this.state.search,
        };
      } else {
        body = {
          field: "purchase_phone",
          search: this.state.search,
        };
      }
    } else {
      if (currentTab === "Debtors") {
        body = {
          field: "sold_to",
          search: this.state.search,
        };
      } else {
        body = {
          field: "purchase_from",
          search: this.state.search,
        };
      }
    }
    const searchKhataData = await getSearchProducts(body);
    this.props.dispatch(
      setKhataSearch({ data: searchKhataData.data.data, currentTab })
    );
  };

  componentDidMount() {
    if (localStorage.getItem("userId")) {
      this.getDukandarDetail(localStorage.getItem("userId")).then((res) => {
        if (!res) {
          this.onLogout();
        }
      });
    } else {
      this.onLogout();
    }

    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 500);

    this.setState({
      data: header_messages[0],
      // hideValue:"Sales"
    });
    // get dashboard status
    if (window.localStorage.getItem("mainTab") == "Khata") {
      this.getKhataStatus();
      this.setState({
        currentTab:
          window.location.pathname === "/bahikhata/dev/app/clientkhata"
            ? "Client khata"
            : window.location.pathname === "/bahikhata/dev/app/debtors"
            ? "Debtors"
            : "Creditors",
      });
      this.hendleMainTab("Khata");
    } else if (window.localStorage.getItem("mainTab") == "profile") {
      this.hendleMainTab("profile");
    } else {
      this.hendleMainTab("dashboard");
      // this.getDashboardStatus();
      this.getOpeningStock();
      this.setState({
        currentTab:
          window.location.pathname === "/bahikhata/dev/app/puchase"
            ? "Purchase"
            : window.location.pathname === "/bahikhata/dev/app/sales"
            ? "Sales"
            : "Dashboard",
      });
    }
  }

  render() {
    window.addEventListener("storage", () => {
      if (window.localStorage.getItem("advanceSearch-section")) {
        let body = window.localStorage.getItem("advanceSearch-section");
        const isNullish = Object.values(body).every((value) => {
          if (value === null || value.length < 1) {
            return true;
          }

          return false;
        });
        if (isNullish) {
          window.localStorage.removeItem("advanceSearch");
          window.localStorage.removeItem("advanceSearch-section");
        }
      }
      if (window.localStorage.getItem("advanceSearch-section")) {
        this.updateallfunction(
          window.localStorage.getItem("advanceSearch-section")
        );
      } else if (window.localStorage.getItem("section-update")) {
        this.updateallfunction(window.localStorage.getItem("section-update"));
      }
    });

    const {
      activeToggle,
      isLoggedOut,
      khataStatus,
      data,
      dashboardStatus,
      dukandarData,
      openingStock,
      isLoading,
      hideValue,
      currentTab,
    } = this.state;

    return (
      <>
        {isLoggedOut && <Redirect to="/login" />}

        <div className="container-fluid ps-0">
          <ToastContainer />
          <div className="d-sm-flex align-items-center">
            <div className="header-logo d-flex align-items-center">
              <div>
                <Link
                  to="/"
                  className="text-decoration-none text-primary"
                  onClick={() => {
                    this.hendleMainTab("dashboard");

                    // this.props.dispatchfetchInventory()
                  }}
                >
                  <div className="logo bg-white px-3  py-2 pb-sm-2 pb-0">
                    <i className="fas fa-book-reader"></i> Bahi Khata
                  </div>
                </Link>
                <div className="page-info ms-3 d-sm-none d-block">
                  <h1 className="fs-w600 page-info-text text-primary">
                    {window.localStorage.getItem("mainTab") == "Khata"
                      ? "Khata"
                      : "Dashboard"}
                  </h1>
                </div>
              </div>
              <div className="page-info ms-3 d-sm-block d-none">
                <h1 className="fs-w600 page-info-text text-primary">
                  {window.localStorage.getItem("mainTab") == "Khata"
                    ? "Khata"
                    : "Dashboard"}
                </h1>
              </div>
              <div className="user-info ms-auto d-flex align-items-center d-sm-none d-block">
                <div className="user-name-deg text-end">
                  <h6 className="user-info-text text-primary fs-w600 text-break">
                    {dukandarData && dukandarData.firstName
                      ? dukandarData.firstName
                      : ""}{" "}
                    {dukandarData && dukandarData.lastName
                      ? dukandarData.lastName
                      : ""}
                  </h6>
                  <p className="header-muted fs-w500 fs-14">{"Owner"}</p>
                </div>
                <div>
                  <Link
                    to="/profile"
                    onClick={() => {
                      this.hendleMainTab("profile");
                    }}
                  >
                    <div className="user-img ps-2">
                      <img
                        src={
                          dukandarData &&
                          dukandarData.image &&
                          dukandarData?.image.split("images")[1] !== "/null"
                            ? dukandarData.image
                            : userImg
                        }
                        alt={
                          dukandarData && dukandarData.firstName
                            ? dukandarData.firstName
                            : ""
                        }
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="user-info ms-auto d-flex align-items-center d-sm-block d-none">
              <div className="d-flex">
                <div className="user-name-deg text-end">
                  <h6 className="user-info-text text-primary fs-w600 text-break">
                    {dukandarData && dukandarData.firstName
                      ? dukandarData.firstName
                      : ""}{" "}
                    {dukandarData && dukandarData.lastName
                      ? dukandarData.lastName
                      : ""}
                  </h6>
                  <p className="header-muted fs-w500 fs-14">{"Owner"}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => {
                    this.hendleMainTab("profile");
                  }}
                >
                  <div className="user-img ps-2">
                    <img
                      src={
                        dukandarData &&
                        dukandarData.image &&
                        dukandarData?.image.split("images")[1] !== "/null"
                          ? dukandarData.image
                          : userImg
                      }
                      alt={
                        dukandarData && dukandarData.firstName
                          ? dukandarData.firstName
                          : ""
                      }
                      style={{
                        height: "35px",
                        width: "35px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Navbar bg="primary" variant="dark" className="h-71">
          <Nav as="ul" className="ps-3 ">
            <Nav.Item
              as="li"
              onClick={() => {
                this.hendleMainTab("dashboard");
                this.props.dispatch(resetSearch());
                this.props.dispatch(setType("all"));
                this.props.dispatch(fetchInventory());
              }}
              className="nav-tab"
            >
              <NavLink
                to="/"
                // href="/"
                data-toggle="tab"
                className={`${
                  activeToggle === "dashboard"
                    ? "active bg-active show text-white text-decoration-none"
                    : "text-white text-decoration-none"
                }`}
              >
                <FontAwesomeIcon icon="columns" className="me-2" /> Dashboard
              </NavLink>
            </Nav.Item>
            <Nav.Item as="li" className="nav-tab ">
              <NavLink
                to="/khata"
                data-toggle="tab"
                onClick={() => {
                  this.hendleMainTab("Khata");
                }}
                className={`ms-2 ${
                  activeToggle === "Khata"
                    ? "active bg-active show text-white text-decoration-none"
                    : " text-white text-decoration-none"
                }`}
              >
                <FontAwesomeIcon icon="book-open" className="me-2" /> Khata
              </NavLink>
            </Nav.Item>
          </Nav>
          <Nav className="ms-auto me-2">
            <Nav.Link href="#deets" className="nav-link-sub-right">
              <FontAwesomeIcon icon="question-circle" />
            </Nav.Link>
          </Nav>
        </Navbar>
        <div className="tab-content">
          <div
            id="dashboard"
            className={`tab-pane fade ${
              activeToggle === "dashboard" ? "active show" : ""
            }`}
          >
            {currentTab == "Dashboards" ? (
              <Stocks setData={header_messages[0]} setStock={openingStock} />
            ) : (
              ""
            )}
            {currentTab == "Purchase" ? (
              <Stocks setData={header_messages[1]} setStock={openingStock} />
            ) : (
              ""
            )}
            {currentTab == "Sales" ? (
              <Stocks setData={header_messages[2]} setStock={openingStock} />
            ) : (
              ""
            )}
            <div className="container-fluid pt-3">
              <div className="make-scroll">
                {dashboardStatus.map((value, index) => (
                  <div className={index === 1 ? "mx-2" : ""} key={index}>
                    <NavLink
                      to={value.buttonLink}
                      className={`nav-link px-0 ${
                        currentTab === value.title ? "active-nav" : ""
                      }`}
                      activeClassName="active-nav"
                      {...(this.state.currentTab === value.title
                        ? `aria-current="page"`
                        : "")}
                      exact
                      onClick={() => {
                        this.setState({
                          currentTab: value.title,
                          hideValue: value.title,
                        });
                        this.props.dispatch(resetSearch());
                      }}
                    >
                      <div className="card p-2-5 tab-border-color shadow-sm">
                        <div className="row">
                          <div className="col-6 have-border">
                            <p className="fs-12 fs-w600">
                              {value.headingTextLeft}
                            </p>
                            {isLoading ? (
                              <div className="text-center py-3">
                                <SyncLoader
                                  size={10}
                                  color={
                                    currentTab === "Dashboards" ||
                                    currentTab === "Purchase" ||
                                    currentTab === "Sales"
                                      ? "#fff"
                                      : "#143B64"
                                  }
                                />
                              </div>
                            ) : (
                              <h1>{value.subHeadingTextLeft}</h1>
                            )}
                          </div>
                          <div className="col-6 ps-3">
                            <p className="fs-12 fs-w600">
                              {value.headingTextRight}
                            </p>
                            {isLoading ? (
                              <div className="text-center py-3">
                                <SyncLoader
                                  size={10}
                                  color={
                                    currentTab === "Dashboards" ||
                                    currentTab === "Purchase" ||
                                    currentTab === "Sales"
                                      ? "#fff"
                                      : "#143B64"
                                  }
                                />
                              </div>
                            ) : (
                              <h1>{value.subHeadingTextRight}</h1>
                            )}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
            {flag && (
              <div className="container-fluid mt-3">
                <div className="row">
                  <div className="col-12">
                    <div className="card py-2 pe-3">
                      <div className="row ms-1">
                        <div className="col-lg-8 mb-2 mb-md-0 d-flex align-items-sm-center">
                          {(hideValue === "Purchase" ||
                            hideValue === "Sales") && (
                            <>
                              <div className="row w-100">
                                <div className="col-md-4 d-flex align-items-center mb-2 mb-md-0 w-auto">
                                  <div className="row justify-content-between">
                                    <div className="col d-flex align-items-center">
                                      <div className="label fs-6 fs-w600 text-primary  ps-1 date_title">
                                        From&nbsp;Date
                                      </div>
                                      <div className="input mx-3">
                                        <input
                                          onChange={(e) =>
                                            this.setState({
                                              ...this.state,
                                              from: moment(
                                                e.target.value
                                              ).format("YYYY-MM-DD"),
                                            })
                                          }
                                          defaultValue={this.state.date}
                                          type="date"
                                          style={{
                                            width: "100px",
                                          }}
                                          // value="2018-07-22"
                                          className="form-control fs-12 fs-w400 session-date"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 d-flex align-items-center w-auto">
                                  <div className="row justify-content-between">
                                    <div className="col d-flex align-items-center">
                                      <div className="label fs-6 fs-w600 text-primary  ps-1 date_title">
                                        To&nbsp;Date
                                      </div>
                                      <div className="input mx-3">
                                        {/* w-specific-150 */}
                                        <input
                                          onChange={(e) =>
                                            this.setState({
                                              ...this.state,
                                              to: moment(e.target.value).format(
                                                "YYYY-MM-DD"
                                              ),
                                            })
                                          }
                                          type="date"
                                          style={{
                                            width: "100px",
                                          }}
                                          className="form-control fs-12 fs-w400 session-date"
                                          defaultValue={this.state.date}
                                          min={this.state.from}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 d-flex align-items-center two_btn pe-0">
                                  <button
                                    className="btn btn-primary  mt-md-0 mt-3 btn-sm fs-12 fs-w600"
                                    onClick={() => this.advanceSearch()}
                                  >
                                    Search
                                  </button>
                                  {hideValue === "Sales" && (
                                    <div className="ms-2 mt-md-0 mt-3 all_filter">
                                      <DropdownButton
                                        id="dropdown-item-button"
                                        title="All"
                                        variant="primary btn-sm fs-12"
                                      >
                                        <Dropdown.Item
                                          as="button"
                                          className="fs-12"
                                          onClick={() =>
                                            this.setState({
                                              ...this.state,
                                              soldBalance: false,
                                            })
                                          }
                                        >
                                          Fully paid
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          as="button"
                                          className="fs-12"
                                          onClick={() =>
                                            this.setState({
                                              ...this.state,
                                              soldBalance: true,
                                            })
                                          }
                                        >
                                          Partially Paid
                                        </Dropdown.Item>
                                      </DropdownButton>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-lg-4 mb-2 mt-md-2">
                          <div className="d-sm-flex align-items-center">
                            <div className="filter-menu ms-auto me-3 mb-2 mb-sm-0">
                              <DropdownButton
                                id={`dropdown-button-drop-down`}
                                key={"down"}
                                drop="down"
                                variant="outline-primary border-0 fs-12 fs-w600 ps-1"
                                title={` Advance Search `}
                              >
                                <Form
                                  className="row pt-sm-0"
                                  method="POST"
                                  onSubmit={this.handleAdvanceSercSubmit}
                                >
                                  <div className="row mx-auto">
                                    <div className="col-sm-12">
                                      <div
                                        className="row "
                                        style={{
                                          width: "auto",
                                          height: "auto",
                                        }}
                                      >
                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">
                                            Product&nbsp;Name
                                          </p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-2"
                                            name="product_name"
                                          />
                                        </div>
                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">IMEI</p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-sm-3 ms-2"
                                            name="product_imei"
                                          />
                                        </div>

                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">Model</p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-2"
                                            name="product_model"
                                          />
                                        </div>
                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">User</p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-2"
                                            name="product_user"
                                          />
                                        </div>
                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">Color</p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-2"
                                            name="product_color"
                                          />
                                        </div>
                                        <div className="col-sm-5  mb-2 d-flex  align-items-center">
                                          <p className="search-title">
                                            Ph. No.
                                          </p>
                                          <input
                                            type="text"
                                            className="form-control search-input ms-sm-3 ms-2"
                                            name="product_number"
                                          />
                                        </div>
                                        <div className="col-sm-2 col-12 d-flex justify-content-center align-items-end ">
                                          <div className="pb-2">
                                            <button
                                              type="submit"
                                              className="btn btn-primary btn-sm"
                                            >
                                              Search
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      {/* <div className="col-sm-2 d-sm-flex justify-content-center align-items-end offset-4 offset-sm-0">
                                      <div className="pb-1">
                                        <button
                                          type="submit"
                                          className="btn btn-primary btn-sm"
                                         
                                        >
                                          Search
                                        </button>
                                      </div> */}
                                    </div>
                                  </div>
                                </Form>
                              </DropdownButton>
                            </div>
                            <div className="search-product">
                              <InputGroup>
                                <FormControl
                                  className="fs-12"
                                  placeholder="Search Product Here"
                                  aria-label="Search Product Here"
                                  aria-describedby="search-product"
                                  onChange={(e) =>
                                    this.setState({
                                      ...this.state,
                                      search: e.target.value,
                                    })
                                  }
                                />
                                <Button
                                  variant="primary fs-12 fs-w600"
                                  id="search-product-button"
                                  onClick={() => this.advanceSearch()}
                                >
                                  Search
                                </Button>
                              </InputGroup>
                            </div>
                            {/* <SearchProduct /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Khata Section */}
          <div
            id="khata"
            className={`tab-pane fade ${
              activeToggle === "Khata" ? "active show" : ""
            }`}
          >
            {currentTab == "Creditors" ? (
              <Stocks setData={header_messages[3]} setStock={openingStock} />
            ) : (
              ""
            )}
            {currentTab == "Debtors" ? (
              <Stocks setData={header_messages[4]} setStock={openingStock} />
            ) : (
              ""
            )}
            {currentTab == "Client khata" ? (
              <Stocks setData={header_messages[5]} setStock={openingStock} />
            ) : (
              ""
            )}
            <div className="container-fluid pt-3">
              <div className="make-scrolls flex-container align-items-stretch">
                {khataStatus.map((value, index) => (
                  <div className={index === 1 ? "mx-3" : ""} key={index}>
                    <NavLink
                      to={value.buttonLink}
                      className={`nav-link px-0 ${
                        currentTab === value.title ? "active-nav" : ""
                      }`}
                      activeClassName="active-nav"
                      {...(this.state.currentTab === value.title
                        ? `aria-current="page"`
                        : "")}
                      exact
                      onClick={() => {
                        // this.props.dispatch(setCurrentTab(value.title))
                        this.props.dispatch(fetchKhata(value.title));
                        this.props.dispatch(resetKhataSearch());
                        this.setState({
                          currentTab: value.title,
                        });
                      }}
                    >
                      <div
                        className={
                          value.title === "Debtors"
                            ? `card px-sm-3 px-2 py-2 mx-sm-3`
                            : `card px-sm-3 px-2 py-2`
                        }
                      >
                        <div className="card-heading">
                          <p className="fs-12 fs-w600">{value.heading}</p>
                        </div>
                        {isLoading ? (
                          <div className="text-center py-3">
                            <SyncLoader
                              size={8}
                              color={
                                currentTab === "Creditors" ||
                                currentTab === "Debtors" ||
                                currentTab === "Client khata"
                                  ? "#fff"
                                  : "#143B64"
                              }
                            />
                          </div>
                        ) : (
                          <div className="card-body-text">
                            <h1 className="fs-40">{value.subHeading || 0}</h1>
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
            <div className="container-fluid mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="card py-2 pe-3">
                    <div className="row ms-1 align-items-center">
                      {currentTab === "Client khata" && (
                        <div className="col-7">
                          <p className="fs-6 fs-w500 text-muted">
                            You will pay ₹ {}
                            <span className="text-danger fs-w600">
                              {this.props?.khata?.balanceToBePaid ||
                                khataStatus[0].subHeading}
                              /-
                            </span>{" "}
                            {this.props?.khata?.searchedClient
                              ? "to " + this.props?.khata?.searchedClient
                              : ""}
                          </p>
                        </div>
                      )}
                      <div className="col-lg-4 col-sm-12 ms-lg-auto">
                        <div className="search-product">
                          <InputGroup>
                            <FormControl
                              className="fs-12"
                              placeholder={
                                currentTab === "Client khata"
                                  ? SEARCH_KHATA_INDVIDUAL
                                  : currentTab === "Debtors"
                                  ? SEARCH_KHATA_DEBTORS
                                  : SEARCH_KHATA_CREDITORS
                              }
                              aria-label="Search Product Here"
                              aria-describedby="search-product"
                              onChange={(e) =>
                                this.setState({
                                  ...this.state,
                                  search: e.target.value,
                                })
                              }
                            />
                            <Button
                              variant="primary fs-12 fs-w600"
                              id="search-product-button"
                              onClick={() =>
                                this.SearchProductsForKhata(currentTab)
                              }
                            >
                              Search
                            </Button>
                          </InputGroup>
                        </div>
                        {/* <SearchProduct /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Module */}
          <div
            id="dashboard"
            className={`tab-pane fade ${
              activeToggle === "profile" ? "active show" : ""
            }`}
          >
            <div className="container-fluid mt-3">
              <div className="row">
                <div className="col-6">
                  <h3 className="text-primary fs-w600 fs-20 ps-1">
                    My Profile
                  </h3>
                  <small className="text-muted ps-1">
                    Manage your profile and subscriptions with Bahikhata.
                  </small>
                </div>
                <div className="col-6">
                  <div className="right-div float-end">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.onLogout()}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const inventory = state.inventory;
  const khata = state.khata;
  return {
    inventory,
    khata,
  };
};
export default connect(mapStateToProps)(Header);
