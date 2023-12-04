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
  getSearchPurchaseUser,
  getProductlist,
  getSearchSoldUser,
  getIndivisualKhata,
} from "../../services/api.service";

import history from "../../history";
import toastr from "toastr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "react-router-dom/cjs/react-router-dom.min";
import {
  fetchInventory,
  resetSearch,
  resetTableHeading,
  setCurrentTabOnDashboard,
  setdashboardSearch,
  setSearch,
  setShow,
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
  resetSearchedClient,
} from "../../store/slices/khataSlice";
import {
  setActiveToggle,
  setCurentTab,
  setDashboardStatus,
  setDukandarDetails,
  setHideValue,
  setKhataStatus,
  setLoading,
  setLogout,
  setOpeningStock,
  setTab,
  setToggle,
  setType,
} from "../../store/slices/headerSlice";
// import { fetchKhata } from "../../store/slices/khataSlice";
import { logout } from "../../reducers/user/user.actions";

let flag = false;
class HeaderNew extends React.Component {
  constructor(props) {
    super(props);
    // props.dispatch(fetchInventory());
    this.state = {
      activeToggle: "dashboard",
      data: header_messages,
      // from: "",
      // to: "",
      from: this.props.inventory.from
        ? this.props.inventory.from
        : moment().format("YYYY-MM-DD"),
      to: this.props.inventory.to
        ? this.props.inventory.from
        : moment().format("YYYY-MM-DD"),
      isLoadingdashboard: true,
      isLoadingKhata: true,

      openingStock: this.props.header.openingStock,
      // openingStock: this.props.openingStock,
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
      showSearchPopup: false,
      PopupsearchData: [],
      type: "",
      date: new Date().toISOString().slice(0, 10),
      productSearchLoading: false,
      datefilterLoading: false,
      advancesearchLoader: false,
      khatasearchLoader: false,
    };
  }

  onLogout = () => {
    clearStorage();
    // history.push("/bahikhata/dev/app/login");

    this.props.dispatch(setLogout());
    this.props.dispatch(logout());
    // this.setState({
    //   isLoggedOut: true,
    // });
  };
  hendleMainTab = (tab) => {
    window.localStorage.setItem("mainTab", tab);
    window.dispatchEvent(new Event("storage"));

    if (tab == "Khata") {
      this.getKhataStatus();
    } else if (tab == "dashboard") {
      flag = true;
      if (!this.props.header.dashboardStatus) {
        this.getDashboardStatus();
      }
    }
    this.props.dispatch(
      setTab({
        activeToggle: tab,
        currentTab: tab == "Khata" ? "Creditors" : "Dashboards",
        hideValue: tab == "Khata" ? "Creditors" : "Dashboards",
      })
    );
    // this.setState(
    //   {
    //     activeToggle: tab,
    //   },
    const settingTab = () => {
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
        // this.setState({
        //   activeToggle: tab,
        //   currentTab: tab == "Khata" ? "Creditors" : "Dashboards",
        //   hideValue: tab == "Khata" ? "Creditors" : "Dashboards",
        // });
      }
    };
    settingTab();
    // );

    return true;
  };
  //fully paid and partially paid

  getFullAndPartialData = async (type) => {
    let page = this.state.postData.page;
    let limit = this.state.postData.limit;
    // this.setState({
    //   productSearchLoading: true,
    // });
    // from: moment().format("YYYY-MM-DD"),
    // to: moment().format("YYYY-MM-DD")
    // if (!type) {
    //   this.setState({
    //     datefilterLoading: true,
    //   });
    // }
    let body = {
      from: this.state.from || moment().format("YYYY-MM-DD"),
      to: this.state.to || moment().format("YYYY-MM-DD"),
      search: "",
      is_sold: true,
      sold_type: type,
    };

    const searchData = await getProductlist({ page: page, limit: limit, body });
    // .then(async (res) => await res.data?.data?.products)
    // .catch((err) => toast.error("No data found."));

    if (searchData) {
      this.props.dispatch(setSearch({ searchData, body }));
      this.props.dispatch(setCurrentTabOnDashboard("Sales"));
    }
  };
  // dashboard status
  getDashboardStatus = () => {
    getDashboardStatusService()
      .then((res) => {
        this.props.dispatch(setDashboardStatus(res.data?.data));

        this.setState({
          isLoadingdashboard: false,
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
        this.props.dispatch(setKhataStatus(khataData));
        console.log(this.props.khata);
        console.log(this.props.khata?.balanceToBePaid);
        if (!this.props.khata?.balanceToBePaid) {
          this.props.dispatch(resetSearchedClient());
        }
        this.setState({
          isLoadingKhata: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  getDukandarDetail = async (id) => {
    return await getDukandarDetailService(id)
      .then((res) => {
        this.props.dispatch(setDukandarDetails(res.data.data));

        // this.setState({
        //   dukandarData: res.data.data,
        // });
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
        this.props.dispatch(setOpeningStock(res.data.data));
        // this.setState({
        //   openingStock: res.data.data.stock,
        // });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  handleAdvanceSercSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      advancesearchLoader: true,
    });

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
          ? isNaN(parseInt(event.target.elements.product_imei.value))
            ? 0
            : parseInt(event.target.elements.product_imei.value)
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
        // balance: this.state.soldBalance,
        // is_sold: true,
      };
      const checkEmpty = Object.values(body).some((element) => {
        if (element !== "") {
          return true;
        }
      });
      if (!checkEmpty) {
        return;
      }
      // window.localStorage.setItem("advanceSearch", JSON.stringify(body));
      // window.localStorage.setItem(
      //   "advanceSearch-section",
      //   this.state.currentTab
      // );
      let searchData = await getAdvanceProductStatusService({
        page: this.state.postData.page,
        limit: this.state.postData.limit,
        body,
      });
      // ticket 438
      // .then(async (res) => await res.data?.data?.products)
      // .catch((err) => toast.error("No data found."));
      if (window.location.pathname === "/bahikhata/dev/app/sales") {
        this.props.dispatch(setSearch({ searchData, body }));
        this.props.dispatch(setCurrentTabOnDashboard("Sales"));
        this.setState({
          advancesearchLoader: false,
        });
        // this.props.dispatch(setdashboardSearch())
      } else if (window.location.pathname === "/bahikhata/dev/app/purchase") {
        this.props.dispatch(setSearch({ searchData, body }));
        this.props.dispatch(setCurrentTabOnDashboard("Purchase"));
        this.setState({
          advancesearchLoader: false,
        });
        // this.props.dispatch(setdashboardSearch())
      } else if (window.location.pathname === "/bahikhata/dev/app/") {
        const products = searchData.data.data.products.filter(
          (item) => !item.sold?.email
        );

        this.props.dispatch(
          setSearch({
            // searchData,
            searchData: {
              ...searchData,
              data: {
                ...searchData.data,
                data: {
                  ...searchData.data.data,
                  products,
                  total: products.length,
                },
              },
            },
            body,
          })
        );

        //old code
        // this.props.dispatch(setSearch({ searchData, body }));
        this.setState({
          advancesearchLoader: false,
        });
      } else {
        this.props.dispatch(setSearch({ searchData, body }));
        this.setState({
          advancesearchLoader: false,
        });
      }
      // window.dispatchEvent(new Event("storage"));
    } else {
      this.setState({
        advancesearchLoader: false,
      });
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
      this.getDashboardStatus();
    }
  };
  advanceSearch = async (search) => {
    this.props.dispatch(setShow(false));
    if (search) {
      this.setState({
        productSearchLoading: true,
      });
    }
    if (!search) {
      this.setState({
        datefilterLoading: true,
      });
    }

    if (
      this.state.search == "" &&
      this.state.from === "" &&
      this.state.from === ""
    ) {
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
      return;
    }
    if (search && this.state.search == "") {
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
      return;
    }
    let body = {
      product: this.state.search !== "" ? this.state.search : "",
      imei: "",
      model: "",
      first_name: "",
      last_name: "",
      color: "",
      mobile: "",
      balance: this.state.soldBalance,
      search_btn: search,
    };
    if (!search) {
      body.from = this.state.from;
      body.to = this.state.to;
    }
    if (window.location.pathname == "/bahikhata/dev/app/sales") {
      body.is_solds = true;
    }
    // window.location.pathname == "/bahikhata/dev/app/sales" ? true : false

    let searchData = await getAdvanceProductStatusService({
      page: this.state.postData.page,
      limit: this.state.postData.limit,
      body,
    });

    //   .then(async (res) =>{

    //     await res.data?.data?.products}

    // )

    // .catch((err) => toast.error("No data found."));

    if (window.location.pathname === "/bahikhata/dev/app/sales") {
      this.props.dispatch(setSearch({ searchData, body }));
      this.props.dispatch(setCurrentTabOnDashboard("Sales"));
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
      // this.props.dispatch(setdashboardSearch())
    } else if (window.location.pathname === "/bahikhata/dev/app/purchase") {
      this.props.dispatch(setSearch({ searchData, body }));
      this.props.dispatch(setCurrentTabOnDashboard("Purchase"));
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
      // this.props.dispatch(setdashboardSearch())
    } else if (window.location.pathname === "/bahikhata/dev/app/") {
      const products = searchData.data.data.products.filter(
        (item) => !item.sold?.email
      );

      this.props.dispatch(
        setSearch({
          // searchData,
          searchData: {
            ...searchData,
            data: {
              ...searchData.data,
              data: {
                ...searchData.data.data,
                products,
                total: products.length,
              },
            },
          },
          body,
        })
      );
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
    } else {
      this.props.dispatch(setSearch({ searchData, body }));
      this.setState({
        productSearchLoading: false,
        datefilterLoading: false,
      });
    }
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
      const khataTabs =
        currentTab === "Debtors"
          ? // || currentTab === "Client khata"
            "debtors"
          : "creditors";
      this.props.dispatch(fetchKhata(khataTabs));
      this.props.dispatch(resetKhataSearch());
      this.setState({
        khatasearchLoader: false,
      });
      return;
    }
    if (
      currentTab === "Client khata" ||
      window.location.pathname === "/bahikhata/dev/app/clientkhata"
    ) {
      let body = {
        search: this.state.search,
        page: this.props.header.postData.page,
        limit: this.props.header.postData.limit,
        type: "credit",
        tab: currentTab,
      };
      const searchKhataData = await getIndivisualKhata(body);
      this.props.dispatch(
        setKhataSearch({
          data: searchKhataData.data.data.khata,
          currentTab,
          search: this.state.search,
        }),
        this.setState({
          isLoading: false,
          khatasearchLoader: false,
        })
      );
    } else {
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
      this.setState({
        khatasearchLoader: false,
      });
    }
  };

  componentDidMount() {
    console.log("sdf");
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
        isLoadingdashboard: false,
      });
    }, 1000);

    this.setState({
      data: header_messages[0],
      // hideValue:"Sales"
    });
    // get dashboard status
    if (window.localStorage.getItem("mainTab") == "Khata") {
      this.getKhataStatus();

      const curTab =
        window.location.pathname === "/bahikhata/dev/app/clientkhata"
          ? "Client khata"
          : window.location.pathname === "/bahikhata/dev/app/debtors"
          ? "Debtors"
          : "Creditors";

      this.props.dispatch(
        setCurentTab({
          currentTab: curTab,
        })
      );
      // this.setState({
      //   currentTab:
      //     window.location.pathname === "/bahikhata/dev/app/clientkhata"
      //       ? "Client khata"
      //       : window.location.pathname === "/bahikhata/dev/app/debtors"
      //       ? "Debtors"
      //       : "Creditors",
      // });
      this.hendleMainTab("Khata");
    } else if (window.localStorage.getItem("mainTab") == "profile") {
      this.hendleMainTab("profile");
    } else {
      this.hendleMainTab("dashboard");
      this.setState({
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });
      if (this.props.header.dashboardStatus === button_headings) {
        this.getDashboardStatus();
      }
      if (!this.state.openingStock) {
        this.getOpeningStock();
      } else {
        const date = new Date();
        const todayDate = `${date.getFullYear()}-${
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }-${date.getDate()}`;
        if (this.state.openingStock.date !== todayDate) {
          this.getOpeningStock();
        }
      }
      const curTab =
        window.location.pathname === "/bahikhata/dev/app/puchase"
          ? "Purchase"
          : window.location.pathname === "/bahikhata/dev/app/sales"
          ? "Sales"
          : "Dashboard";
      this.props.dispatch(
        setCurentTab({
          currentTab: curTab,
        })
      );
      // this.setState({
      //   currentTab:
      //     window.location.pathname === "/bahikhata/dev/app/puchase"
      //       ? "Purchase"
      //       : window.location.pathname === "/bahikhata/dev/app/sales"
      //       ? "Sales"
      //       : "Dashboard",
      // });
    }
  }

  render() {
    // window.addEventListener("storage", () => {
    //   if (window.localStorage.getItem("advanceSearch-section")) {
    //     let body = window.localStorage.getItem("advanceSearch-section");
    //     const isNullish = Object.values(body).every((value) => {
    //       if (value === null || value.length < 1) {
    //         return true;
    //       }

    //       return false;
    //     });
    //     if (isNullish) {
    //       window.localStorage.removeItem("advanceSearch");
    //       window.localStorage.removeItem("advanceSearch-section");
    //     }
    //   }
    //   if (window.localStorage.getItem("advanceSearch-section")) {
    //     this.updateallfunction(
    //       window.localStorage.getItem("advanceSearch-section")
    //     );
    //   } else if (window.localStorage.getItem("section-update")) {
    //     this.updateallfunction(window.localStorage.getItem("section-update"));
    //   }
    // });

    // const datefix = (e) => {
    //   dateset = e.target.value;
    // };
    const {
      search_btn,
      activeToggle,
      isLoggedOut,
      khataStatus,
      data,
      dashboardStatus,
      dukandarData,
      openingStock,
      hideValue,
      currentTab,
      isLoadingdashboard,
      isLoadingKhata,
    } = this.props.header;
    // this.setDate();
    return (
      <>
        {/* {isLoggedOut && <Redirect to="/login" />} */}

        <div className="container-fluid ps-0">
          {/* <ToastContainer /> */}

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
                    : window.localStorage.getItem("mainTab") == "dashboard"
                    ? "Dashboard"
                    : "Profile"}
                </h1>
              </div>
              <div className="user-info ms-auto d-flex align-items-center d-sm-none d-block">
                <div className="user-name-deg text-end">
                  <h6 className="user-info-text text-primary fs-w600">
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
                  <h6 className="user-info-text text-primary fs-w600">
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
          <Nav as="ul" className="ps-3  ">
            <Nav.Item
              as="li"
              onClick={() => {
                this.hendleMainTab("dashboard");
                this.props.dispatch(resetSearch());
                this.props.dispatch(setType("all"));
                this.setState({
                  from: moment().format("YYYY-MM-DD"),
                  to: moment().format("YYYY-MM-DD"),
                });
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
                <div>
                  <i>
                    <FontAwesomeIcon icon="columns" className="me-1" />
                  </i>{" "}
                  {"Dashboard"}
                </div>
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
                <div>
                  <i>
                    <FontAwesomeIcon icon="book-open" className="me-1" />
                  </i>{" "}
                  {"Khata"}
                </div>
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
            {window.location.pathname === "/bahikhata/dev/app/" ? (
              <Stocks setData={header_messages[0]} setStock={openingStock} />
            ) : (
              ""
            )}
            {window.location.pathname === "/bahikhata/dev/app/purchase" ? (
              <Stocks setData={header_messages[1]} setStock={openingStock} />
            ) : (
              ""
            )}
            {window.location.pathname === "/bahikhata/dev/app/sales" ? (
              <Stocks setData={header_messages[2]} setStock={openingStock} />
            ) : (
              ""
            )}
            <div className="container-fluid pt-3">
              <div className="make-scroll">
                {dashboardStatus.map((value, index) => (
                  <div className={index === 1 ? "mx-1" : ""} key={index}>
                    <NavLink
                      to={value.buttonLink}
                      className={`nav-link px-0 ${
                        currentTab === value.title ? "active-nav" : " "
                      }`}
                      {...(currentTab === value.title
                        ? `aria-current="page"`
                        : "")}
                      activeClassName="active-nav"
                      exact
                      onClick={() => {
                        this.getDashboardStatus();
                        // this.setState({
                        //   currentTab: value.title,
                        //   hideValue: value.title,
                        // });
                        // this.props.dispatch(
                        //   setToggle({
                        //     currentTab: value.title,
                        //     hideValue: value.title,
                        //   })
                        // );
                        if (
                          window.location.pathname === "/bahikhata/dev/app/"
                        ) {
                          this.props.dispatch(resetTableHeading());
                        }
                        // this.props.dispatch(setCurentTab(value.title));
                        // this.props.dispatch(setHideValue(value.title));
                        this.props.dispatch(resetSearch());
                      }}
                    >
                      <div className="card p-2-5 tab-border-color shadow-sm">
                        <div className="row">
                          <div className="col-6 have-border">
                            <p className="fs-12 fs-w600">
                              {value.headingTextLeft}
                            </p>
                            {this.state.isLoadingdashboard ? (
                              <div className="text-center py-3">
                                <SyncLoader
                                  size={10}
                                  color={
                                    (currentTab === "Dashboard" &&
                                      value.title === "Dashboards") ||
                                    (currentTab === "Purchase" &&
                                      currentTab === value.title) ||
                                    (currentTab === "Sales" &&
                                      currentTab === value.title)
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
                            {this.state.isLoadingdashboard ? (
                              <div className="text-center py-3">
                                <SyncLoader
                                  size={10}
                                  color={
                                    (currentTab === "Dashboard" &&
                                      value.title === "Dashboards") ||
                                    (currentTab === "Purchase" &&
                                      currentTab === value.title) ||
                                    (currentTab === "Sales" &&
                                      currentTab === value.title)
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
                  <div className="col-12 ">
                    <div className="card pe-3 pt-2 justify-items-center">
                      <div className="row ms-1">
                        <div className="col-lg-8 mb-2 mb-md-0 d-flex  align-items-sm-center">
                          {(window.location.pathname ===
                            "/bahikhata/dev/app/purchase" ||
                            window.location.pathname ===
                              "/bahikhata/dev/app/sales") && (
                            // {(hideValue === "Purchase" ||
                            //   hideValue === "Sales") && (
                            <>
                              <div className="row w-100">
                                <div className="col-md-3 me-4 d-flex align-items-center mb-2 pb-lg-2 mb-md-0">
                                  <div className="row justify-content-between">
                                    <div className="col-6 d-flex align-items-center">
                                      <div className="label fs-6 fs-w600 text-primary me-md-3 ps-1">
                                        From&nbsp;Date
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className=" me-3">
                                        <input
                                          onChange={(e) => {
                                            this.setState({
                                              ...this.state,
                                              from: moment(
                                                e.target.value
                                              ).format("YYYY-MM-DD"),
                                            });
                                            // this.props.dispatch(
                                            //   setFrom(
                                            //     moment(e.target.value).format(
                                            //       "YYYY-MM-DD"
                                            //     )
                                            //   )
                                            // );
                                          }}
                                          type="date"
                                          value={this.state.from}
                                          style={{
                                            minWidth: "7.6rem",
                                          }}
                                          placeholder="dd-mm-yyyy"
                                          // defaultValue={this.state.from}
                                          // value="2018-07-22"
                                          className="form-control fs-12 fs-w400 session-date date_input"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-3 me-4 d-flex align-items-center pb-lg-2 ms-sm-2">
                                  <div className="row justify-content-between">
                                    <div className="col-6 d-flex align-items-center">
                                      <div className="label fs-6 fs-w600 text-primary me-md-3 ps-lg-4 ps-2">
                                        To&nbsp;Date
                                      </div>
                                    </div>
                                    <div className="col-6 ps-3">
                                      <div className=" me-2">
                                        {/* w-specific-150 */}
                                        
                                        <input
                                          type="date"
                                          min={this.state.from}
                                          onChange={(e) => {
                                            this.setState({
                                              ...this.state,
                                              to: moment(e.target.value).format(
                                                "YYYY-MM-DD"
                                              ),
                                            });
                                            // this.props.dispatch(
                                            //   setTo(
                                            //     moment(e.target.value).format(
                                            //       "YYYY-MM-DD"
                                            //     )
                                            //   )
                                            // );
                                          }}
                                          style={{
                                            minWidth: "7.6rem",
                                          }}
                                          placeholder="dd-mm-yyyy"
                                          className="form-control fs-12 fs-w400 session-date date_input"
                                          value={this.state.to}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 d-flex align-items-center two_btn">
                                  <div className="pb-lg-2">
                                    <button
                                      className="btn btn-primary  mt-md-0 mt-3 btn-sm fs-12 fs-w600 date-filter "
                                      onClick={() => this.advanceSearch()}
                                    >
                                      {this.state.datefilterLoading ? (
                                        <SyncLoader size={4} color={"#fff"} />
                                      ) : (
                                        "Search"
                                      )}
                                    </button>
                                  </div>
                                  {window.location.pathname ===
                                    "/bahikhata/dev/app/sales" && (
                                    <div className="ms-2 mt-md-0 mt-3 all_filter pb-2">
                                      <DropdownButton
                                        id="dropdown-item-button"
                                        title={
                                          this.props.header?.type === "full"
                                            ? "Fully paid"
                                            : this.props.header?.type === "half"
                                            ? "Partially Paid"
                                            : "All"
                                        }
                                        variant="primary btn-sm fs-12"
                                      >
                                        {console.log(this.props.header?.type)}
                                        {this.state.type && (
                                          <Dropdown.Item
                                            // as="button"
                                            className="fs-12"
                                            onClick={() => {
                                              this.props.dispatch(
                                                setType("all")
                                              );
                                              this.setState({
                                                ...this.state,
                                                type: "all",
                                              });
                                              this.getFullAndPartialData("all");
                                            }}
                                          >
                                            All
                                          </Dropdown.Item>
                                        )}
                                        <Dropdown.Item
                                          // as="button"
                                          className="fs-12"
                                          onClick={() => {
                                            this.props.dispatch(
                                              setType("full")
                                            );
                                            this.setState({
                                              ...this.state,
                                              type: "full",
                                            });
                                            this.getFullAndPartialData("full");
                                          }}
                                        >
                                          Fully paid
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          // as="button"
                                          className="fs-12"
                                          onClick={() => {
                                            this.props.dispatch(
                                              setType("half")
                                            );
                                            this.setState({
                                              ...this.state,
                                              type: "half",
                                            });
                                            this.getFullAndPartialData("half");
                                          }}
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
                        <div className="col-lg-4 mb-2">
                          <div className="d-sm-flex align-items-center">
                            <div className="filter-menu ms-auto me-3 mb-4 mb-sm-0">
                              <DropdownButton
                                id={`dropdown-button-drop-down`}
                                key={"down"}
                                drop="down"
                                variant="outline-primary border-0 fs-12 fs-w600 ps-1"
                                title={` Advance Search `}
                              >
                                <Form
                                  className="row pt-sm-0"
                                  // method="POST"
                                  onSubmit={(e) => {
                                    this.handleAdvanceSercSubmit(e);
                                  }}
                                >
                                  <div className="row mx-auto p-sm-2 p-3 pb-0">
                                    <div className="col-sm-12">
                                      <div
                                        className="row adv_search_row"
                                        style={{
                                          width: "38rem",
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
                                            className="form-control search-input ms-sm-0 ms-2"
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
                                            className="form-control search-input ms-sm-0 ms-2"
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
                                            className="form-control search-input ms-sm-0 ms-2"
                                            name="product_number"
                                          />
                                        </div>
                                        <div className="col-sm-2 col-6 d-sm-flex justify-content-center align-items-end ">
                                          <div className="pb-2 adv_search_btn_div">
                                            <button
                                              type="submit"
                                              // onClick={(e) => this.handleAdvanceSercSubmit(e)}
                                              className="btn btn-primary btn-sm"
                                            >
                                              {this.state
                                                .advancesearchLoader ? (
                                                <SyncLoader
                                                  size={4}
                                                  color={"#fff"}
                                                />
                                              ) : (
                                                "Search"
                                              )}
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
                                <div className="position-relative">
                                  <FormControl
                                    className="fs-12"
                                    style={{
                                      width: "10.69rem",
                                      paddingRight: "1.85rem",
                                      height: "35px",
                                    }}
                                    placeholder="Search Product Here"
                                    aria-label="Search Product Here"
                                    aria-describedby="search-product"
                                    value={this.state.search}
                                    onChange={(e) =>
                                      this.setState({
                                        ...this.state,
                                        search: e.target.value,
                                      })
                                    }
                                  />
                                  {this.state.search && (
                                    <i
                                      onClick={() => {
                                        this.props.dispatch(setType("all"));
                                        // this.getDashboardStatus();
                                        this.setState({
                                          from: moment().format("YYYY-MM-DD"),
                                          to: moment().format("YYYY-MM-DD"),
                                        });
                                        this.props.dispatch(
                                          fetchInventory({
                                            postData:
                                              this.props.inventory.postData,
                                            tab: "dashboard",
                                          })
                                        );

                                        this.props.dispatch(resetSearch());

                                        this.setState({
                                          ...this.state,
                                          search: "",
                                        });
                                      }}
                                      className="fa-solid cursor-pointer fa-circle-xmark search-reset-icon mb-lg-1"
                                    ></i>
                                  )}
                                </div>
                                <Button
                                  variant="primary fs-12 fs-w600"
                                  id="search-product-button"
                                  onClick={() => {
                                    this.advanceSearch(true);
                                  }}
                                >
                                  {this.state.productSearchLoading ? (
                                    <SyncLoader size={5} color={"#fff"} />
                                  ) : (
                                    "Search"
                                  )}
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
                  <div className={index === 1 ? "mx-1" : ""} key={index}>
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
                        this.props.dispatch(
                          setCurentTab({ currentTab: value.title })
                        );
                        // this.props.dispatch(fetchKhata(value.title));
                        this.props.dispatch(resetKhataSearch());
                        // this.setState({
                        //   currentTab: value.title,
                        // });
                      }}
                    >
                      <div
                        className={
                          value.title === "Debtors"
                            ? `card px-sm-2 px-2 py-2 mx-sm-2 card-khata`
                            : `card px-sm-3 px-2 py-2 card-khata`
                        }
                      >
                        <div className="card-heading">
                          <p className="fs-12 fs-w600">{value.heading}</p>
                        </div>
                        {this.state.isLoadingKhata ? (
                          <div className="text-center py-3">
                            <SyncLoader
                              size={8}
                              color={
                                // currentTab === "Creditors" ||
                                // currentTab === "Debtors" ||
                                // currentTab === "Client khata"
                                currentTab === value.title ? "#fff" : "#143B64"
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
                  <div className="card py-2 px-3">
                    <div className="row align-items-center">
                      {(currentTab === "Client khata" ||
                        this.props.khata.searchedClient) && (
                        <div className="col-8">
                          <p className="fs-6 fs-w500 text-muted ms-2 me-0">
                            {this.props?.khata?.balanceToBePaid &&
                            Math.sign(this.props?.khata?.balanceToBePaid) !== -1
                              ? "You will pay ₹ "
                              : "You will get ₹ "}
                            <span
                              className={`${
                                this.props?.khata?.balanceToBePaid &&
                                Math.sign(
                                  this.props?.khata?.balanceToBePaid
                                ) !== -1
                                  ? "text-danger"
                                  : "text-success"
                              }  fs-w600`}
                            >
                              {window.location.search === "" &&
                              !this.props?.khata?.balanceToBePaid
                                ? khataStatus[0].subHeading
                                : Math.abs(
                                    this.props?.khata?.balanceToBePaid
                                  ) || 0}
                              /-
                            </span>{" "}
                            {this.props?.khata?.searchedClient
                              ? (this.props?.khata?.balanceToBePaid &&
                                Math.sign(
                                  this.props?.khata?.balanceToBePaid
                                ) !== -1
                                  ? "to "
                                  : "from ") + this.props?.khata?.searchedClient
                              : ""}
                          </p>
                        </div>
                      )}
                      <div className="col-lg-4 col-xs-12 ms-lg-auto mx-0">
                        <div className="search-product px-0 ps-1 d-flex justify-content-end w-100 ">
                          <InputGroup className=" justify-content-sm-end">
                            <div className="d-flex ">
                              <FormControl
                                className="fs-12 ps-1 pe-0"
                                style={{
                                  width: "15.3rem",
                                  paddingRight: "2rem",
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  height: "33px",
                                }}
                                placeholder={
                                  currentTab === "Client khata" ||
                                  window.location.search
                                    ? SEARCH_KHATA_INDVIDUAL
                                    : currentTab === "Debtors"
                                    ? SEARCH_KHATA_DEBTORS
                                    : SEARCH_KHATA_CREDITORS
                                }
                                onBlur={() => {
                                  this.setState({ showSearchPopup: false });
                                }}
                                aria-label="Search Product Here"
                                aria-describedby="search-product"
                                value={this.state.search}
                                onChange={async (e) => {
                                  // console.log(e.target.value);
                                  if (currentTab === "Debtors") {
                                    this.setState({
                                      ...this.state,
                                      search: e.target.value,
                                      showSearchPopup: true,
                                    });

                                    const response = await getSearchSoldUser(
                                      e.target.value
                                    );
                                    this.setState({
                                      ...this.state,
                                      PopupsearchData: response.data.data,
                                    });
                                  } else if (currentTab === "Client khata") {
                                    this.setState({
                                      ...this.state,
                                      search: e.target.value,
                                      showSearchPopup: true,
                                    });
                                    const response =
                                      await getSearchPurchaseUser(
                                        e.target.value
                                      );
                                    const response2 = await getSearchSoldUser(
                                      e.target.value
                                    );
                                    this.setState({
                                      ...this.state,
                                      PopupsearchData: [
                                        ...response.data.data,
                                        ...response2.data.data,
                                      ],
                                    });
                                  } else {
                                    this.setState({
                                      ...this.state,
                                      search: e.target.value,
                                      showSearchPopup: true,
                                    });
                                    const response =
                                      await getSearchPurchaseUser(
                                        e.target.value
                                      );
                                    this.setState({
                                      ...this.state,
                                      PopupsearchData: response.data.data,
                                    });
                                  }
                                }}
                              />
                              {this.state.showSearchPopup && (
                                <div
                                  className="search-popup py-1  me-5 "
                                  style={{ top: "2rem", width: "15.2rem" }}
                                >
                                  {this.state.PopupsearchData.length > 0 ? (
                                    this.state.PopupsearchData.map(
                                      (item, i) => (
                                        <div
                                          key={i}
                                          className="search-popup-data d-flex fs-12 fw-400 cursor-pointer"
                                          onClick={() => {
                                            console.log("ufg");
                                            this.setState({
                                              search: item.phone,
                                            });
                                            if (parseInt(this.state.search)) {
                                              this.setState({
                                                ...this.state,
                                                search: item.phone,
                                              });
                                            } else {
                                              this.setState({
                                                ...this.state,
                                                search: item.from,
                                              });
                                            }
                                            setTimeout(() => {
                                              console.log("hey");
                                              this.setState({
                                                ...this.state,
                                                showSearchPopup: false,
                                              });
                                            }, 200);
                                          }}
                                        >
                                          {/* {console.log(item)} */}
                                          {!parseInt(this.state.search)
                                            ? `${item.from} (${item.phone})`
                                            : `${item.phone}`}
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div
                                      className="search-popup-data fs-12 fw-400 "
                                      onClick={() => {
                                        this.setState({
                                          ...this.state,
                                          showSearchPopup: false,
                                        });
                                      }}
                                    >
                                      No data found
                                    </div>
                                  )}
                                </div>
                              )}
                              <Button
                                variant="primary fs-12 fs-w600"
                                id="search-product-buttonn"
                                onClick={() => {
                                  this.setState({
                                    khatasearchLoader: true,
                                  }),
                                    this.SearchProductsForKhata(currentTab);
                                }}
                                style={{
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,
                                }}
                              >
                                {this.state.khatasearchLoader ? (
                                  <SyncLoader size={6} color={"#fff"} />
                                ) : (
                                  "Search"
                                )}
                              </Button>
                            </div>
                            {this.state.search && (
                              <i
                                onClick={() => {
                                  this.setState({
                                    khatasearchLoader: false,
                                  });
                                  setTimeout(() => {
                                    this.SearchProductsForKhata(currentTab);
                                  }, 500);
                                  this.setState({
                                    ...this.state,
                                    search: "",
                                    showSearchPopup: false,
                                  });
                                }}
                                className="fa-solid cursor-pointer fa-circle-xmark reset-icon "
                              ></i>
                            )}
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
  const header = state.header;
  return {
    inventory,
    khata,
    header,
  };
};
export default connect(mapStateToProps)(HeaderNew);
