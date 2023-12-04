import moment from "moment";
import React from "react";
// import toastr from "toastr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import {
  Button,
  FormControl,
  InputGroup,
  Table,
  Modal,
  Offcanvas,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import {
  tableHeadings,
  tableHeadingsForSale,
} from "../constants/buttonHeadings";
// import { productData, produtINFO } from "../constants/SidePannelData";
import {
  deleteProductService,
  getDashboardProductStatusService,
  sellProductService,
  purchaseProductupdateService,
  deletesellProductService,
  getProductlist,
  getProductDetailById,
  getAdvanceProductStatusService,
  getKhataStatusService,
  sendReminder,
  getInventoryReport,
  getSearchPurchaseUser,
  getSalesReport,
} from "../services/api.service";
import {
  resetSearch,
  setSellDeleteSearch,
  setShow,
} from "../store/slices/dashboardSlice";
import DynamicPagination from "../utils/DynamicPagination";
import NoData from "../utils/NoData";
import { PurchaseForm } from "./PurchaseForm";
import Invoice from "./Dashboard/Invoice";
import { connect } from "react-redux";
import InvoicePopup from "./Dashboard/InvoicePopup";
import { NavLink } from "react-router-dom";
import {
  setActiveToggle,
  setCurentTab,
  setKhataStatus,
  setType,
} from "../store/slices/headerSlice";
import { getDashboardStatusService } from "../services/api.service";
import { setDashboardStatus } from "../store/slices/headerSlice";
import { fetchInventory } from "../store/slices/dashboardSlice";
import SearchPopup from "./Header/SearchPopup";
import { SyncLoader } from "react-spinners";
class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedTotal: "",
      isEditLoader: false,
      isLoading: true,
      is_cash: false,
      is_online: false,
      isSold_online: false,
      isSold_cash: false,
      isSold_gst: false,
      show: false,
      modalShow: false,
      modalSoldshow: false,
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      search: "",
      postData: {
        page: 1,
        limit: 20,
        total: 0,
      },
      tableHeading: "Total Inventory/Stock as of now",
      tableRows: [],
      products: [],
      productDetail: null,
      currentTab: this.props.page ? this.props.page : "Inventory",
      productId: {
        _id: 0,
        index: 0,
      },
      sellProductId: null,
      cash_amount: 0,
      online_amount: 0,
      pl: 0,
      sell_price_with_gst: 0,
      sell_price: 0,
      balance_amount: 0,
      pl_percent: 0,
      received_amount: 0,
      is_gst: false,
      gst_per: null,
      invoiceShow: false,
      rowEdit: false,
      rowId: null,
      purchaseId: null,
      isFormValid: false,
      rowEdit: false,
      rowId: null,
      invoiceModalShow: false,
      productEditData: {
        product: "",
        model: "",
        color: "",
        imei: "",
        ram: "",
        hdd: "",
        purchase_from: "",
        phone: "",
        purchase_amount: 0,
        purchase_at: moment().format("YYYY-MM-DD"),
        cash: 0,
        online: 0,
        comment: "",
        balance: 0,
        is_cash: false,
        is_online: false,
      },
      formErrors: {
        product: false,
        model: false,
        color: false,
        imei: false,
        ram: false,
        hdd: false,
        purchase_from: false,
        phone: false,
        purchase_amount: false,
        purchase_at: false,
        cash: false,
        online: false,
        comment: false,
        is_cash: false,
        is_online: false,
        width: 0,
        height: 0,
      },
      date: new Date().toISOString().slice(0, 10),
      sellEdit: "",
      showSearchPopup: false,
      PopupsearchData: [],
      client_name: null,
      client_mobile: null,
      isInvoiceLoading: false,
      download_Invoice: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  searchCall = async (e) => {
    this.setState({
      ...this.state,
      showSearchPopup: true,
    });
    this.handlePurchaseEditField(e);
    const response = await getSearchPurchaseUser(e.target.value);
    this.setState({
      ...this.state,
      PopupsearchData: [...response.data.data],
    });
    // setData(response.data.data);
  };
  setPurchaseFrom = (data) => {
    this.state.productEditData.purchase_from = data.from;
    this.state.productEditData.phone = data.phone;
  };

  setClientNameAndMobile = async (e) => {
    const response = await getSearchPurchaseUser(e.target.value);
    this.setState({
      ...this.state,
      PopupsearchData: response.data.data,
    });
  };
  handlePopupAfterSearchCall = () => {
    this.setState({
      ...this.state,
      showSearchPopup: false,
    });
  };

  handleInvoiceShow = (ProductId) => {
    if (ProductId) {
      getProductDetailById(ProductId).then((res) => {
        this.setState({
          productDetail: res.data.data,
          sellProductId: ProductId,
        });
      });
    }

    this.setState({
      invoiceShow: !this.state.invoiceShow,
    });
  };

  // get total inventory
  getAllInventory = () => {
    getDashboardProductStatusService(this.state.postData)
      .then((res) => {
        const { page, limit, total } = res.data.data;
        this.props.dispatch(setType("all"));
        this.setState({
          postData: {
            page: page,
            limit: limit,
            total: total,
          },
          products: res.data.data.products,
        });
        const rows = res.data.data.products.map((item) => {
          return [
            item.product,
            item.model,
            item.color,
            item.imei,
            item.hdd,
            item.ram,
            moment(item.purchase_at).format("DD/MM/YYYY"),
            item.purchase.from,
            item.purchase.phone,
            item.purchase.purchase_amount,
            item.purchase.payment.cash.amount !== "" &&
            item.purchase.payment.online.amount !== ""
              ? "Cash & Online"
              : item.purchase.payment.cash.amount !== ""
              ? "Cash"
              : "Online",
            parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
            item.purchase.balance,
            item.purchase.comment,
          ];
        });
        this.setState({
          tableRows: rows,
          isLoading: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  getProducts = (isSold) => {
    let body;
    if (this.state.currentTab === "Purchase") {
      body = {
        from: this.state.from,
        to: this.state.to,
        search: this.state.search,
        sold_type: "all",
      };
    } else {
      body = {
        from: this.state.from,
        to: this.state.to,
        search: this.state.search,
        is_sold: isSold,
        sold_type: "all",
      };
    }
    getProductlist({
      page: this.state.postData.page,
      limit: this.state.postData.limit,
      body: body,
    })
      .then((res) => {
        const { page, limit, total } = res.data.data;
        this.setState({
          postData: {
            page: page,
            limit: limit,
            total: total,
          },
          products: res.data.data.products,
        });
        const rows = res.data.data.products.map((item) => {
          return [
            item.product,
            item.model,
            item.color,
            item.imei,
            item.hdd,
            item.ram,
            moment(item.purchase_at).format("DD/MM/YYYY"),
            item.purchase.from,
            item.purchase.phone,
            item.purchase.purchase_amount,
            item.purchase.payment.cash.amount !== "" &&
            item.purchase.payment.online.amount !== ""
              ? "Cash & Online"
              : item.purchase.payment.cash.amount !== ""
              ? "Cash"
              : "Online",
            parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
            item.purchase.balance,
            item.purchase.comment,
          ];
        });
        this.setState({
          tableRows: rows,
          isLoading: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  SearchProduct = (state, value) => {
    this.setState(
      {
        state: value,
      },
      () => {
        this.getProducts();
      }
    );
  };
  downloadInventory = async () => {
    let body = {
      from: this.state.from,
      to: this.state.to,
      is_sold: true,
      search: "",
    };
    const result = await getInventoryReport(body)
      .then((res) => res.data.data.filePath)
      .then((result) => {
        if (result) {
          let a = document.createElement("a");
          a.target = "_blank";
          a.href = result;
          a.click();
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message, { timeOut: 5000 });
        }
      });
  };
  downloadSalesReport = async () => {
    let body = {
      from: this.state.from,
      to: this.state.to,
      is_sold: true,
      search: "",
    };
    const result = await getSalesReport(body)
      .then((res) => res.data.data.filePath)
      .then((result) => {
        if (result) {
          let a = document.createElement("a");
          a.target = "_blank";
          a.href = result;
          a.click();
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message, { timeOut: 5000 });
        }
      });
  };
  handlePagination = (page) => {
    const { postData } = this.state;
    postData.page = page;
    this.setState(
      {
        postData: postData,
      },
      this.getAllInventory("dashboard")
    );
  };

  getAdvanceProductStatus = () => {
    let body = JSON.parse(window.localStorage.getItem("advanceSearch"));

    getAdvanceProductStatusService({
      page: this.state.postData.page,
      limit: this.state.postData.limit,
      body: body,
    })
      .then((res) => {
        const { page, limit, total } = res.data.data;
        this.setState({
          postData: {
            page: page,
            limit: limit,
            total: total,
          },
          products: res.data.data.products,
        });
        const rows = res.data.data.products.map((item) => {
          return [
            item.product,
            item.model,
            item.color,
            item.imei,
            item.hdd,
            item.ram,
            moment(item.purchase_at).format("DD/MM/YYYY"),
            item.purchase.from,
            item.purchase.phone,
            item.purchase.purchase_amount,
            item.purchase.payment.cash.amount !== "" &&
            item.purchase.payment.online.amount !== ""
              ? "Cash & Online"
              : item.purchase.payment.cash.amount !== ""
              ? "Cash"
              : "Online",
            parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
            item.purchase.balance,
            item.purchase.comment,
          ];
        });

        this.setState({
          tableRows: rows,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  //handle delete
  handleDeleteProduct = () => {
    deleteProductService(this.state.productId._id)
      .then((res) => {
        this.getDashboardStatus();
        this.setState({
          products: this.state.products.filter(
            (item) => item._id !== this.state.productId._id
          ),
          tableRows: this.state.tableRows.filter(
            (item, index) => index !== this.state.productId.index
          ),
          modalShow: false,
          modalSoldshow: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  // handle sell delete
  handleDeleteProductsell = () => {
    deletesellProductService(this.state.productId._id)
      .then((res) => {
        this.getDashboardStatus();
        if (this.props?.inventory?.purchaseSearch) {
          this.props.dispatch(
            setSellDeleteSearch({
              productId: this.state.productId._id,
              list: this.props?.inventory?.products,
            })
          );
        }
        this.setState({
          products: this.state.products.filter(
            (item) => item._id !== this.state.productId._id
          ),
          tableRows: this.state.tableRows.filter(
            (item, index) => index !== this.state.productId.index
          ),
          modalShow: false,
          modalSoldshow: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };

  hendelAmounts = () => {
    let price;
    if (this.state.is_gst) {
      price =
        (parseInt(this.state.sell_price) * parseInt(this.state.gst_per)) / 100;
    } else {
      price =
        parseInt(this.state.sell_price_with_gst) -
        parseInt(this.state.sell_price);
    }
    let profit = this.state.sell_price
      ? this.state.sell_price -
        this.state.productDetail.purchase.purchase_amount
      : 0;
    let in_per =
      (profit / this.state.productDetail.purchase.purchase_amount) * 100;
    // let balancee;
    // if (this.state.sell_price_with_gst) {
    //   balancee=
    //   parseInt(this.state.sell_price_with_gst) -
    //     (parseInt(this.state.online_amount) + parseInt(this.state.cash_amount));
    //     this.setState({
    //       balance:balancee,
    //     })
    // } else {
    //   balancee=
    //   parseInt(this.state.sell_price) -
    //     (parseInt(this.state.online_amount) + parseInt(this.state.cash_amount));
    //     this.setState({
    //       balance:balancee,
    //     })
    // }

    this.setState({
      sell_price_with_gst: this.state.is_gst
        ? price + parseInt(this.state.sell_price)
        : 0,
      pl: profit,
      pl_percent: in_per,

      // received_amount:
      //   parseInt(this.state.online_amount) + parseInt(this.state.cash_amount),
    });
  };
  handleShow = (ProductId) => {
    // console.log(ProductId, this.state.show);
    this.props.dispatch(setShow(ProductId ? true : false));
    if (ProductId) {
      getProductDetailById(ProductId).then((res) => {
        console.log("show", res);
        this.setState({
          productDetail: res?.data?.data,
          sellProductId: ProductId,
          isSold_gst: res?.data?.data?.sold.is_gst,
          is_gst: res?.data?.data?.sold.is_gst,
          pl: res?.data?.data?.sold.profit_loss,
          pl_percent:
            (res?.data?.data?.sold.profit_loss /
              res?.data?.data?.purchase.purchase_amount) *
            100,
          balance_amount: res?.data?.data?.sold.balance,
          // sell_price_with_gst : (isNaN((res?.data?.data?.sold.gst.gst_amount ? res?.data?.data?.sold.gst.gst_amount : 0) + res.data?.data?.sold?.sell_price) ? "" : ((res?.data?.data?.sold.gst.gst_amount ? res?.data?.data?.sold.gst.gst_amount : 0) + res.data?.data?.sold?.sell_price)),
          sell_price: res?.data?.data?.sold?.sell_price,
          isSold_cash:
            res?.data?.data?.sold?.payment?.cash?.amount > 0 ? true : false,
          isSold_online:
            res?.data?.data?.sold?.payment?.online?.amount > 0 ? true : false,
          isSold_gst: res?.data?.data?.sold.is_gst,
          is_gst: res?.data?.data?.sold.is_gst,
          receivedTotal: parseInt(
            parseInt(
              res?.data?.data?.sold?.payment?.cash?.amount > 0
                ? res?.data?.data?.sold?.payment?.cash?.amount
                : 0
            ) +
              parseInt(
                res?.data?.data?.sold?.payment?.online?.amount > 0
                  ? res?.data?.data?.sold?.payment?.online?.amount
                  : 0
              )
          ),
          popupLoader: false,
          cash_amount: res?.data?.data?.sold.payment?.cash?.amount,
          online_amount: res?.data?.data?.sold.payment?.online?.amount,
          gst_per: res?.data?.data?.sold?.gst?.gst_rate,
        });
      });
    }

    this.setState({
      show: ProductId ? true : false,
      pl_percent: 0,
      pl: 0,
      balance_amount: 0,
      sell_price: 0,
      sell_price_with_gst: 0,
      // gst_per: ,
      is_gst: false,
    });
  };

  handalsellFeilds = async (event) => {
    const { name, value, checked } = event.target;
    // console.log(name, value);

    switch (name) {
      case "sell_price":
        this.setState(
          {
            sell_price: isNaN(parseInt(value)) ? 0 : parseInt(value),
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "gst":
        let isGst = checked ? true : false;
        this.setState(
          {
            is_gst: isGst,
          },
          () => {
            this.hendelAmounts();
          }
        );
        // let sold_gst = this.state.productDetail.sold.gst.gst_rate ? true : false;
        // this.setState({
        //   is_gst: sold_gst,
        // })
        let pricee;
        let isSold_Gst = checked ? true : false;
        this.setState({
          isSold_gst: isSold_Gst,
        });

        if (isGst) {
          pricee =
            (parseInt(this.state.sell_price) * parseInt(this.state.gst_per)) /
            100;
        } else {
          pricee =
            parseInt(this.state.sell_price_with_gst) -
            parseInt(this.state.sell_price);
        }
        this.setState({
          sell_price_with_gst: isGst
            ? pricee + parseInt(this.state.sell_price)
            : 0,
        });
        if (isGst === false) {
          this.setState({
            balance_amount: 0,
          });
        }

        break;
      case "gst_value":
        // if(this.state.isSold_gst === true){
        //   this.setState({
        //     gst_per: value,
        //   }),
        //   () => {
        //     this.hendelAmounts();
        //   }
        // }

        this.setState(
          {
            gst_per: value,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "cash":
        let sold_Cash = checked ? true : false;
        this.setState({
          isSold_cash: sold_Cash,
        });
        let isCash = checked ? true : false;
        !isCash &&
          this.setState({
            cash_amount: 0,
          });
        this.setState(
          {
            is_cash: isCash,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "online":
        let sold_Online = checked ? true : false;
        this.setState({
          isSold_online: sold_Online,
        });
        let isOnline = checked ? true : false;
        !isOnline &&
          this.setState({
            online_amount: 0,
          });
        this.setState(
          {
            is_online: isOnline,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "cash_amount":
        this.setState(
          {
            cash_amount: value,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "received_amount":
        // this.props.dispatch(setReceivedAmount(value));
        let balance;
        if (this.state.sell_price_with_gst) {
          balance = parseInt(this.state.sell_price_with_gst) - parseInt(value);
          this.setState({ balance_amount: balance });
        } else if (this.state.sell_price) {
          balance = parseInt(this.state.sell_price) - parseInt(value);
          this.setState({ balance_amount: balance });
        } else {
          this.setState({ balance_amount: 0 });
        }
        this.setState(
          {
            received_amount: value,
            receivedTotal: value,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      case "online_amount":
        this.setState(
          {
            online_amount: value,
          },
          () => {
            this.hendelAmounts();
          }
        );
        break;
      default:
        break;
    }

    this.setState({ [name]: value });
  };

  handleSellSubmit = async (event) => {
    event.preventDefault();

    this.setState({ ...this.state, isInvoiceLoading: true });
    // console.log(
    //   "hello",
    //   parseInt(this.state.cash_amount),
    //   this.state.isSold_cash,
    //   this.state.isSold_online,
    //   parseInt(this.state.online_amount)
    // );
    if (this.state.received_amount) {
      let receivedCheck =
        (isNaN(parseInt(this.state.cash_amount))
          ? 0
          : parseInt(this.state.cash_amount)) +
        (isNaN(parseInt(this.state.online_amount))
          ? 0
          : parseInt(this.state.online_amount));

      if (
        parseInt(
          this.state.received_amount === 0
            ? this.state.receivedTotal
            : this.state.received_amount
        ) != receivedCheck
      ) {
        toast.error("Received amount is not matching with mode of payment");
        this.setState({ ...this.state, isInvoiceLoading: false });
        return;
      }
      if (
        this.state.received_amount >
        parseInt(
          this.state.sell_price_with_gst
            ? this.state.sell_price_with_gst
            : this.state.sell_price
        )
      ) {
        toast.error(
          "Received amount should not be more than total selling price"
        );
        this.setState({ ...this.state, isInvoiceLoading: false });
        return;
      }
    }

    let body = {
      product_id: this.state.sellProductId,
      sold_at: event.target.elements.sold_at.value,
      sell_price: parseInt(event.target.elements.sell_price.value),
      sell_comment: event.target.elements.sell_comment.value,
      payment: {
        cash: { amount: parseInt(this.state.cash_amount) || 0 },
        online: { amount: parseInt(this.state.online_amount) || 0 },
      },
      to: event.target.elements.client_name.value,
      phone: event.target.elements.client_number.value,
      client_address: event.target.elements.client_address.value,
      email: event.target.elements.client_email.value,
      is_gst: event.target.elements.gst.checked ? true : false,
      received_amount: isNaN(parseInt(this.state.received_amount))
        ? 0
        : parseInt(this.state.received_amount),

      //   gst_rate: parseInt(event.target.elements.gst_value.value),
      //   gst_amount:
      //     (parseInt(event.target.elements.sell_price.value) *
      //       parseInt(event.target.elements.gst_value.value)) /
      //     100,
      //   gst_number: event.target.elements.gst_number.value,
      // },
    };

    let gst;
    if (body.is_gst) {
      gst = {
        gst_rate: event.target.elements?.gst_value?.value,
        gst_amount:
          (event.target.elements.sell_price.value *
            event.target.elements.gst_value.value) /
          100,
        gst_number: event.target.elements.gst_number.value,
      };

      body = {
        ...body,
        gst,
      };
    }
    if (!this.phonenumber(body.phone)) {
      return;
    }

    this.setState({
      clientDetails: body,
    });

    if (
      event.target.elements?.invoice_button?.name == "invoice_button" &&
      this.state.download_Invoice === true
    ) {
      this.setState({ ...this.state, isInvoiceLoading: false });
      this.downloadInvoice();
      // this.props.dispatch(setShow());
      return;
    }

    sellProductService(body)
      .then((res) => {
        this.setState({
          show: !this.state.show,
        });

        this.getDashboardStatus();
        if (this.state.sellEdit == true) {
          this.setState({ ...this.state, isInvoiceLoading: false });
          toast.success("Item edited successfully", { timeOut: 5000 });
          this.setState({
            sellEdit: false,
          });
        } else {
          this.setState({ ...this.state, isInvoiceLoading: false });
          toast.success(res.data.message, { timeOut: 5000 });
        }
        this.getDashboardStatus();
        this.getProducts(true);
        window.localStorage.setItem("section-update", this.state.currentTab);
      })
      .catch((err) => {
        if (this.state.sellEdit === true) {
          toast.success("Item edited successfully", { timeOut: 5000 });
          this.setState({
            sellEdit: false,
          });
        }
        if (err.response.data) {
          toast.error(err.response.data.message, { timeOut: 5000 });
        } else {
          toast.error("Please Fill data properly", { timeOut: 5000 });
        }
      });
  };

  phonenumber = (phone) => {
    var isPhone = /^\d{10}$/;
    if (phone.match(isPhone)) {
      return true;
    } else {
      toast.error("Please enter a valid phone number");
      return false;
    }
  };
  handlePurchaseEditShow = (rowId, purchaseId, product) => {
    console.log(product);
    // console.log(this.state.products[rowId]);
    this.setState({
      productEditData: {
        product: product.product,
        model: product.model,
        color: product.color,
        imei: product.imei,
        ram: product.ram,
        hdd: product.hdd,
        purchase_from: product.purchase.from,
        phone: product.purchase.phone,
        purchase_amount: product.purchase.purchase_amount,
        purchase_at: product.purchase_at,
        is_cash: product.purchase.is_cash ? true : false,
        is_online: product.purchase.is_online ? true : false,
        cash: product.purchase.payment.cash.amount,
        online: product.purchase.payment.online.amount,
        comment: product.purchase.comment,
        balance: product.purchase.balance,
      },
      rowId: rowId,
      purchaseId: purchaseId,
      rowEdit: true,
    });
  };

  validateForm = () => {
    let errors = this.state.formErrors;

    // check product is empty with trim
    if (this.state.productEditData.product.trim() === "") {
      errors.product = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.product = false;
      this.setState({ isFormValid: true });
    }
    // check model is empty with trim
    if (this.state.productEditData.model.trim() === "") {
      errors.model = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.model = false;
      this.setState({ isFormValid: true });
    }

    // check color is empty with trim
    if (this.state.productEditData.color.trim() === "") {
      errors.color = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.color = false;
      this.setState({ isFormValid: true });
    }
    // check imei is empty with trim
    if (this.state.productEditData.imei < 0) {
      errors.imei = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.imei = false;
      this.setState({ isFormValid: true });
    }
    // check ram is empty with trim
    if (this.state.productEditData.ram < 0) {
      errors.ram = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.ram = false;
      this.setState({ isFormValid: true });
    }
    // check hdd is empty with trim
    if (this.state.productEditData.hdd < 0) {
      errors.hdd = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.hdd = false;
      this.setState({ isFormValid: true });
    }
    // check purchase_amount is empty with trim
    if (
      this.state.productEditData.purchase_amount === 0 ||
      this.state.productEditData.purchase_amount === ""
    ) {
      errors.purchase_amount = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.purchase_amount = false;
      this.setState({ isFormValid: true });
    }
    // check purchase_at is empty with trim
    if (this.state.productEditData.purchase_at.trim() === "") {
      errors.purchase_at = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.purchase_at = false;
      this.setState({ isFormValid: true });
    }
    // check cash is empty with trim
    if (
      parseInt(this.state.productEditData.cash) < 0
      // ||
      // this.state.productEditData.cash === ""
    ) {
      errors.cash = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.cash = false;
      this.setState({ isFormValid: true });
    }
    // check online is empty with trim
    if (
      parseInt(this.state.productEditData.online) < 0
      // ||
      // this.state.productEditData.online === ""
    ) {
      errors.online = true;
      this.setState({ isFormValid: false });
      return;
    } else {
      errors.online = false;
      this.setState({ isFormValid: true });
    }

    this.setState({
      formErrors: errors,
    });
  };
  handleSendReminder = (id) => {
    sendReminder(id)
      .then((res) => {
        toast.success(res.data.message, { timeOut: 5000 });
      })
      .catch((err) => {
        if (err.response.data) {
          toast.error(err.response.data.message, { timeOut: 5000 });
        } else {
          toast.error("Something went wrong", { timeOut: 5000 });
        }
      });
  };
  handlePurchaseEditField = async (event) => {
    const { name, value, checked } = event.target;
    let productEditData = this.state.productEditData;
    switch (name) {
      case "product":
        productEditData.product = value;
        break;
      case "model":
        productEditData.model = value;
        break;
      case "color":
        productEditData.color = value;
        break;
      case "imei":
        productEditData.imei = value;
        break;
      case "ram":
        productEditData.ram = value;
        break;
      case "hdd":
        productEditData.hdd = value;
        break;
      case "from":
        productEditData.purchase_from = value;
        break;
      case "phone":
        productEditData.phone = value;
        break;
      case "purchase_amount":
        productEditData.purchase_amount = value;
        break;
      case "purchase_at":
        productEditData.purchase_at = value;
        break;
      case "cashChecked":
        let isCashChecked = checked ? true : false;
        if (!isCashChecked) {
          productEditData.cash = "";
          productEditData.is_cash = isCashChecked;
        }
        productEditData.is_cash = isCashChecked;
        break;
      case "onlineChecked":
        let isOnlineChecked = checked ? true : false;
        if (!isOnlineChecked) {
          productEditData.online = "";
          productEditData.is_online = isOnlineChecked;
        }
        productEditData.is_online = isOnlineChecked;
        break;
      case "cash":
        productEditData.cash = value;
        productEditData.balance =
          parseInt(productEditData.purchase_amount || 0) -
          (parseInt(productEditData.cash || 0) +
            parseInt(productEditData.online || 0));
        break;
      case "online":
        productEditData.online = value;
        productEditData.balance =
          parseInt(productEditData.purchase_amount || 0) -
          (parseInt(productEditData.cash || 0) +
            parseInt(productEditData.online || 0));
        break;
      case "comment":
        productEditData.comment = value;
        break;

      default:
        break;
    }
    this.validateForm();
    this.setState({
      productEditData: productEditData,
    });
  };
  getDashboardStatus = () => {
    getDashboardStatusService()
      .then((res) => {
        this.props.dispatch(setDashboardStatus(res.data?.data));
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  handlePurchaseEdit = async () => {
    // call form validation
    this.validateForm();
    this.setState({
      isEditLoader: true,
    });
    // if (false) {

    const errors = Object.values(this.state.formErrors);

    if (this.state.isFormValid || !errors.includes(true)) {
      // call api
      // format form data

      const formattedFormData = {
        product: this.state.productEditData.product,
        model: this.state.productEditData.model,
        color: this.state.productEditData.color,
        imei: this.state.productEditData.imei,
        ram: this.state.productEditData.ram,
        hdd: this.state.productEditData.hdd,
        purchase_from: this.state.productEditData.purchase_from,
        phone: this.state.productEditData.phone,
        purchase_amount: parseInt(this.state.productEditData.purchase_amount),
        entry_type: "purchase",
        is_cash: this.state.productEditData.is_cash,
        is_online: this.state.productEditData.is_online,
        purchase_at: this.state.productEditData.purchase_at,
        mod: {
          cash: {
            amount: isNaN(parseInt(this.state.productEditData.cash))
              ? 0
              : parseInt(this.state.productEditData.cash),
          },
          online: {
            amount: isNaN(parseInt(this.state.productEditData.online))
              ? 0
              : parseInt(this.state.productEditData.online),
          },
        },
        comment: this.state.productEditData.comment,
      };
      if (
        parseInt(formattedFormData.purchase_amount) <
        (parseInt(this.state.productEditData.cash)
          ? parseInt(this.state.productEditData.cash)
          : 0) +
          parseInt(
            this.state.productEditData.online
              ? this.state.productEditData.online
              : 0
          )
      ) {
        this.setState({
          isEditLoader: false,
        });
        toast.error("Paid amount is greater than purchase amount");
        return;
      }
      // call purchase product service
      purchaseProductupdateService(
        this.state.products[this.state.rowId]._id,
        formattedFormData
      )
        .then((res) => {
          // this.props.dispatch(setRowEdit());
          this.setState({ rowEdit: false });
          this.setState({
            isEditLoader: false,
          });
          toast.success(res.data.message, { timeOut: 5000 });

          this.getDashboardStatus();

          window.localStorage.setItem("section-update", this.props.section);
          window.dispatchEvent(new Event("storage"));
          this.getProducts(false);
        })
        .catch((err) => {
          if (err.response) {
            this.setState({
              isEditLoader: false,
            });
            toast.error(err.response.data.message, { timeOut: 5000 });
          }
        });
    } else {
      this.setState({
        isEditLoader: false,
      });
      toast.error("Please Add Correct Product data.", { timeOut: 5000 });
    }
  };

  updateallfunction = (section) => {
    switch (section) {
      case "Dashboards":
        if (this.state.currentTab === "Inventory") {
          this.getAdvanceProductStatus();
        }
        break;
      case "Purchase":
        if (this.state.currentTab === "Purchase") {
          this.getProducts(false);
        }
        break;
      case "Sales":
        if (this.state.currentTab === "Sales") {
          this.getProducts(true);
        }
        break;

      default:
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

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    switch (this.state.currentTab) {
      case "Purchase":
        this.setState({
          tableHeading: "Items Purchased Today",
        });
        this.getProducts(false);

        break;
      case "Sales":
        this.setState({
          tableHeading: "Items Sold Today, showing: All",
        });
        this.getProducts(true);

        break;
      default:
        this.setState({
          tableHeading: "Total Inventory/Stock as of now",
        });
        this.getAllInventory();
        break;
    }
    this.props.dispatch(setType("all"));
    this.props.dispatch(
      fetchInventory({
        postData: this.props.inventory.postData,
        tab: "dashboard",
      })
    );
  }

  downloadInvoice = () => {
    this.setState({ invoiceModalShow: true });
    const pdfName = "invoice.pdf";
    setTimeout(() => {
      const pdf = new jsPDF("p", "pt", "a3");
      pdf.html(document.querySelector("#pdf"), {
        callback: function (pdf) {
          pdf.save(pdfName);
        },
      });
    }, 1000);
    this.setState({
      download_Invoice: false,
    });
  };

  render() {
    if (this.props?.inventory?.purchaseSearch) {
      var {
        tableHeading,
        formErrors,
        pl,
        pl_percent,
        gst_per,
        sell_price,
        is_gst,
        postData,
        balance_amount,
        modalShow,
        show,
        products,
        currentTab,
        productDetail,
        sellEdit,
      } = this.props.inventory;
      var { rowEdit, rowId } = this.state;
    } else {
      var {
        tableHeading,
        formErrors,
        pl,
        rowEdit,
        rowId,
        invoiceShow,
        pl_percent,
        gst_per,
        sell_price,
        is_gst,
        postData,
        balance_amount,
        modalShow,
        show,
        products,
        currentTab,
        productDetail,
        sellEdit,
        receivedTotal,
      } = this.state;
    }
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

    return (
      <>
        <div className="row mx-0">
          {/* <ToastContainer /> */}
          <div className="p-3 pb-0 card">
            {currentTab === "Sales" &&
              window.location.pathname === "/bahikhata/dev/app/sales" &&
              products.length > 0 && (
                <div className="d-sm-flex justify-content-between">
                  <h2 className="text-primary fs-6 fs-w600 mb-3 ms-2">
                    {tableHeading.includes("from:") ? (
                      <>
                        {tableHeading.split("from:")[0]} from:{" "}
                        <span className="ind-name">
                          {tableHeading.split("from:")[1].split(",")[0]}{" "}
                        </span>{" "}
                        ,{" "}
                        {
                          tableHeading
                            .split("from:")[1]
                            .split(",")[1]
                            .split(":")[0]
                        }{" "}
                        :{" "}
                        <span className="ind-name">
                          {
                            tableHeading
                              .split("from:")[1]
                              .split(",")[1]
                              .split(":")[1]
                          }
                        </span>{" "}
                      </>
                    ) : (
                      tableHeading
                    )}
                  </h2>
                  <DropdownButton
                    id={`dropdown-button-drop-down`}
                    key={"down"}
                    drop="down"
                    variant="outline-primary border-0 fs-12 fs-w600 ps-1"
                    title={`Sales Report`}
                  >
                    {/* <Form
                    className="row pt-sm-0"
                    // method="POST"
                    onSubmit={()=>this.downloadInventory()}
                  > */}

                    <div className="  date-flex w-400 d-flex flex-column flex-lg-row">
                      <div className="input me-lg-1 ">
                        <div className="sale-date date-flex">
                          <label className="sale-label w-37" htmlFor="from">
                            From
                          </label>
                          <input
                            id="from"
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                from: moment(e.target.value).format(
                                  "YYYY-MM-DD"
                                ),
                              })
                            }
                            type="date"
                            // defaultValue={this.state.date}
                            // style={{
                            //   width: "fit-content",
                            // }}
                            value={this.state.from}
                            className="form-control sale-date-width fs-12 fs-w400 session-date date_input"
                          />
                        </div>
                      </div>
                      <div className="  input me-lg-1 ">
                        <div className="sale-date date-flex">
                          <label className="sale-label w-18" htmlFor="to">
                            To
                          </label>
                          <input
                            id="to"
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                to: moment(e.target.value).format("YYYY-MM-DD"),
                              })
                            }
                            type="date"
                            // defaultValue={this.state.date}
                            // style={{
                            //   width: "fit-content",
                            // }}
                            value={this.state.to}
                            className="form-control sale-date-width fs-12 fs-w400 session-date date_input"
                          />
                        </div>
                      </div>
                      <div className=" ">
                        <button
                          // variant="primary fs-12 fs-w600"
                          id="search-product-button"
                          // type="submit"
                          style={{ height: "fit-content" }}
                          className=" d-flex sale-label btn btn-outline-secondary-search-paid btn-sm mb-2 mb-sm-0 download-inventory"
                          onClick={() => this.downloadSalesReport()}
                        >
                          <span className="me-1">Download Report</span>
                          <i className="fa-solid fa-file-arrow-down"></i>
                        </button>
                      </div>
                    </div>

                    {/* </Form> */}
                  </DropdownButton>
                </div>
              )}

            {currentTab === "Purchase" && products.length > 0 && (
              <h2 className="text-primary fs-6 fs-w600 mb-3 ms-2">
                {tableHeading.includes("from:") ? (
                  <>
                    {" "}
                    {tableHeading.split("from:")[0]} from:{" "}
                    <span className="ind-name">
                      {tableHeading.split("from:")[1]}
                    </span>{" "}
                  </>
                ) : (
                  tableHeading
                )}
              </h2>
            )}

            {/* When no data in table */}
            {/*
             */}
            {/* {(currentTab==="sale") ? (
              <NoData/>
            ) : ( */}
            <InputGroup className="mx-0 px-0 justify-content-center d-flex">
              <Table responsive>
                <thead>
                  {currentTab !== "Sales" && (
                    <tr>
                      {tableHeadings.map((tableHeading) => (
                        <th
                          key={tableHeading}
                          className="text-nowrap fs-14 fs-w700"
                        >
                          {tableHeading}
                        </th>
                      ))}
                    </tr>
                  )}

                  {products.length > 0 && currentTab === "Sales" && (
                    <>
                      <tr>
                        {tableHeadingsForSale &&
                          tableHeadingsForSale.map((tableHeading) => (
                            <th
                              key={tableHeading}
                              className="text-nowrap fs-14 fs-w700"
                            >
                              {tableHeading}
                            </th>
                          ))}
                      </tr>
                    </>
                  )}

                  {currentTab !== "Sales" && (
                    <PurchaseForm
                      section={currentTab}
                      getAllInventory={this.getProducts}
                    />
                  )}
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((data, dIndex) => {
                      return (
                        <tr key={dIndex}>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"product"}
                                  className={
                                    formErrors.product
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.product}
                                />
                              </>
                            ) : (
                              <>
                                {data.product}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"product"}
                                    className={
                                      formErrors.product
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.product}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"model"}
                                  className={
                                    formErrors.model
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  style={{ width: "100px", overflow: "hidden" }}
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.model}
                                />
                              </>
                            ) : (
                              <>
                                {data.model}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"model"}
                                    className={
                                      formErrors.model
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    style={{
                                      width: "100px",
                                      overflow: "hidden",
                                    }}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.model}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"color"}
                                  className={
                                    formErrors.color
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  style={{ width: "100px", overflow: "hidden" }}
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.color}
                                />
                              </>
                            ) : (
                              <>
                                {data.color}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"color"}
                                    className={
                                      formErrors.color
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    style={{
                                      width: "100px",
                                      overflow: "hidden",
                                    }}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.color}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"imei"}
                                  type="number"
                                  className={
                                    formErrors.imei
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      15
                                    ))
                                  }
                                  defaultValue={data.imei}
                                />
                              </>
                            ) : (
                              <>
                                {data.imei}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"imei"}
                                    type="number"
                                    className={
                                      formErrors.imei
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.slice(
                                        0,
                                        15
                                      ))
                                    }
                                    defaultValue={data.imei}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"ram"}
                                  className={
                                    formErrors.ram
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.ram}
                                />
                              </>
                            ) : (
                              <>
                                {data.ram}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"ram"}
                                    className={
                                      formErrors.ram
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.ram}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"hdd"}
                                  className={
                                    formErrors.hdd
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.hdd}
                                />
                              </>
                            ) : (
                              <>
                                {data.hdd}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"hdd"}
                                    className={
                                      formErrors.hdd
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.hdd}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"purchase_at"}
                                  type="date"
                                  className={
                                    formErrors.purchase_at
                                      ? "fs-12 border border-danger"
                                      : "form-control fs-12 session-date"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={moment(
                                    new Date(data.purchase_at)
                                  ).format("YYYY-MM-DD")}
                                />
                              </>
                            ) : (
                              <>
                                {moment(data.purchase_at).format("DD/MM/YYYY")}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"purchase_at"}
                                    type="date"
                                    className={
                                      formErrors.purchase_at
                                        ? "fs-12 border border-danger"
                                        : "form-control fs-12 session-date"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    value={moment(
                                      new Date(data.purchase_at)
                                    ).format("YYYY-MM-DD")}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td style={{ position: "relative" }}>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"from"}
                                  className={
                                    formErrors.purchase_from
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  value={
                                    this.state.productEditData.purchase_from
                                  }
                                  onChange={(e) => this.searchCall(e)}
                                  defaultValue={data.purchase.from}
                                />
                                {this.state.showSearchPopup && (
                                  <SearchPopup
                                    data={this.state.PopupsearchData}
                                    setPurchase={this.setPurchaseFrom}
                                    fromTab="purchase"
                                    setSearch={this.handlePopupAfterSearchCall}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                <NavLink
                                  to={`/clientkhata?q=${data.purchase.from}&type=credit`}
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
                                  {data.purchase.from}
                                </NavLink>
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"from"}
                                    className={
                                      formErrors.purchase_from
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.purchase.from}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  type="number"
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      10
                                    ))
                                  }
                                  name="phone"
                                  value={this.state.productEditData.phone}
                                  className={
                                    formErrors.phone
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.purchase.phone}
                                />
                              </>
                            ) : (
                              <>
                                <NavLink
                                  to={`/clientkhata?q=${data.purchase.phone}&type=credit`}
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
                                  {data.purchase.phone}
                                </NavLink>
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    type="number"
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.slice(
                                        0,
                                        10
                                      ))
                                    }
                                    name="phone"
                                    className={
                                      formErrors.phone
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.purchase.phone}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  type="number"
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      7
                                    ))
                                  }
                                  name={"purchase_amount"}
                                  className={
                                    formErrors.purchase_amount
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.purchase.purchase_amount}
                                />
                              </>
                            ) : (
                              <>
                                {data.purchase.purchase_amount}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    type="number"
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.slice(
                                        0,
                                        7
                                      ))
                                    }
                                    name={"purchase_amount"}
                                    className={
                                      formErrors.purchase_amount
                                        ? "fs-12 border border-danger"
                                        : "fs-12"
                                    }
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.purchase.purchase_amount}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
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
                                          name="cashChecked"
                                          className="form-check-input"
                                          style={{
                                            borderRadius: "1px",
                                            borderColor: "#143B64",
                                          }}
                                          defaultChecked={
                                            data.purchase.payment.cash.amount >
                                            0
                                              ? data.purchase.payment.cash
                                                  .amount
                                              : false
                                          }
                                          onChange={(e) =>
                                            this.handlePurchaseEditField(e)
                                          }
                                        />
                                        <label
                                          htmlFor="cash"
                                          className="ms-2 fs-12  fw-400 payment-style"
                                        >
                                          Cash
                                        </label>
                                      </div>
                                      <div className="col-8">
                                        <input
                                          type="number"
                                          onInput={(e) =>
                                            (e.target.value =
                                              e.target.value.slice(0, 7))
                                          }
                                          style={{
                                            width: "7.25rem",
                                            height: "1.938rem",
                                          }}
                                          name="cash"
                                          value={
                                            this.state.productEditData.cash
                                          }
                                          defaultValue={
                                            data.purchase.payment.cash.amount
                                          }
                                          onChange={(e) =>
                                            this.handlePurchaseEditField(e)
                                          }
                                          className={
                                            formErrors.cash
                                              ? "fs-12 border border-danger"
                                              : "form-control"
                                          }
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
                                            data.purchase.payment.online
                                              .amount > 0
                                              ? data.purchase.payment.online
                                                  .amount
                                              : false
                                          }
                                          onChange={(e) =>
                                            this.handlePurchaseEditField(e)
                                          }
                                        />
                                        <label
                                          htmlFor="online"
                                          className="ms-2 fs-12 fw-400 payment-style"
                                        >
                                          Online
                                        </label>
                                      </div>
                                      <div className="col-8">
                                        <input
                                          type="number"
                                          onInput={(e) =>
                                            (e.target.value =
                                              e.target.value.slice(0, 7))
                                          }
                                          style={{
                                            width: "7.25rem",
                                            height: "1.938rem",
                                          }}
                                          name="online"
                                          value={
                                            this.state.productEditData.online
                                          }
                                          onChange={(e) =>
                                            this.handlePurchaseEditField(e)
                                          }
                                          defaultValue={parseInt(
                                            data.purchase.payment.online.amount
                                          )}
                                          className={
                                            formErrors.online
                                              ? "fs-12 border border-danger"
                                              : "form-control"
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </DropdownButton>
                              </>
                            ) : (
                              <>
                                {data.purchase.payment.cash.amount !== "" &&
                                data.purchase.payment.cash.amount !== 0 &&
                                data.purchase.payment.online.amount !== "" &&
                                data.purchase.payment.online.amount !== 0
                                  ? "Cash & Online"
                                  : data.purchase.payment.cash.amount !== "" &&
                                    data.purchase.payment.cash.amount !== 0
                                  ? "Cash"
                                  : !data.purchase.payment.cash.amount &&
                                    !data.purchase.payment.online.amount
                                  ? " "
                                  : "Online"}

                                <br />
                                {rowEdit && rowId === dIndex && (
                                  <DropdownButton
                                    variant=" btn-sm fs-12 dropdown-specific-border"
                                    id="dropdown-item-button"
                                    title="Mode of Payment"
                                  >
                                    <div className="dropdown-item">
                                      <div className="row">
                                        <div className="col-4">
                                          <input
                                            type="checkbox"
                                            id="cash"
                                            name="cashChecked"
                                            onChange={(e) =>
                                              this.handlePurchaseEditField(e)
                                            }
                                          />
                                          <label
                                            htmlFor="cash"
                                            className="ms-2"
                                          >
                                            Cash
                                          </label>
                                        </div>
                                        <div className="col-8">
                                          <input
                                            type="text"
                                            style={{ width: "90%" }}
                                            name="cash"
                                            defaultValue={parseInt(
                                              data.purchase.payment.cash.amount
                                            )}
                                            onChange={(e) =>
                                              this.handlePurchaseEditField(e)
                                            }
                                            className={
                                              formErrors.cash
                                                ? "fs-12 border border-danger"
                                                : "form-control"
                                            }
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
                                            onChange={(e) =>
                                              this.handlePurchaseEditField(e)
                                            }
                                          />
                                          <label
                                            htmlFor="online"
                                            className="ms-2"
                                          >
                                            Online
                                          </label>
                                        </div>
                                        <div className="col-8">
                                          <input
                                            type="text"
                                            style={{ width: "90%" }}
                                            name="online"
                                            onChange={(e) =>
                                              this.handlePurchaseEditField(e)
                                            }
                                            defaultValue={parseInt(
                                              data.purchase.payment.online
                                                .amount
                                            )}
                                            className={
                                              formErrors.online
                                                ? "fs-12 border border-danger"
                                                : "form-control"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </DropdownButton>
                                )}
                              </>
                            )}
                          </td>

                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <label
                                  name={"you-paid"}
                                  // className={"fs-12 border"}
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  // defaultValue={
                                  //   parseInt(
                                  //     data.purchase.payment.cash.amount
                                  //   ) +
                                  //   parseInt(
                                  //     data.purchase.payment.online.amount
                                  //   )
                                  // }
                                  // readOnly
                                >
                                  {" "}
                                  {isNaN(
                                    parseInt(
                                      (data.purchase.payment.cash.amount
                                        ? data.purchase.payment.cash.amount
                                        : "") +
                                        (data.purchase.payment.online.amount
                                          ? data.purchase.payment.online.amount
                                          : "")
                                    )
                                  )
                                    ? 0
                                    : parseInt(
                                        (data.purchase.payment.cash.amount
                                          ? data.purchase.payment.cash.amount
                                          : "") +
                                          (data.purchase.payment.online.amount
                                            ? data.purchase.payment.online
                                                .amount
                                            : "")
                                      )}
                                </label>
                              </>
                            ) : (
                              <>
                                {isNaN(
                                  parseInt(
                                    (data.purchase.payment.cash.amount
                                      ? data.purchase.payment.cash.amount
                                      : "") +
                                      (data.purchase.payment.online.amount
                                        ? data.purchase.payment.online.amount
                                        : "")
                                  )
                                )
                                  ? 0
                                  : parseInt(
                                      (data.purchase.payment.cash.amount
                                        ? data.purchase.payment.cash.amount
                                        : "") +
                                        (data.purchase.payment.online.amount
                                          ? data.purchase.payment.online.amount
                                          : "")
                                    )}
                                {rowEdit && rowId === dIndex && (
                                  <label
                                    name={"you-paid"}
                                    // className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    // defaultValue={
                                    //   parseInt(
                                    //     data.purchase.payment.cash.amount
                                    //   ) +
                                    //   parseInt(
                                    //     data.purchase.payment.online.amount
                                    //   )
                                    // }
                                    // readOnly
                                  >
                                    {parseInt(
                                      data.purchase.payment.cash.amount
                                    ) +
                                      parseInt(
                                        data.purchase.payment.online.amount
                                      )}
                                  </label>
                                )}
                              </>
                            )}
                          </td>

                          {currentTab != "Sales" && (
                            <td>
                              {rowEdit && rowId === dIndex ? (
                                <>
                                  <label
                                    name={"balance"}
                                    // className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    // defaultValue={data.purchase.balance}
                                    // readOnly
                                  >
                                    {parseInt(
                                      data.purchase.purchase_amount || 0
                                    ) -
                                      (parseInt(
                                        data.purchase.payment.cash.amount || 0
                                      ) +
                                        parseInt(
                                          data.purchase.payment.online.amount ||
                                            0
                                        ))}
                                  </label>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={` ${
                                      parseInt(
                                        data.purchase.purchase_amount || 0
                                      ) -
                                        (parseInt(
                                          data.purchase.payment.cash.amount || 0
                                        ) +
                                          parseInt(
                                            data.purchase.payment.online
                                              .amount || 0
                                          )) >
                                        0 && "text-danger"
                                    }`}
                                  >
                                    {parseInt(
                                      data.purchase.purchase_amount || 0
                                    ) -
                                      (parseInt(
                                        data.purchase.payment.cash.amount || 0
                                      ) +
                                        parseInt(
                                          data.purchase.payment.online.amount ||
                                            0
                                        ))}
                                  </div>
                                  {rowEdit && rowId === dIndex && (
                                    <label
                                      name={"balance"}
                                      // className={"fs-12 border"}
                                      onChange={(e) =>
                                        this.handlePurchaseEditField(e)
                                      }
                                      // defaultValue={data.purchase.balance}
                                      // readOnly
                                    >
                                      {data.purchase.balance}
                                    </label>
                                  )}
                                </>
                              )}
                            </td>
                          )}
                          <td
                            data-toggle="tooltip"
                            data-placement="top"
                            title={data?.purchase.comment}
                            className={`${
                              this.state.width < 420
                                ? " comment-break  fs-12"
                                : data?.purchase?.comment?.length > 0 &&
                                  " fs-12 cursor-pointer"
                            }`}
                          >
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"comment"}
                                  maxLength="100"
                                  className={"fs-12 border"}
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  defaultValue={data.purchase.comment}
                                />
                              </>
                            ) : (
                              <>
                                {` 
                              ${
                                this.state.width > 420
                                  ? data.purchase.comment.length > 15
                                    ? data.purchase.comment.slice(0, 15) + "..."
                                    : data.purchase.comment
                                  : data.purchase.comment
                              }`}
                                {/* {data.purchase.comment} */}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"comment"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.purchase.comment}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          {/* additional sales data */}
                          {currentTab === "Sales" && (
                            <>
                              <td>
                                {moment(data.sold.sold_at).format("DD/MM/YYYY")}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_date"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={moment(
                                      data.sold.sold_at
                                    ).format("DD/MM/YYYY")}
                                  />
                                )}
                              </td>
                              <td>
                                <NavLink
                                  to={`/clientkhata?q=${data.sold.to}&type=debit`}
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
                                  {data.sold.to}
                                </NavLink>
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_to"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.sold.to}
                                  />
                                )}
                              </td>
                              <td>
                                <NavLink
                                  to={`/clientkhata?q=${data.sold.phone}&type=debit`}
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
                                  {data.sold.phone}
                                </NavLink>

                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_phone"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.sold.phone}
                                  />
                                )}
                              </td>

                              <td>
                                {" "}
                                {data.sold.sell_price +
                                  (data?.sold?.gst?.gst_amount
                                    ? data?.sold?.gst?.gst_amount
                                    : 0)}
                                /-
                              </td>
                              <td>
                                {parseInt(
                                  parseInt(
                                    data?.sold?.payment?.cash?.amount > 0
                                      ? parseInt(
                                          data?.sold?.payment?.cash?.amount
                                        )
                                      : 0
                                  ) +
                                    parseInt(
                                      data?.sold?.payment?.online?.amount > 0
                                        ? parseInt(
                                            data?.sold?.payment?.online?.amount
                                          )
                                        : 0
                                    )
                                )}

                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_payment_received"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={
                                      data.sold.payment.cash.amount +
                                      data.sold.payment.online.amount
                                    }
                                  />
                                )}
                              </td>
                              <td>
                                <div
                                  className={`${
                                    data?.sold?.balance > 0 && "text-success"
                                  }`}
                                >
                                  {data?.sold?.gst?.gst_amount > 0
                                    ? parseInt(
                                        data?.sold?.gst?.gst_amount +
                                          data?.sold?.balance
                                      )
                                    : data?.sold?.balance || 0}
                                </div>
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_balance || 0"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.sold.balance || 0}
                                  />
                                )}
                              </td>
                              <td
                                className={
                                  data.sold.profit_loss &&
                                  data.sold.profit_loss < 0
                                    ? "text-danger"
                                    : "text-success"
                                }
                              >
                                {data.sold.profit_loss < 0
                                  ? data.sold.profit_loss * -1
                                  : data.sold.profit_loss || 0}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_profit_loss || 0"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.sold.profit_loss || 0}
                                  />
                                )}
                              </td>
                              <td>
                                <div className="client_address">
                                  {data.sold.client_address || ""}
                                  {rowEdit && rowId === dIndex && (
                                    <FormControl
                                      name={"sold_client_address"}
                                      className={"fs-12 border"}
                                      onChange={(e) =>
                                        this.handlePurchaseEditField(e)
                                      }
                                      defaultValue={data.sold.client_address}
                                    />
                                  )}
                                </div>
                              </td>
                              <td
                                className={`${
                                  this.state.width < 420
                                    ? " comment-break  fs-12"
                                    : "cursor-pointer fs-12"
                                }`}
                                title={data.sold.sell_comment}
                                data-toggle="tooltip"
                                data-placement="top"
                              >
                                {`
                              ${
                                this.state.width > 420
                                  ? data.sold?.sell_comment?.length > 15
                                    ? data.sold?.sell_comment.slice(0, 15) +
                                      "..."
                                    : data.sold?.sell_comment || ""
                                  : data.sold?.sell_comment || ""
                              }`}
                                {/* {data.sold.sell_comment} */}
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"sold_sell_comment"}
                                    className={"fs-12 border"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.sold.sell_comment || ""}
                                  />
                                )}
                              </td>
                            </>
                          )}
                          <td>
                            {currentTab === "Inventory" ||
                            currentTab === "Purchase" ? (
                              <>
                                {rowEdit && rowId === dIndex ? (
                                  <div className="d-flex justify-content-center">
                                    <button
                                      className="btn btn-secondary btn-sm me-3 "
                                      onClick={() =>
                                        this.setState({ rowEdit: false })
                                      }
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm me-2 "
                                      onClick={() => this.handlePurchaseEdit()}
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    {this.state.isEditLoader ? (
                                      <SyncLoader
                                        size={5}
                                        color="#143B64"
                                        className="ms-3"
                                      />
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    {!data.is_sold ? (
                                      <div className="d-flex">
                                        <Button
                                          disabled={data.is_sold}
                                          variant="success btn-sm"
                                          className="l-green"
                                          onClick={() =>
                                            this.handleShow(
                                              products[dIndex]._id
                                            )
                                          }
                                        >
                                          Sell
                                        </Button>
                                        <Button
                                          variant="primary mx-3 btn-sm"
                                          className="l-blue"
                                          onClick={() => {
                                            this;
                                            this.handlePurchaseEditShow(
                                              dIndex,

                                              products[dIndex]._id,
                                              products[dIndex]
                                            );
                                          }}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="danger btn-sm"
                                          onClick={() => {
                                            this.setState({
                                              productId: {
                                                _id: products[dIndex]._id,
                                                index: dIndex,
                                              },
                                              productDetail: data,
                                              modalShow: true,
                                            });
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    ) : (
                                      "Product already sold out"
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <DropdownButton
                                  className="dropdown-toggle-ellipsis"
                                  id="dropdown-item-button-icon"
                                  title=""
                                >
                                  <Dropdown.Item
                                    as="button"
                                    onClick={() => {
                                      this.props.dispatch(setShow());
                                      this.props.dispatch(
                                        resetSearch(products[dIndex]._id)
                                      );
                                      this.props.dispatch(setType("all"));
                                      console.log(this.state);
                                      this.setState({
                                        ...this.state,
                                        sellEdit: true,
                                        from: moment().format("YYYY-MM-DD"),
                                        to: moment().format("YYYY-MM-DD"),
                                        productDetail: null,
                                      });
                                      this.handleShow(products[dIndex]._id);
                                    }}
                                    className="fs-12"
                                  >
                                    Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as="button"
                                    className="fs-12"
                                    onClick={() => {
                                      this.setState({
                                        productId: {
                                          _id: products[dIndex]._id,
                                          index: dIndex,
                                        },
                                        productDetail: data,
                                        modalSoldshow: true,
                                      });
                                    }}
                                  >
                                    Delete
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as="button"
                                    className="fs-12"
                                    onClick={() => {
                                      this.props.dispatch(setType("all"));
                                      this.props.dispatch(
                                        resetSearch(products[dIndex]._id)
                                      );
                                      this.handleInvoiceShow(
                                        products[dIndex]._id
                                      );
                                    }}
                                  >
                                    View Invoice
                                  </Dropdown.Item>

                                  {(
                                    data?.sold?.balance > 0
                                      ? data?.sold?.balance
                                      : parseInt(data?.sold?.sell_price) +
                                        parseInt(data?.sold?.gst?.gst_amount) -
                                        (parseInt(
                                          data?.sold?.payment?.cash?.amount > 0
                                            ? data?.sold?.payment?.cash?.amount
                                            : 0
                                        ) +
                                          parseInt(
                                            data?.sold?.payment?.online
                                              ?.amount > 0
                                              ? data?.sold?.payment?.online
                                                  ?.amount
                                              : 0
                                          ))
                                  ) ? (
                                    <Dropdown.Item
                                      as="button"
                                      className="fs-12"
                                      onClick={() =>
                                        this.handleSendReminder(
                                          products[dIndex]._id
                                        )
                                      }
                                    >
                                      Send Reminder
                                    </Dropdown.Item>
                                  ) : (
                                    ""
                                  )}
                                </DropdownButton>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : this.state.isLoading ? (
                    <tr>
                      <td
                        className="botton-line"
                        colSpan={tableHeadings.length}
                      >
                        <div className="noState">
                          <p className="text-muted fs-w600 fs-6 text-center">
                            <SyncLoader size={10} color={"#143B64"} />
                            <br />
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        {currentTab === "Sales" ? (
                          <td
                            className="botton-line"
                            colSpan={tableHeadings.length}
                          >
                            {<NoData />}
                          </td>
                        ) : (
                          <td colSpan={tableHeadings.length}>
                            {<NoData type="dashboard" />}
                          </td>
                        )}
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
              {products.length > 0 ? (
                <DynamicPagination
                  paginate={postData}
                  handlePagination={this.handlePagination}
                />
              ) : (
                ""
              )}
            </InputGroup>
          </div>
        </div>

        <Offcanvas
          show={show}
          onHide={() => this.handleShow(null)}
          placement="end"
          name="end"
          className="sell-1"
        >
          <Offcanvas.Header className="align-items-center">
            <Offcanvas.Title>
              <div className="d-flex align-items-center">
                <div
                  style={{ cursor: "pointer" }}
                  className="align-items-center"
                >
                  <i
                    className="fa-solid fa-xmark fs-24 fs-w900 me-4  sell-modal-text"
                    onClick={() => this.handleShow(null)}
                  ></i>
                </div>
                <div>
                  {sellEdit ? (
                    <span className="fs-18 fs-w600 text-primary">
                      Editing the sold item
                    </span>
                  ) : (
                    <span className="fs-18 fs-w600 text-primary">
                      Selling the item
                    </span>
                  )}
                </div>
              </div>
            </Offcanvas.Title>
            {sellEdit ? (
              <Offcanvas.Title className="fs-18 fs-w600 text-primary text-end">
                {this.state.gst_per ? "GST Invoice" : "Non GST Invoice"}
              </Offcanvas.Title>
            ) : (
              <Offcanvas.Title className="fs-18 fs-w600 text-primary text-end">
                {this.state.gst_per ? "GST Invoice" : "Non GST Invoice"}
              </Offcanvas.Title>
            )}
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form
              className="row pt-sm-0 sell_form"
              method="POST"
              onSubmit={this.handleSellSubmit}
            >
              {/* {this.state.popupLoader ? (
                <div className="text-center m-5">
                  <SyncLoader size={10} color="#143B64" />
                </div>
              ) : (
                <></>
              )} */}
              {productDetail !== null && (
                <>
                  <div className="off-can mt-4 ">
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Product Name
                      </p>
                      <p className=" sell-modal-text fs-w500 mt-3 fs-14">
                        {productDetail.product}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Model
                      </p>
                      <p className=" sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.model}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Color
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3 ">
                        {productDetail.color}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        IMEI
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.imei}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        RAM (in GB)
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.ram}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        HDD (in GB)
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.hdd}
                      </p>
                    </div>
                  </div>
                  <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />

                  <div className="off-can mt-3">
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Purchase Date
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {moment(productDetail.purchase_at).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Purchased From
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.purchase.from}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Purchase Amount
                      </p>
                      <p className="sell-modal-text fs-w500 fs-14 mt-3">
                        {productDetail.purchase.purchase_amount}
                      </p>
                    </div>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Purchase Comments
                      </p>
                      <p
                        className="sell-modal-text fs-w500 fs-14 mt-3"
                        title={productDetail.purchase.comment}
                        data-toggle="tooltip"
                        data-placement="top"
                      >
                        {`${productDetail.purchase.comment.slice(0, 15) || ""} 
                              ${
                                productDetail.purchase.comment.length > 15
                                  ? "..."
                                  : ""
                              }`}
                      </p>
                    </div>
                  </div>
                  <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />
                </>
              )}

              <div className="off-can mt-3">
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Date
                  </p>

                  {sellEdit ? (
                    <input
                      className="mt-3 fs-12 sell-modal-text w-auto form-control mySpecificDate session-date sell_client_input"
                      type="date"
                      pattern="\d{4}-\d{2}-\d{2}"
                      name={"sold_at"}
                      defaultValue={productDetail?.sold?.sold_at}
                      // required
                    />
                  ) : (
                    <input
                      className="mt-3 fs-12 sell-modal-text w-auto form-control mySpecificDate session-date sell_client_input"
                      type="date"
                      pattern="\d{4}-\d{2}-\d{2}"
                      name={"sold_at"}
                      defaultValue={this.state.date}
                      // required
                    />
                  )}
                </div>
                <div className="off-can-data pe-lg-0 me-1">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Price
                  </p>
                  {sellEdit ? (
                    <FormControl
                      className="mt-3 w-auto sell-modal-text me-3 fs-12"
                      type="number"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 7))
                      }
                      defaultValue={productDetail?.sold?.sell_price}
                      name="sell_price"
                      onChange={this.handalsellFeilds}
                      required
                    />
                  ) : (
                    <FormControl
                      className="mt-3 w-auto sell-modal-text me-3 fs-12"
                      type="number"
                      placeholder="Selling Price"
                      name="sell_price"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 7))
                      }
                      onChange={this.handalsellFeilds}
                      required
                    />
                  )}
                </div>

                <div className="off-can-data  pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Received
                  </p>
                  {sellEdit ? (
                    <FormControl
                      className="mt-3 w-100  ps-1 h-0 fs-12"
                      type="number"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 7))
                      }
                      onChange={this.handalsellFeilds}
                      // defaultValue={receivedTotal < 0 ? "" : receivedTotal}
                      defaultValue={this.state.receivedTotal}
                      name="received_amount"
                      required
                    />
                  ) : (
                    <FormControl
                      className="mt-3 w-100  ps-1 pe-0 w-75 fs-12"
                      type="number"
                      placeholder="Received"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 7))
                      }
                      onChange={this.handalsellFeilds}
                      name="received_amount"
                      // value={`${parseInt(this.state.received_amount)}`}
                      required
                    />
                  )}
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Comments
                  </p>
                  {sellEdit ? (
                    <FormControl
                      className="mt-3 w-auto fs-12 sell-text"
                      as="textarea"
                      name="sell_comment"
                      defaultValue={productDetail?.sold?.sell_comment}
                      // required
                      maxLength="100"
                    />
                  ) : (
                    <FormControl
                      className="mt-3 w-auto fs-12"
                      as="textarea"
                      name="sell_comment"
                      maxLength="100"
                    />
                  )}
                </div>
              </div>
              {sellEdit ? (
                <DropdownButton
                  variant="primary"
                  id="dropdown-item-button"
                  title="Mode of Payment"
                  className="mb-2  "
                  // style={{ width: "6.25rem",height:"1.938rem" }}
                >
                  <div className="dropdown-item button-size fs-12">
                    <div className="row">
                      <div className="col-4 d-flex align-items-center">
                        <div>
                          <input
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="cash"
                            name="cash"
                            defaultChecked={
                              productDetail?.sold?.payment?.cash?.amount > 0 ||
                              productDetail?.sold?.payment?.cash?.amount !== ""
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              this.handalsellFeilds(e);
                              if (!e.target.checked) {
                                this.setState({
                                  cash_amount: 0,
                                });
                              } else {
                                this.setState({
                                  cash_amount:
                                    productDetail?.sold?.payment?.cash?.amount,
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="pb-1">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="cash"
                            className="ms-2 fs-12"
                          >
                            Cash
                          </label>
                        </div>
                      </div>
                      <div className="col-8">
                        {(this.state.isSold_cash || this.state.is_cash) && (
                          <input
                            type="number"
                            onInput={(e) =>
                              (e.target.value = e.target.value.slice(0, 7))
                            }
                            onChange={this.handalsellFeilds}
                            className="form-control ms-2"
                            style={{ width: "6.25rem", height: "1.938rem" }}
                            name="cash_amount"
                            defaultValue={
                              productDetail?.sold?.payment?.cash?.amount > 0
                                ? productDetail?.sold?.payment?.cash?.amount
                                : ""
                            }
                            onBlur={this.handalsellFeilds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <Dropdown.Divider /> */}
                  <div className="dropdown-item">
                    <div className="row">
                      <div className="col-4 d-flex align-items-center">
                        <div>
                          <input
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="online"
                            name="online"
                            defaultChecked={
                              productDetail?.sold?.payment?.online?.amount > 0
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              this.handalsellFeilds(e);
                              if (!e.target.checked) {
                                this.setState({
                                  online_amount: 0,
                                });
                              } else {
                                this.setState({
                                  online_amount:
                                    productDetail?.sold?.payment?.online
                                      ?.amount,
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="pb-1">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="online"
                            className="ms-2 fs-12"
                          >
                            Online
                          </label>
                        </div>
                      </div>
                      <div className="col-8">
                        {(this.state.isSold_online || this.state.is_online) && (
                          <input
                            type="number"
                            onInput={(e) =>
                              (e.target.value = e.target.value.slice(0, 7))
                            }
                            className="form-control ms-2"
                            style={{ width: "6.25rem", height: "1.938rem" }}
                            name="online_amount"
                            defaultValue={
                              productDetail?.sold?.payment?.online?.amount > 0
                                ? productDetail?.sold?.payment?.online?.amount
                                : ""
                            }
                            onBlur={this.handalsellFeilds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownButton>
              ) : (
                <DropdownButton
                  variant="primary"
                  id="dropdown-item-button"
                  title="Mode of Payment"
                  className="mb-2 pt-4 "
                  // style={{ width: "6.25rem",height:"1.938rem" }}
                >
                  <div className="dropdown-item button-size fs-12">
                    <div className="row">
                      <div className="col-4 d-flex align-items-center">
                        <div>
                          <input
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="cash"
                            name="cash"
                            onChange={this.handalsellFeilds}
                          />
                        </div>
                        <div className="pb-1">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="cash"
                            className="ms-2"
                          >
                            Cash
                          </label>
                        </div>
                      </div>
                      <div className="col-8">
                        {this.state.is_cash && (
                          <input
                            type="number"
                            className="form-control ms-2"
                            onInput={(e) =>
                              (e.target.value = e.target.value.slice(0, 7))
                            }
                            style={{ width: "6.25rem", height: "1.938rem" }}
                            name="cash_amount"
                            placeholder="0"
                            onBlur={this.handalsellFeilds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <Dropdown.Divider /> */}
                  <div className="dropdown-item">
                    <div className="row">
                      <div className="col-4 d-flex align-items-center">
                        <div>
                          <input
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="online"
                            name="online"
                            onChange={this.handalsellFeilds}
                          />
                        </div>
                        <div className="pb-1">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="online"
                            className="ms-2 fs-12"
                          >
                            Online
                          </label>
                        </div>
                      </div>
                      <div className="col-8">
                        {this.state.is_online && (
                          <input
                            type="number"
                            onInput={(e) =>
                              (e.target.value = e.target.value.slice(0, 7))
                            }
                            className="form-control ms-2"
                            style={{ width: "6.25rem", height: "1.938rem" }}
                            name="online_amount"
                            placeholder="0"
                            onBlur={this.handalsellFeilds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownButton>
              )}

              <hr className="mt-3 " style={{ paddingLeft: "50rem" }} />
              <div className="off-can mt-3">
                <div
                  className="off-can-data pe-lg-0 me-2"
                  style={{ position: "relative" }}
                >
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Sold to
                  </p>
                  {sellEdit ? (
                    <>
                      <FormControl
                        className="mt-3 w-auto sell_client_input fs-12"
                        type="text"
                        onBlur={() => {
                          this.setState({
                            ...this.state,

                            showSoldSearchPopup: false,
                          });
                        }}
                        onChange={(e) => {
                          this.setState({
                            ...this.state,
                            client_name: e.target.value,
                            showSoldSearchPopup: true,
                          });
                          this.setClientNameAndMobile(e);
                        }}
                        value={
                          this.state.client_name === null
                            ? this.state.productDetail?.sold?.to
                            : this.state.client_name
                        }
                        defaultValue={this.state.productDetail?.sold?.to}
                        name="client_name"
                        required
                      />
                      {this.state.showSoldSearchPopup && (
                        <>
                          {this.state.PopupsearchData.length > 0 && (
                            <div
                              className="search-popup"
                              style={{ top: "4.688rem" }}
                            >
                              {this.state.PopupsearchData.map((item, i) => (
                                <div
                                  key={i}
                                  className="search-popup-data cursor-pointer"
                                  onClick={() => {
                                    this.setState({
                                      ...this.state,
                                      client_name: item.from,
                                      client_mobile: item.phone,
                                    });
                                    setTimeout(() => {
                                      this.setState({
                                        ...this.state,
                                        showSoldSearchPopup: false,
                                      });
                                    }, 500);
                                  }}
                                >
                                  {`${item.from} (${item.phone})`}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <FormControl
                      className="mt-3 w-auto sell_client_input fs-12"
                      type="text"
                      placeholder="Client Name"
                      name="client_name"
                      value={this.state.client_name}
                      defaultValue={this.state?.client_name}
                      // value={this.state.client_name}
                      onChange={(e) => {
                        this.setState({
                          ...this.state,
                          client_name: e.target.value,
                          showSoldSearchPopup: true,
                        });
                        this.setClientNameAndMobile(e);
                      }}
                      required
                    />
                  )}
                  {this.state.showSoldSearchPopup && (
                    <>
                      {this.state.PopupsearchData.length > 0 && (
                        <div
                          className="search-popup"
                          style={{ top: "4.688rem" }}
                        >
                          {this.state.PopupsearchData.map((item, i) => (
                            <div
                              key={i}
                              className="search-popup-data cursor-pointer"
                              onClick={() => {
                                this.setState({
                                  ...this.state,
                                  client_name: item.from,
                                  client_mobile: item.phone,
                                });
                                setTimeout(() => {
                                  this.setState({
                                    ...this.state,
                                    showSoldSearchPopup: false,
                                  });
                                }, 500);
                              }}
                            >
                              {`${item.from} (${item.phone})`}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Client's Mobile No.
                  </p>
                  {sellEdit ? (
                    <FormControl
                      className="mt-3 w-auto sell_client_mob_input fs-12"
                      type="number"
                      onClick={() => {
                        this.setState({
                          ...this.state,
                          showSoldSearchPopup: false,
                        });
                      }}
                      maxLength="10"
                      defaultValue={this.state.productDetail?.sold.phone}
                      value={
                        this.state.client_mobile === null
                          ? this.state.productDetail?.sold.phone
                          : this.state.client_mobile
                      }
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          this.setState({
                            client_mobile: e.target.value,
                          });
                        }
                      }}
                      name="client_number"
                      required
                    />
                  ) : (
                    //searching
                    <FormControl
                      className="mt-3 w-auto sell_client_mob_input fs-12"
                      placeholder="Mobile Number"
                      maxLength="10"
                      value={parseInt(this.state.client_mobile)}
                      onClick={() => {
                        this.setState({
                          ...this.state,
                          showSoldSearchPopup: false,
                        });
                      }}
                      name="client_number"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          this.setState({
                            client_mobile: e.target.value,
                            // showSoldSearchPopup: true,
                          });
                        }
                      }}
                      required
                    />
                  )}
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Client's Address
                  </p>
                  {sellEdit ? (
                    <Form.Control
                      className="mt-3 w-auto sell-modal-text sell-text fs-12"
                      as="textarea"
                      name="client_address"
                      defaultValue={productDetail?.sold?.client_address}
                      required
                    />
                  ) : (
                    <Form.Control
                      className="mt-3 w-auto sell-modal-text sell-text fs-12"
                      as="textarea"
                      name="client_address"
                      required
                    />
                  )}
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    GST (%)
                  </p>
                  <div className="d-flex align-items-center">
                    {sellEdit ? (
                      <>
                        <input
                          type="checkbox"
                          className="mt-3"
                          name="gst"
                          checked={
                            // this.state.productDetail?.sold?.is_gst
                            //   ? true
                            //   : false
                            this.state.isSold_gst ? true : false
                          }
                          onChange={(e) => {
                            this.handalsellFeilds(e);

                            this.setState({
                              ...this.state,
                              is_gst: e.target.checked,
                              isSold_gst: e.target.checked,
                            });
                          }}
                        />
                        {(this.state.isSold_gst || this.state.is_gst) && (
                          <input
                            type="text"
                            name="gst_value"
                            onChange={this.handalsellFeilds}
                            className="mt-3 w-50 d-inline-flex ms-3"
                            defaultValue={
                              this.state.productDetail?.sold?.gst?.gst_rate >
                                0 &&
                              this.state.productDetail?.sold?.gst?.gst_rate !==
                                ""
                                ? this.state.productDetail?.sold?.gst?.gst_rate
                                : gst_per > 0 && gst_per !== ""
                                ? gst_per
                                : 18
                            }
                            required
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          className="mt-3"
                          name="gst"
                          onChange={(e) => {
                            this.handalsellFeilds(e);
                            this.setState({
                              gst_per: gst_per ? gst_per : 18,
                            });
                          }}
                        />
                        {is_gst && (
                          <input
                            type="text"
                            name="gst_value"
                            onChange={(e) => {
                              this.handalsellFeilds(e);
                            }}
                            className="mt-3 w-50 d-inline-flex ms-3"
                            defaultValue={gst_per ? gst_per : 18}
                            required
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="off-cans my-3">
                <div className="off-can-data  pe-lg-0 col-5">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Email Id
                  </p>
                  {sellEdit ? (
                    <FormControl
                      className="mt-3 fs-12 "
                      type="email"
                      defaultValue={productDetail?.sold?.email}
                      name="client_email"
                      maxLength={30}
                      required
                    />
                  ) : (
                    <FormControl
                      className="mt-3 fs-12 "
                      type="email"
                      name="client_email"
                      maxLength={30}
                      required
                    />
                  )}
                </div>
                {sellEdit
                  ? (this.state.isSold_gst || this.state.is_gst) && (
                      <>
                        <div className="off-can-data me-3 pe-lg-0 ps-3 col-2">
                          <p className="text-nowrap fs-w700 text-muted fs-14">
                            GST Comments
                          </p>
                          <FormControl
                            className="mt-3 w-100 fs-12"
                            type="text"
                            defaultValue={productDetail?.sold?.gst?.gst_number}
                            name="gst_number"
                            required
                          />
                        </div>
                      </>
                    )
                  : is_gst && (
                      <>
                        <div className="off-can-data me-3 pe-lg-0 ps-3  ">
                          <p className="text-nowrap fs-w700 text-muted fs-14">
                            GST Comments
                          </p>
                          <FormControl
                            className="mt-3 col-6 ms-2 fs-12"
                            type="text"
                            name="gst_number"
                            required
                          />
                        </div>
                      </>
                    )}
                <div className="off-can-data ms-5 pe-lg-0 pe-3 col-6">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Total Selling Price
                  </p>
                  <p className="mt-3 text-muted fs-14 sell-modal-text">
                    {(is_gst || this.state.isSold_gst) &&
                      parseInt(this.state.sell_price) +
                        parseInt(this.state.sell_price) *
                          ((isNaN(parseInt(this.state.gst_per))
                            ? 0
                            : parseInt(this.state.gst_per)) /
                            100)}
                    {(!is_gst || !this.state.isSold_gst) &&
                      parseInt(this.state.sell_price)}
                    /-
                  </p>
                </div>
              </div>
              <hr className="mt-3 " style={{ paddingLeft: "50rem" }} />

              <div className="off-can my-4">
                {sellEdit ? (
                  <div className="off-can-data pe-lg-0 pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Balance Amount
                    </p>
                    <p className="mt-3 text-muted fs-14">
                      {(is_gst || this.state.isSold_gst) &&
                        parseInt(this.state.sell_price) -
                          parseInt(
                            receivedTotal !== "" && receivedTotal != 0
                              ? receivedTotal
                              : 0
                          ) +
                          parseInt(this.state.sell_price) *
                            ((isNaN(parseInt(this.state.gst_per))
                              ? 0
                              : parseInt(this.state.gst_per)) /
                              100)}
                      {(!is_gst || !this.state.isSold_gst) &&
                        parseInt(this.state.sell_price) -
                          parseInt(
                            receivedTotal !== "" && receivedTotal != 0
                              ? receivedTotal
                              : 0
                          )}
                      /-
                    </p>
                  </div>
                ) : (
                  <div className="off-can-data pe-lg-0 pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Balance Amount
                    </p>
                    <p className="mt-3 text-muted fs-14">
                      {parseInt(
                        this.state.sell_price_with_gst > 0
                          ? Math.sign(
                              this.state.sell_price_with_gst -
                                parseInt(this.state?.received_amount)
                            ) === -1
                            ? 0
                            : this.state.sell_price_with_gst -
                              (parseInt(this.state?.received_amount)
                                ? parseInt(this.state?.received_amount)
                                : 0)
                          : parseInt(this.state.sell_price_with_gst === 0)
                          ? Math.sign(balance_amount) === -1
                            ? 0
                            : balance_amount
                            ? balance_amount
                            : 0
                          : Math.sign(balance_amount) === -1
                          ? 0
                          : balance_amount
                          ? balance_amount
                          : this.state.sell_price -
                              this.state?.received_amount || 0
                      )}
                      /-
                    </p>
                  </div>
                )}

                <div className="off-can-data pe-lg-0 pe-3">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Profit/Loss
                  </p>
                  {Math.sign(pl) === -1 ? (
                    <p className="mt-3 text-danger fs-14">{-pl}/-</p>
                  ) : (
                    <p className="mt-3 text-success fs-14">{pl}/-</p>
                  )}
                </div>
                <div className="off-can-data pe-lg-0 pe-3">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Profit/Loss %
                  </p>
                  {Math.sign(pl_percent) === -1 ? (
                    <p className="mt-3 text-danger fs-14">
                      {parseInt(-pl_percent)}
                    </p>
                  ) : (
                    <p className="mt-3 text-success fs-14">
                      {parseInt(pl_percent)}
                    </p>
                  )}
                </div>
                {sellEdit ? (
                  <>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Comments
                      </p>
                      {Math.sign(pl) === -1 ? (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          You are selling at a loss.
                        </p>
                      ) : Math.sign(pl) > 0 ? (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          Good! You are selling at a profit.
                        </p>
                      ) : (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          No Profit,No Loss.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="off-can-data pe-lg-0 pe-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        Comments
                      </p>
                      {Math.sign(pl) === -1 ? (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          You are selling at a loss.
                        </p>
                      ) : Math.sign(pl) > 0 ? (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          Good! You are selling at a profit.
                        </p>
                      ) : (
                        <p className="mt-3 text-muted fs-14 sell-modal-text">
                          No Profit,No Loss.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {sellEdit ? (
                <div className="ms-2 mt-3 fs-12 fw-600  ">
                  <Button
                    type="submit"
                    variant="primary  btn-sm"
                    className=" d-flex item-align-center"
                    style={{ padding: ".3rem 1rem" }}
                    // onClick={this.handleSellSubmit}
                  >
                    {this.state.isInvoiceLoading ? (
                      <SyncLoader size={4} color={"#fff"} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <Modal
                    show={this.state.invoiceModalShow}
                    size="lg"
                    // fullscreen={true}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    animation={true}
                    backdrop={"static"}
                    autoFocus={true}
                  >
                    <Modal.Header closeButton={false}>
                      <Modal.Title
                        className="text-primary fs-6 fs-w600"
                        id="contained-modal-title-vcenter"
                      >
                        Invoice
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-muted fs-6">
                      <Invoice invoiceState={this.state} />
                    </Modal.Body>
                    <Modal.Footer className="ms-auto">
                      <Button
                        variant="danger fs-12 fs-w600"
                        onClick={() => {
                          this.setState({ invoiceModalShow: false });
                          this.handleShow(null);
                        }}
                      >
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <div className="row mt-3">
                    <div className="col-6">
                      <button
                        type="submit"
                        disabled={this.state.isInvoiceLoading}
                        style={{ minWidth: "6.25rem" }}
                        className="btn text-success-light "
                      >
                        {this.state.isInvoiceLoading ? (
                          <SyncLoader size={4} color={"#fff"} />
                        ) : (
                          "Sell This Item"
                        )}
                      </button>
                    </div>
                    <div className="col-6">
                      <DropdownButton
                        className="float-end"
                        id="dropdown-item-button"
                        title="Invoice"
                      >
                        <Dropdown.Item
                          as={"button"}
                          className="fs-12"
                          type="submit"
                          name="invoice_button"
                          onClick={() =>
                            this.setState({
                              download_Invoice: true,
                            })
                          }
                        >
                          Download
                          <i className="ms-2 fas fa-download fs-12"></i>
                        </Dropdown.Item>
                        <Dropdown.Item className="fs-12">
                          Share<i className="ms-2 fas fa-share fs-12"></i>
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>
                  </div>
                </>
              )}
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
        <InvoicePopup state={this.state} setState={this.setState} />

        <Offcanvas
          show={invoiceShow}
          onHide={() => this.handleInvoiceShow(null)}
          placement="end"
          name="end"
        >
          <Offcanvas.Header className="align-items-center">
            <Offcanvas.Title>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn-close me-sm-3 me-1 pt-0 fs-w900"
                  aria-label="Close"
                  onClick={() => this.handleInvoiceShow(null)}
                ></button>
                <div className="text-center">
                  <span className="fs-18 fs-w600 text-primary">
                    Invoice : {productDetail ? `INV${productDetail._id}` : ""}{" "}
                  </span>
                </div>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {productDetail !== null && (
              <>
                <div className="off-can pt-2 pb-3">
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Product Name
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.product}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Model
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.model}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Color
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.color}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">IMEI</p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.imei}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      RAM (in GB)
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.ram}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      HDD (in GB)
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.hdd}
                    </p>
                  </div>
                </div>
                <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />
                <div className="d-flex pt-2 pb-3">
                  <div className="off-can-data pe-3 pe-sm-5">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Selling Date
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {moment(productDetail.sold.sold_at).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="off-can-data pe-3 pe-sm-5">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Selling Price
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.sell_price}
                    </p>
                  </div>
                  <div className="off-can-data pe-3 pe-sm-5">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Money Inflow
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {parseInt(
                        parseInt(productDetail?.sold?.payment?.cash?.amount) +
                          parseInt(productDetail?.sold?.payment?.online?.amount)
                      ) || ""}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Selling Comments
                    </p>
                    <div
                      className={`fs-14 mt-3  ${
                        this.state.width < 420
                          ? "w-100"
                          : productDetail?.sold?.sell_comment?.length > 0 &&
                            "cursor-pointer"
                      }`}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={productDetail.sold.sell_comment}
                    >
                      {this.state.width < 420 ? (
                        <>{productDetail.sold.sell_comment}</>
                      ) : (
                        <>
                          {productDetail.sold?.sell_comment?.length > 30
                            ? `${productDetail?.sold?.sell_comment?.slice(
                                0,
                                30
                              )}...`
                            : productDetail?.sold?.sell_comment}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />
                <div className="off-can pt-2 pb-3">
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Sold To
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.to}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Client’s Mobile No.
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.phone}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Client’s Address
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.client_address}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      GST (%)
                    </p>
                    <p className="fs-14 mt-3 d-flex align-items-center">
                      <input
                        type="checkbox"
                        name="test"
                        checked={productDetail.sold.is_gst ? true : false}
                        disabled
                      />
                      <span className="ms-2">
                        {productDetail.sold.is_gst
                          ? productDetail.sold.gst.gst_rate
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
                <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />
                <div className="off-can pt-2 pb-3">
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Mode of Payment
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail?.sold?.payment?.cash?.amount > 0 &&
                      productDetail?.sold?.payment?.online?.amount > 0
                        ? "Cash & Online "
                        : productDetail?.sold?.payment?.online?.amount > 0
                        ? "Online"
                        : productDetail?.sold?.payment?.cash?.amount > 0 &&
                          "Cash"}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Total Selling Price
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.sell_price +
                        (productDetail?.sold?.gst?.gst_amount
                          ? productDetail?.sold?.gst?.gst_amount
                          : 0)}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Balance Amount
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail?.sold?.gst?.gst_amount > 0
                        ? parseInt(
                            productDetail?.sold?.gst?.gst_amount +
                              productDetail?.sold?.balance
                          )
                        : productDetail?.sold?.balance || 0}
                    </p>
                  </div>
                  <div className="off-can-data pe-3">
                    <p className="text-nowrap fs-w700 text-muted fs-14">
                      Email
                    </p>
                    <p className="fs-14 mt-3 sell-modal-text">
                      {productDetail.sold.email}
                    </p>
                  </div>
                </div>
                <hr className="mt-4 " style={{ paddingLeft: "50rem" }} />
              </>
            )}

            <div className="row mt-3">
              {(
                productDetail?.sold?.balance > 0
                  ? productDetail?.sold?.balance
                  : parseInt(productDetail?.sold?.sell_price) +
                    parseInt(productDetail?.sold?.gst?.gst_amount) -
                    (parseInt(
                      productDetail?.sold?.payment?.cash?.amount > 0
                        ? productDetail?.sold?.payment?.cash?.amount
                        : 0
                    ) +
                      parseInt(
                        productDetail?.sold?.payment?.online?.amount > 0
                          ? productDetail?.sold?.payment?.online?.amount
                          : 0
                      ))
              ) ? (
                <div
                  className="col-6"
                  onClick={() => this.handleSendReminder(productDetail._id)}
                >
                  <button type="button" className="btn btn-primary">
                    <div className="d-flex align-items-center">
                      <div>Send&nbsp;Reminder</div>
                      <div>
                        <i className="ms-2 fas fa-bell fs-12"></i>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="col">
                {/* <div className="col-6" style={{ display: this.state.is_sold ? "" : "none" }}> */}
                <DropdownButton
                  className=" float-end "
                  id="dropdown-item-button"
                  title="Invoice"
                >
                  <Dropdown.Item
                    as="button"
                    className="fs-12 sell-down"
                    onClick={this.downloadInvoice}
                  >
                    Download
                    <i className="ms-2 fas fa-download fs-12"></i>
                  </Dropdown.Item>
                  <Dropdown.Item as="button" className="fs-12">
                    Share<i className="ms-2 fas fa-share fs-12"></i>
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <Modal
          show={this.state.invoiceModalShow}
          size="lg"
          // fullscreen={true}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={true}
          backdrop={"static"}
          autoFocus={true}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title
              className="text-primary fs-6 fs-w600"
              id="contained-modal-title-vcenter"
            >
              Invoice
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-muted fs-6">
            <Invoice invoiceState={this.state} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="ms-auto"
              variant="danger fs-12 fs-w600"
              onClick={() => this.setState({ invoiceModalShow: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.modalShow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={true}
          backdrop={"static"}
          autoFocus={true}
        >
          <Modal.Body className="text-muted fs-6 ">
            <Modal.Title
              className="text-primary fs-6 fs-w600 mb-3"
              id="contained-modal-title-vcenter"
            >
              Delete confirmation!!!!!
            </Modal.Title>

            <p className="mb-2">
              Are you sure to delete this {this.state?.productDetail?.product}{" "}
              from your Bahikhata?
            </p>
            <br />
            <div className="d-flex me-auto">
              <Button
                variant="primary me-2 mb-sm-lg-2 fs-12 fs-w600 "
                onClick={this.handleDeleteProduct}
              >
                Yes, I am sure. Delete it
              </Button>
              <Button
                onClick={() => this.setState({ modalShow: false })}
                variant="secondary fs-12 fs-w600"
              >
                No, Cancel Deletion
              </Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalSoldshow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={true}
          backdrop={"static"}
          autoFocus={true}
        >
          <Modal.Body className="text-muted fs-6 ">
            <Modal.Title
              className="text-primary fs-6 fs-w600 mb-3"
              id="contained-modal-title-vcenter"
            >
              Delete confirmation!
            </Modal.Title>

            <p className="mb-2">
              Are you sure to delete this {this.state?.productDetail?.product}{" "}
              from your Bahikhata?
            </p>
            <br />
            <div className="me-auto">
              <Button
                variant="primary me-2 fs-12 fs-w600 mb-2 mb-sm-0"
                onClick={this.handleDeleteProductsell}
              >
                Yes, I am sure. Delete it
              </Button>
              <Button
                onClick={() => this.setState({ modalSoldshow: false })}
                variant="secondary fs-12 fs-w600"
              >
                No, Cancel Deletion
              </Button>
            </div>
          </Modal.Body>
        </Modal>
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

export default connect(mapStateToProps)(MainTable);
