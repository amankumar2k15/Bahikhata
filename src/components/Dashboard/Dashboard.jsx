import moment from "moment";
import React from "react";
import toastr from "toastr";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setDashboardStatus, setType } from "../../store/slices/headerSlice";
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
import { tableHeadings } from "../../constants/buttonHeadings";
import {
  deleteProductService,
  getDashboardProductStatusService,
  purchaseProductupdateService,
  sellProductService,
  getProductDetailById,
  getAdvanceProductStatusService,
  getInventoryReport,
  getKhataStatusService,
  getDashboardStatusService,
  getSearchPurchaseUser,
} from "../../services/api.service";
import DynamicPagination from "../../utils/DynamicPagination";
import NoData from "../../utils/NoData";
import { PurchaseForm } from "./../PurchaseForm";
import Invoice from "./Invoice";
import {
  fetchInventory,
  getProductEditData,
  setBalanceAmount,
  setCash,
  setCashAmount,
  setClientDetails,
  setFormErrors,
  setFormValid,
  setGST,
  setGstValue,
  setInvoiceShow,
  setOnline,
  setOnlineAmount,
  setProductDetailsAndSellID,
  setProductEditData,
  setProfitLossDetails,
  setReceivedAmount,
  setRowEdit,
  setSellPrice,
  setShow,
  setSold,
  setModalShow,
  setProductEditDataForDel,
  setProductIdForDel,
  setProfitLoss,
  setProfitLossPercent,
} from "../../store/slices/dashboardSlice";
import { fetchProducts } from "../../store/slices/productsSlice";
import history from "../../history";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import {
  setActiveToggle,
  setCurentTab,
  setKhataStatus,
  setToggle,
} from "../../store/slices/headerSlice";
import SearchPopup from "../Header/SearchPopup";
import { SyncLoader } from "react-spinners";

















class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditLoader: false,
      is_cash: false,
      is_online: false,
      show: false,
      is_sold: false,
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
      currentTab: "Inventory",
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
      gst_per: 18,
      invoiceShow: false,
      isFormValid: false,
      rowEdit: false,
      rowId: null,
      purchaseId: null,
      clientDetails: {},
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
        width: 0,
        height: 0,
      },
      date: new Date().toISOString().slice(0, 10),
      showSearchPopup: false,
      showSoldSearchPopup: false,
      PopupsearchData: [],
      client_name: "",
      client_mobile: "",
      isInvoiceLoading: false,
      download_Invoice: false,
    };
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
      PopupsearchData: response.data.data,
    });
    // setData(response.data.data);
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
  handleShow = (ProductId) => {
    if (ProductId) {
      getProductDetailById(ProductId).then((res) => {
        this.props.dispatch(
          setProductDetailsAndSellID({
            productDetail: res.data.data,
            sellProductId: ProductId,
          })
        );

        // this.setState({
        //   productDetail: res.data.data,
        //   sellProductId: ProductId,
        // });
      });
    }
    this.props.dispatch(setSellPrice(0));
    this.props.dispatch(setProfitLoss(0));
    this.props.dispatch(setProfitLossPercent(0));
    this.props.dispatch(setBalanceAmount(0));
    this.props.dispatch(setReceivedAmount());

    this.props.dispatch(setCash(""));
    this.props.dispatch(setOnline(""));
    this.props.dispatch(setCashAmount(""));
    this.props.dispatch(setOnlineAmount(""));
    this.props.dispatch(setShow());
    this.props.dispatch(setProfitLossDetails(0));
    this.props.dispatch(setGST(false));
    this.props.dispatch(setGstValue(18));
    // this.setState({
    //   show: !this.state.show,
    // });
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
  handlePagination = (page) => {
    const { postData } = this.state;

    postData.page = page;
    this.props.dispatch(setType("all"));
    this.props.dispatch(fetchInventory({ postData, tab: "dashboard" }));
    // this.setState(
    //   {
    //     postData: postData,
    //   },
    //   this.getAllInventory("dashboard")
    // );
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
  downloadInvoice = () => {
    this.props.dispatch(setInvoiceShow(true));
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
  handleDeleteProduct = () => {
    deleteProductService(this.props.inventory.productId._id)
      .then((res) => {
        this.getDashboardStatus();
        this.props.dispatch(setType("all"));
        this.props.dispatch(
          fetchInventory({
            postData: this.props.inventory.postData,
            tab: "dashboard",
          })
        );
        toast.success("Product deleted successfully", { timeOut: 3000 });
        this.props.dispatch(setModalShow());
        // this.setState({
        //   products: this.state.products.filter(
        //     (item) => item._id !== this.state.productId._id
        //   ),
        //   tableRows: this.state.tableRows.filter(
        //     (item, index) => index !== this.state.productId.index
        //   ),
        //   modalShow: false,
        // });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  getAllInventory = (tab) => {
    getDashboardProductStatusService(this.state.postData, tab)
      .then((res) => {
        const { page, limit, total } = res.data.data;
        const soldFIlteredData = res?.data?.data?.products.filter(
          (item) => !item?.sold?.product_id
        );
        this.props.dispatch(setType("all"));
        this.setState({
          postData: {
            page: page,
            limit: limit,
            total: total,
          },
          products: soldFIlteredData,

          // products: res.data.data.products,
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
  hendelAmounts = () => {
    let price;
    const inventoryState = this.props.inventory;
    // if (this.props.inventory.is_gst) {
    //   price =
    //     (parseInt(inventoryState.sell_price) *
    //       parseInt(inventoryState.gst_per)) /
    //     100;
    // } else {
    //   price =
    //     parseInt(inventoryState.sell_price_with_gst) -
    //     parseInt(inventoryState.sell_price);
    // }
    let profit = inventoryState.sell_price
      ? inventoryState.sell_price -
        inventoryState.productDetail.purchase.purchase_amount
      : 0;
    let in_per =
      (profit / inventoryState.productDetail.purchase.purchase_amount) * 100;
    let balance =
      parseInt(inventoryState.sell_price) -
      parseInt(inventoryState.received_amount);

    let received =
      parseInt(inventoryState.online_amount) +
      parseInt(inventoryState.cash_amount);

    // this.props.dispatch(
    //   setProfitLossDetails({
    //     sell_price_with_gst: inventoryState.is_gst
    //       ? price + parseInt(inventoryState.sell_price)
    //       : 0,
    // pl: profit,
    // pl_percent: in_per,
    // balance_amount: isNaN(balance) ? 0 : balance,
    // received_amount: received,
    //   })
    // );

    // let received = inventoryState.is_cash
    // ? parseInt(inventoryState.cash_amount)
    // : inventoryState.is_online
    // ? parseInt(inventoryState.cash_amount)
    // : inventoryState.is_cash && inventoryState.is_online
    // ? parseInt(inventoryState.cash_amount) +
    //   parseInt(inventoryState.cash_amount)
    // : 0;
    // this.setState({
    //   sell_price_with_gst: inventoryState.is_gst
    //     ? price + parseInt(inventoryState.sell_price)
    //     : 0,
    //   pl: profit,
    //   pl_percent: in_per,
    //   balance_amount:
    //     parseInt(inventoryState.sell_price) -
    //     (parseInt(inventoryState.online_amount) + parseInt(inventoryState.cash_amount)),
    //   received_amount:
    //     parseInt(inventoryState.online_amount) + parseInt(inventoryState.cash_amount),
    // });
  };
  handalsellFeilds = async (event) => {
    const { name, value, checked } = event.target;

    switch (name) {
      case "sell_price":
        this.props.dispatch(setSellPrice(value));
        let profit = value
          ? value - this.props.inventory.productDetail.purchase.purchase_amount
          : 0;
        let in_per =
          (profit /
            this.props.inventory.productDetail.purchase.purchase_amount) *
          100;
        this.props.dispatch(setProfitLoss(profit));
        this.props.dispatch(setProfitLossPercent(in_per));

        // this.setState(
        //   {
        //     sell_price: value,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "gst":
        let isGst = checked ? true : false;
        let pricee;
        this.props.dispatch(setGST(isGst));
        if (isGst) {
          pricee =
            (parseInt(this.props.inventory.sell_price) *
              parseInt(this.props.inventory.gst_per)) /
            100;
        }
        this.props.dispatch(
          setProfitLossDetails({
            sell_price_with_gst: isGst
              ? pricee + parseInt(this.props.inventory.sell_price)
              : 0,
          })
        );
        if (isGst === false) {
          this.props.dispatch(setBalanceAmount(0));
        }

        // this.setState(
        //   {
        //     is_gst: isGst,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "gst_value":
        this.props.dispatch(setGstValue(value));
        let price;
        if (this.props.inventory.is_gst) {
          price =
            (parseInt(this.props.inventory.sell_price) *
              parseInt(value ? value : this.props.inventory.gst_per)) /
            100;
        }

        this.props.dispatch(
          setProfitLossDetails({
            sell_price_with_gst: this.props.inventory.is_gst
              ? price + parseInt(this.props.inventory.sell_price)
              : 0,
          })
        );

        // this.setState(
        //   {
        //     gst_per: value,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "cash":
        let isCash = checked ? true : false;
        this.props.dispatch(setCash(isCash));
        !isCash && this.props.dispatch(setCashAmount(""));
        // this.setState(
        //   {
        //     is_cash: isCash,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "online":
        let isOnline = checked ? true : false;
        this.props.dispatch(setOnline(isOnline));
        !isOnline && this.props.dispatch(setOnlineAmount(""));

        // this.setState(
        // {
        //   is_online: isOnline,
        // },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "cash_amount":
        this.props.dispatch(setCashAmount(value));
        // this.setState(
        //   {
        //     cash_amount: value,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "received_amount":
        this.props.dispatch(setReceivedAmount(value));
        let balance;
        if (this.props.inventory.sell_price_with_gst) {
          balance =
            parseInt(this.props.inventory.sell_price_with_gst) -
            parseInt(value);
          this.props.dispatch(setBalanceAmount(balance));
        } else if (this.props.inventory.sell_price) {
          balance = parseInt(this.props.inventory.sell_price) - parseInt(value);
          this.props.dispatch(setBalanceAmount(balance));
        } else {
          this.props.dispatch(setBalanceAmount(0));
        }
        // this.setState(
        //   {
        //     cash_amount: value,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      case "online_amount":
        this.props.dispatch(setOnlineAmount(value));
        // this.setState(
        //   {
        //     online_amount: value,
        //   },
        // () => {
        this.hendelAmounts();
        // }
        // );
        break;
      default:
        break;
    }

    this.setState({ [name]: value });
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
  handleSellSubmit = async (event) => {
    event.preventDefault();
    this.setState({ ...this.state, isInvoiceLoading: true });
    if (this.props.inventory.received_amount) {
      let receivedCheck =
        (isNaN(parseInt(this.props.inventory.cash_amount))
          ? 0
          : parseInt(this.props.inventory.cash_amount)) +
        (isNaN(parseInt(this.props.inventory.online_amount))
          ? 0
          : parseInt(this.props.inventory.online_amount));
      if (this.props.inventory.received_amount != receivedCheck) {
        this.setState({ isInvoiceLoading: false });
        toast.error("Received amount is not matching with mode of payment");
        return;
      }
      if (
        this.props.inventory.received_amount >
        parseInt(
          this.props.inventory.sell_price_with_gst
            ? this.props.inventory.sell_price_with_gst
            : this.props.inventory.sell_price
        )
      ) {
        this.setState({ isInvoiceLoading: false });
        toast.error(
          "Received amount should not be more than total selling price"
        );
        return;
      }
    }
    let body = {
      product_id: this.props.inventory.sellProductId,
      sold_at: event.target.elements.sold_at.value,
      sell_price: parseInt(event.target.elements.sell_price.value),
      sell_comment: event.target.elements.sell_comment.value,
      payment: {
        cash: {
          amount: event.target.elements.cash_amount
            ? parseInt(event.target.elements.cash_amount.value)
            : 0,
        },
        online: {
          amount: event.target.elements.online_amount
            ? parseInt(event.target.elements.online_amount.value)
            : 0,
        },
      },
      to: event.target.elements.client_name.value,
      phone: event.target.elements.client_number.value,
      client_address: event.target.elements.client_address.value,
      email: event.target.elements.client_email.value,
      is_gst: event.target.elements.gst.checked ? true : false,
      is_sold: true,
      // gst: {
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
        gst_rate: parseInt(event.target.elements.gst_value.value),
        gst_amount:
          (parseInt(event.target.elements.sell_price.value) *
            parseInt(event.target.elements.gst_value.value)) /
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
    this.props.dispatch(setClientDetails(body));
    // this.setState({
    //   clientDetails: body,
    // });
    if (
      event.target.elements?.invoice_button?.name == "invoice_button" &&
      this.state.download_Invoice === true
    ) {
      this.setState({ ...this.state, isInvoiceLoading: false });
      this.downloadInvoice();
      return;
    }
    sellProductService(body)
      .then((res) => {
        this.getDashboardStatus();
        this.setState({
          show: !this.state.show,
        });
        this.props.dispatch(setSold(true));
        // this.setState({
        //   is_sold: true,
        //   // show: !this.state.show,
        // });
        toast.success(res.data.message, { timeOut: 5000 });
        this.setState({ ...this.state, isInvoiceLoading: false });
        this.props.dispatch(setReceivedAmount());
        this.props.dispatch(setReceivedAmount());
        this.props.dispatch(setCash(0));
        this.props.dispatch(setOnline(0));
        this.props.dispatch(setCashAmount(0));
        this.props.dispatch(setOnlineAmount(0));
        this.props.dispatch(setShow());
        this.props.dispatch(setType("all"));
        this.props.dispatch(
          fetchInventory({
            postData: this.props.inventory.postData,
            tab: "dashboard",
          })
        );

        window.localStorage.setItem("section-update", this.state.currentTab);
      })
      .catch((err) => {
        if (err.response.data) {
          if (
            err.response.data.message.toLowerCase() ===
            "the sold at field is required."
          ) {
            toast.error("Selling date is required.", { timeOut: 5000 });
          } else {
            toast.error(err.response.data.message, { timeOut: 5000 });
          }
        } else {
          toast.error("Please Fill data properly", { timeOut: 5000 });
        }
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
  handlePurchaseEditShow = (rowId, purchaseId) => {
    //editing
    let editData = this.props.inventory;

    let body = {
      productEditData: {
        product: editData.products[rowId].product,
        model: editData.products[rowId].model,
        color: editData.products[rowId].color,
        imei: editData.products[rowId].imei,
        ram: editData.products[rowId].ram,
        hdd: editData.products[rowId].hdd,
        purchase_from: editData.products[rowId].purchase.from,
        phone: editData.products[rowId].purchase.phone,
        purchase_amount: editData.products[rowId].purchase.purchase_amount,
        purchase_at: editData.products[rowId].purchase_at,
        cash: editData.products[rowId].purchase.payment.cash.amount,
        is_cash: editData.products[rowId].purchase.is_cash ? true : false,
        is_online: editData.products[rowId].purchase.is_online ? true : false,
        online: editData.products[rowId].purchase.payment.online.amount,
        comment: editData.products[rowId].purchase.comment,
        balance: editData.products[rowId].purchase.balance,
      },
      rowId: rowId,
      purchaseId: purchaseId,
      rowEdit: true,
    };
    this.props.dispatch(setProductEditData(body));
    // this.setState({
    //   productEditData: {
    //     product: this.state.products[rowId].product,
    //     model: this.state.products[rowId].model,
    //     color: this.state.products[rowId].color,
    //     imei: this.state.products[rowId].imei,
    //     ram: this.state.products[rowId].ram,
    //     hdd: this.state.products[rowId].hdd,
    //     purchase_from: this.state.products[rowId].purchase.from,
    //     phone: this.state.products[rowId].purchase.phone,
    //     purchase_amount: this.state.products[rowId].purchase.purchase_amount,
    //     purchase_at: this.state.products[rowId].purchase_at,
    //     cash: this.state.products[rowId].purchase.payment.cash.amount,
    //     online: this.state.products[rowId].purchase.payment.online.amount,
    //     comment: this.state.products[rowId].purchase.comment,
    //     balance: this.state.products[rowId].purchase.balance,
    //   },
    //   rowId: rowId,
    //   purchaseId: purchaseId,
    //   rowEdit: true,
    // });
    this.setState({
      isFormValid: true,
    });
  };
  validateForm = () => {
    let errors = this.state.formErrors;
    let validateData = this.props.inventory;
    // check product is empty with trim
    if (validateData.productEditData.product.trim() === "") {
      errors.product = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.product = false;
      this.setState({ isFormValid: true });
    }
    // check model is empty with trim
    if (validateData.productEditData.model.trim() === "") {
      errors.model = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.model = false;
      this.setState({ isFormValid: true });
    }

    // check color is empty with trim
    if (validateData.productEditData.color.trim() === "") {
      errors.color = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.color = false;
      this.setState({ isFormValid: true });
    }
    // check imei is empty with trim
    if (validateData.productEditData.imei < 0) {
      errors.imei = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.imei = false;
      this.setState({ isFormValid: true });
    }
    // check ram is empty with trim
    if (validateData.productEditData.ram < 0) {
      errors.ram = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.ram = false;
      this.setState({ isFormValid: true });
    }
    // check hdd is empty with trim
    if (validateData.productEditData.hdd < 0) {
      errors.hdd = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.hdd = false;
      this.setState({ isFormValid: true });
    }
    // check purchase_amount is empty with trim
    if (
      validateData.productEditData.purchase_amount === 0 ||
      validateData.productEditData.purchase_amount === ""
    ) {
      errors.purchase_amount = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.purchase_amount = false;
      this.setState({ isFormValid: true });
    }
    // check purchase_at is empty with trim
    if (validateData.productEditData.purchase_at.trim() === "") {
      errors.purchase_at = true;
      this.setState({ isFormValid: false });

      return;
    } else {
      errors.purchase_at = false;
      this.setState({ isFormValid: true });
    }
    // check cash is empty with trim
    if (
      parseInt(validateData.productEditData.cash) < 0
      // ||
      // validateData.productEditData.cash === ""
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
      parseInt(validateData.productEditData.online) < 0
      // ||
      // validateData.productEditData.online === ""
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
  handlePurchaseEditField = async (event) => {
    this.validateForm();

    this.props.dispatch(
      getProductEditData({
        productEditData: event,
      })
    );
  };
  downloadInventory = async () => {
    const result = await getInventoryReport()
      .then((res) => res.data.data.filePath)
      .then((result) => {
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = result;
        a.click();
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message, { timeOut: 5000 });
        }
      });
  };
  handlePurchaseEdit = async () => {
    this.setState({ isEditLoader: true });
    // call form validation
    this.validateForm();
    let inventory = this.props.inventory;
    if (this.state.isFormValid) {
      // call api
      // format form data
      const formattedFormData = {
        product: inventory.productEditData.product,
        model: inventory.productEditData.model,
        color: inventory.productEditData.color,
        imei: inventory.productEditData.imei,
        ram: inventory.productEditData.ram,
        hdd: inventory.productEditData.hdd,
        purchase_from: inventory.productEditData.purchase_from,
        phone: inventory.productEditData.phone,
        purchase_amount: parseInt(inventory.productEditData.purchase_amount),
        entry_type: "purchase",
        is_cash: inventory.productEditData.is_cash,
        is_online: inventory.productEditData.is_online,
        purchase_at: inventory.productEditData.purchase_at,
        mod: {
          cash: {
            amount: isNaN(parseInt(inventory.productEditData.cash))
              ? ""
              : parseInt(inventory.productEditData.cash),
          },
          online: {
            amount: isNaN(parseInt(inventory.productEditData.online))
              ? ""
              : parseInt(inventory.productEditData.online),
          },
        },
        comment: inventory.productEditData.comment,
      };
      if (
        parseInt(formattedFormData.purchase_amount) <
        (parseInt(inventory.productEditData.cash)
          ? parseInt(inventory.productEditData.cash)
          : 0) +
          parseInt(
            inventory.productEditData.online
              ? inventory.productEditData.online
              : 0
          )
      ) {
        this.setState({ isEditLoader: false });
        toast.error("Paid amount is greater than purchase amount");
        return;
      }

      // call purchase product service
      purchaseProductupdateService(
        inventory.products[inventory.rowId]._id,
        formattedFormData
      )
        .then((res) => {
          this.props.dispatch(setRowEdit());
          this.setState({ isEditLoader: false });
          toast.success(res.data.message, { timeOut: 5000 });
          this.getDashboardStatus();

          window.localStorage.setItem("section-update", this.props.section);
          window.dispatchEvent(new Event("storage"));
          setTimeout(() => {
            this.props.dispatch(setType("all"));
            this.props.dispatch(
              fetchInventory({
                postData: this.props.inventory.postData,
                tab: "dashboard",
              })
            );
            // window.location.reload();
          }, 3000);
        })
        .catch((err) => {
          if (err.response) {
            this.setState({ isEditLoader: false });
            toast.error(err.response.data.message, { timeOut: 5000 });
          }
        });
    } else {
      // this.props.dispatch(setFormValid(false));
      toast.error("Please Add Correct Product data.", { timeOut: 5000 });
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
  updateallfunction = (section) => {
    switch (section) {
      case "Dashboards":
        if (this.state.currentTab === "Inventory") {
          this.getAdvanceProductStatus();
        }
        break;
      default:
        break;
    }
  };

  
  componentDidMount() {
    // this.setState({
    //   tableHeading: "Total Inventory/Stock as of now",
    // });
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.props.dispatch(setType("all"));
    this.props.dispatch(
      fetchInventory({
        postData: this.props.inventory.postData,
        tab: "dashboard",
      })
    );

    // this.props.getDashboardInventoryData();
    // (this.props.dashboardInventory("asdd"))
    // this.getAllInventory("dashboard");
  }
  render() {
    if (this.props?.inventory?.purchaseSearch) {
      var {
        tableHeading,
        formErrors,
        pl,
        isLoading,
        rowEdit,
        rowId,
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
      } = this.props.inventory;
    } else {
      var {
        tableHeading,
        pl,
        rowEdit,
        rowId,
        pl_percent,
        gst_per,
        sell_price,
        isLoading,
        is_gst,
        formErrors,
        postData,
        balance_amount,
        modalShow,
        show,
        products,
        currentTab,
        productDetail,
      } = this.props.inventory;
    }

   
    return (
      <div className="container-fluid mt-3">
        {/* <ToastContainer /> */}

        <div className="row mx-0">
          <div className="p-3 pb-0 card">
            <div className="d-sm-flex justify-content-between">
              <h2 className="text-primary fs-6 fs-w600 mb-3 ms-2">
                {tableHeading}{" "}
              </h2>
              <button
                className="btn btn-outline-secondary btn-sm mb-2 mb-sm-0 ms-2 ms-sm-0 download-inventory d-flex"
                onClick={() => this.downloadInventory()}
                type="submit"
              >
                <span className="me-1">Download Inventory</span>
                {/* <FontAwesomeIcon icon="fa-file-arrow-down" /> */}
                <i className="fa-solid fa-file-arrow-down"></i>
                {/* <FontAwesomeIcon icon="columns" className="" /> */}
              </button>
            </div>
            <InputGroup className="mx-0 px-0">
              <Table responsive>
                <thead>
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
                  <PurchaseForm section={currentTab} />
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
                                  onChange={(e) => this.searchCall(e)}
                                  value={
                                    this.props.inventory.productEditData
                                      .purchase_from
                                  }
                                  defaultValue={data.purchase.from}
                                />
                                {this.state.showSearchPopup && (
                                  <SearchPopup
                                    data={this.state.PopupsearchData}
                                    // setFormData={setFormData}
                                    // formData={this.props.inventory.productEditData}
                                    fromTab="dashboard"
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
                                 "Khata"
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
                                  className={
                                    formErrors.phone
                                      ? "fs-12 border border-danger"
                                      : "fs-12"
                                  }
                                  onChange={(e) =>
                                    this.handlePurchaseEditField(e)
                                  }
                                  value={
                                    this.props.inventory.productEditData.phone
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
                                  name={"purchase_amount"}
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      7
                                    ))
                                  }
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
                                    name={"purchase_amount"}
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.slice(
                                        0,
                                        7
                                      ))
                                    }
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
                                          name="cashChecked"
                                          onChange={(e) =>
                                            this.handlePurchaseEditField(e)
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
                                            this.props.inventory.productEditData
                                              .cash
                                          }
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
                                          className="fs-12 ms-2 fw-400 payment-style"
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
                                            this.props.inventory.productEditData
                                              .online
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
                                data.purchase.payment.online.amount !== "" &&
                                data.purchase.payment.cash.amount !== 0 &&
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
                                    variant="outline-secondary btn-sm fs-12 dropdown-specific-border"
                                    id="dropdown-item-button"
                                    title="Mode of Payment"
                                  >
                                    <div className="dropdown-item">
                                      <div className="row d-flex align-items-center">
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
                                            className="ms-2 fs-12 fw-400 payment-style"
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
                                            style={{ width: "70%" }}
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
                                      <div className="row d-flex align-items-center">
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
                                            style={{ width: "70%" }}
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
                                        data.purchase.payment.online.amount || 0
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
                                          data.purchase.payment.online.amount ||
                                            0
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
                                        data.purchase.payment.online.amount || 0
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
                          <td
                            title={data?.purchase.comment}
                            data-toggle="tooltip"
                            data-placement="top"
                            className={`${
                              this.state.width < 420
                                ? " comment-break  fs-12"
                                : data?.purchase?.comment?.length > 0 &&
                                  "cursor-pointer"
                            }`}
                          >
                            {rowEdit && rowId === dIndex ? (
                              <>
                                <FormControl
                                  name={"comment"}
                                  maxLength="100"
                                  className={" fs-12 border"}
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
                                {rowEdit && rowId === dIndex && (
                                  <FormControl
                                    name={"comment"}
                                    className={"fs-12 border cursor-pointer"}
                                    onChange={(e) =>
                                      this.handlePurchaseEditField(e)
                                    }
                                    defaultValue={data.purchase.comment}
                                  />
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {rowEdit && rowId === dIndex ? (
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn btn-secondary btn-sm me-3 "
                                  onClick={() =>
                                    this.props.dispatch(setRowEdit())
                                  }
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm me-2 "
                                  onClick={() => this.handlePurchaseEdit()}
                                >
                                  <i className=" fas fa-check "></i>
                                </button>
                                {/* editing  */}

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
                              <div className="d-flex">
                                <Button
                                  variant="success btn-sm"
                                  className="l-green"
                                  onClick={() =>
                                    this.handleShow(products[dIndex]._id)
                                  }
                                >
                                  Sell
                                </Button>
                                <Button
                                  variant="primary mx-3 btn-sm"
                                  className="l-blue"
                                  onClick={() =>
                                    this.handlePurchaseEditShow(
                                      dIndex,
                                      products[dIndex]._id
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger btn-sm"
                                  onClick={() => {
                                    this.getDashboardStatus();
                                    this.setState({
                                      productDetail: data,
                                      modalShow: true,
                                    }),
                                      this.props.dispatch(setModalShow());
                                    this.props.dispatch(
                                      setProductEditDataForDel(data)
                                    );
                                    // this.getDashboardStatus();
                                    this.props.dispatch(
                                      setProductIdForDel({
                                        _id: products[dIndex]._id,
                                        index: dIndex,
                                      })
                                    );
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : isLoading ? (
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
                        <td colSpan={tableHeadings.length}>
                          {<NoData type="dashboard" />}
                        </td>
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
            {/* When no data in table */}
            {/* {postData.length <= 0 && <NoData />} */}
          </div>
        </div>

        <Offcanvas
          show={show}
          onHide={() => this.handleShow(null)}
          placement="end"
          name="end"
          className="sell-1"
        >
          <Offcanvas.Header>
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
                  <span className="fs-18 fs-w600 text-primary">
                    Selling the item
                  </span>
                </div>
              </div>
            </Offcanvas.Title>
            <Offcanvas.Title className="fs-18 fs-w600 text-primary text-end">
              {this.props.inventory.is_gst ? "GST Invoice" : "Non GST Invoice"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form
              className="row pt-sm-0 sell_form"
              method="POST"
              onSubmit={this.handleSellSubmit}
            >
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
                <div className="off-can-data pe-lg-0 me-4">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Date
                  </p>
                  <input
                    className="mt-3 fs-12 sell-modal-text w-auto form-control mySpecificDate session-date sell_client_input"
                    type="date"
                    pattern="\d{4}-\d{2}-\d{2}"
                    name={"sold_at"}
                    defaultValue={this.state.date}
                    // required
                  />
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Price
                  </p>
                  <FormControl
                    className="mt-3 w-auto sell-modal-text me-3 fs-12"
                    type="number"
                    placeholder="Selling Price"
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 7))
                    }
                    name="sell_price"
                    onChange={this.handalsellFeilds}
                    required
                  />
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Received
                  </p>
                  <FormControl
                    className="mt-3 w-100 h-0 fs-12 px-0 ps-1"
                    type="number"
                    name="received_amount"
                    placeholder="Received"
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 7))
                    }
                    onChange={this.handalsellFeilds}
                    // value={`${parseInt(this.props.inventory.received_amount)}`}
                    required
                  />
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Selling Comments
                  </p>
                  <FormControl
                    className="mt-3 w-auto fs-12 sell-text"
                    as="textarea"
                    name="sell_comment"
                    maxLength="100"
                  />
                </div>
              </div>
              <DropdownButton
                variant="primary"
                id="dropdown-item-button"
                title="Mode of Payment"
                className="mb-2"
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
                      {this.props.inventory.is_cash && (
                        <input
                          type="number"
                          className="form-control ms-2"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 7))
                          }
                          style={{ width: "6.25rem", height: "1.938rem" }}
                          name="cash_amount"
                          placeholder="0"
                          value={this.props.inventory.cash_amount}
                          onChange={this.handalsellFeilds}
                          // onBlur={this.handalsellFeilds}
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
                      {this.props.inventory.is_online && (
                        <input
                          type="number"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 7))
                          }
                          className="form-control ms-2"
                          style={{ width: "6.25rem", height: "1.938rem" }}
                          name="online_amount"
                          placeholder="0"
                          value={this.props.inventory.online_amount}
                          onChange={this.handalsellFeilds}
                          // onBlur={this.handalsellFeilds}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </DropdownButton>
              <hr className=" mt-3" style={{ paddingLeft: "50rem" }} />
              <div className="off-can mt-3">
                <div
                  className="off-can-data pe-lg-0 me-2"
                  style={{ position: "relative" }}
                >
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Sold to
                  </p>
                  <>
                    <FormControl
                      className="mt-3 w-auto sell_client_input fs-12"
                      type="text"
                      placeholder="Client Name"
                      value={this.state.client_name}
                      name="client_name"
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
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Client's Mobile No.
                  </p>
                  <FormControl
                    className="mt-3 w-auto sell_client_mob_input fs-12"
                    type="number"
                    onClick={() => {
                      this.setState({
                        showSoldSearchPopup: false,
                      });
                    }}
                    onChange={(e) => {
                      if (e.target.value.length <= 10) {
                        this.setState({
                          client_mobile: e.target.value,
                          showSoldSearchPopup: false,
                        });
                      }
                    }}
                    // defaultValue="811234567"
                    value={this.state.client_mobile}
                    placeholder="Mobile Number"
                    name="client_number"
                    required
                  />
                </div>
                <div className="off-can-data pe-lg-0 me-2">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Client's Address
                  </p>
                  <Form.Control
                    className="mt-3 w-auto sell-modal-text sell-text fs-12"
                    as="textarea"
                    name="client_address"
                    required
                  />
                </div>
                <div className="off-can-data pe-lg-0 me-3">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    GST (%)
                  </p>
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="mt-3"
                      name="gst"
                      onChange={this.handalsellFeilds}
                    />
                    {is_gst && (
                      <input
                        type="number"
                        name="gst_value"
                        onChange={this.handalsellFeilds}
                        className="mt-3 w-50 d-inline-flex ms-3"
                        defaultValue={gst_per}
                        required
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="off-cans my-3">
                <div className="off-can-data col-5 pe-lg-0 ">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Email Id
                  </p>
                  <FormControl
                    className="mt-3 fs-12"
                    type="email"
                    name="client_email"
                    maxLength={30}
                    required
                  />
                </div>
                {is_gst && (
                  <>
                    <div className="off-can-data me-3 pe-lg-0 pe-3 ps-3">
                      <p className="text-nowrap fs-w700 text-muted fs-14">
                        GST Comments
                      </p>
                      <FormControl
                        className="mt-3 fs-12"
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
                    {parseInt(this.props.inventory.sell_price_with_gst) > 0
                      ? parseInt(this.props.inventory.sell_price_with_gst)
                      : sell_price}
                    /-
                  </p>
                </div>
              </div>
              <hr className="mt-3" style={{ paddingLeft: "50rem" }} />
              <div className="off-can my-4">
                <div className="off-can-data pe-lg-0 pe-3">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Balance Amount
                  </p>
                  <p className="mt-3 text-muted fs-14">
                    {parseInt(
                      this.props.inventory.sell_price_with_gst > 0
                        ? Math.sign(
                            this.props.inventory.sell_price_with_gst -
                              parseInt(this.state?.received_amount)
                          ) === -1
                          ? 0
                          : this.props.inventory.sell_price_with_gst -
                            (parseInt(this.state?.received_amount)
                              ? parseInt(this.state?.received_amount)
                              : 0)
                        : parseInt(
                            this.props.inventory.sell_price_with_gst === 0
                          )
                        ? Math.sign(balance_amount) === -1
                          ? 0
                          : balance_amount
                          ? balance_amount
                          : 0
                        : Math.sign(balance_amount) === -1
                        ? 0
                        : balance_amount
                        ? balance_amount
                        : this.state.sell_price - this.state?.received_amount ||
                          0
                    )}
                    /-
                  </p>
                </div>
                <div className="off-can-data pe-lg-0 pe-3">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Profit/Loss
                  </p>
                  {Math.sign(pl) === -1 ? (
                    <p className="mt-3 text-danger fs-14">{-pl}/-</p>
                  ) : (
                    <p className="mt-3 text-l-green fs-14">{pl}/-</p>
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
                    <p className="mt-3 text-l-green fs-14">
                      {parseInt(pl_percent)}
                    </p>
                  )}
                </div>
                <div className="off-can-data">
                  <p className="text-nowrap fs-w700 text-muted fs-14">
                    Comments
                  </p>
                  {Math.sign(pl_percent) === -1 ? (
                    <p className="mt-3 text-muted fs-14 sell-modal-text">
                      You are selling at a loss.
                    </p>
                  ) : Math.sign(pl_percent) > 0 ? (
                    <p className="mt-3 text-muted fs-14 sell-modal-text">
                      Good! You are selling at a profit.
                    </p>
                  ) : (
                    <p className="mt-3 text-muted fs-14 sell-modal-text">
                      No Profit,No Loss.
                    </p>
                  )}
                </div>
              </div>
              <Modal
                show={this.props.inventory.invoiceShow}
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
                    className="text-primary  fs-6 fs-w600"
                    id="contained-modal-title-vcenter"
                  >
                    Invoice
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-muted fs-6">
                  <Invoice invoiceState={this.props.inventory} />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="ms-auto"
                    variant="danger fs-12 fs-w600"
                    onClick={() => {
                      this.props.dispatch(setInvoiceShow(false));
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
                    name="sell_button"
                    className="btn text-success-light fs-12"
                    style={{ minWidth: "6.25rem" }}
                  >
                    {this.state.isInvoiceLoading ? (
                      <SyncLoader size={4} color={"#fff"} />
                    ) : (
                      "Sell This Item"
                    )}
                  </button>
                </div>
                <div
                  className="col-6"
                  // disabled={true}
                  // style={{
                  //   display: this.props.inventory.is_sold ? "" : "none",
                  // }}
                >
                  <DropdownButton
                    className="float-end"
                    id="dropdown-item-button"
                    title="Invoice"
                    disabled={this.props.inventory.downloadInvoice}
                  >
                    <Dropdown.Item
                      as="button"
                      className="fs-12"
                      type="submit"
                      name="invoice_button"
                      onClick={() =>
                        this.setState({
                          download_Invoice: true,
                        })
                      }
                      // onClick={this.downloadInvoice}
                      // onClick={this.downloadInvoice}
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
            </Form>
          </Offcanvas.Body>
        </Offcanvas>

        {/* <Modal
          show={this.props.inventory.invoiceShow}
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
              className="text-primary  fs-6 fs-w600"
              id="contained-modal-title-vcenter"
            >
              Invoice
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-muted fs-6">
            <Invoice invoiceState={this.props.inventory} />
          </Modal.Body>
          <Modal.Footer className="ms-auto">
            <Button
              variant="danger fs-12 fs-w600"
              onClick={() => this.props.dispatch(setInvoiceShow(false))}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
        <Modal
          show={modalShow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={true}
          backdrop={"static"}
          autoFocus={true}
        >
          {/* <Modal.Header closeButton={false}> */}
          {/* </Modal.Header> */}
          <Modal.Body className="text-muted fs-6 ">
            <Modal.Title
              className="text-primary fs-6 fs-w600 mb-4"
              id="contained-modal-title-vcenter"
            >
              Delete confirmation!
            </Modal.Title>

            <p className="mb-2">
              Are you sure to delete this {this.state?.productDetail?.product}{" "}
              from your Bahikhata?
            </p>
            <br />
            <div className="d-flex">
              <Button
                variant="primary me-2 fs-12 fs-w600"
                onClick={this.handleDeleteProduct}
              >
                Yes, I am sure. Delete it
              </Button>
              <Button
                onClick={() => this.props.dispatch(setModalShow())}
                variant="secondary fs-12 fs-w600"
              >
                No, Cancel Deletion
              </Button>
            </div>
          </Modal.Body>
          {/* <Modal.Footer className="ms-auto">
          </Modal.Footer> */}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const inventory = state.inventory;
  const header = state.header;
  return {
    inventory,
    header,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     // dispatching  actions
//     getDashboardInventoryData: () => dispatch(fetchInventory),
//   };
// };

export default connect(mapStateToProps)(Dashboard);
