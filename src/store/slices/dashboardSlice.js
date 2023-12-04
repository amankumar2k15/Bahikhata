import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDashboardProductStatusService } from "../../services/api.service";
import { setType } from "./headerSlice";

const initialState = {
  isLoading: true,
  is_cash: false,
  is_online: false,
  show: false,
  is_sold: false,
  modalShow: false,
  modalSoldshow: false,
  from: moment().format("YYYY-MM-DD"),
  to: moment().format("YYYY-MM-DD"),
  headFrom: moment().format("YYYY-MM-DD"),
  headTo: moment().format("YYYY-MM-DD"),
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
    is_cash: false,
    is_online: false,
    cash: 0,
    online: 0,
    comment: "",
    balance: 0,
    purchaseSearch: false,
  },
  downloadInvoice: false,
  dashboardSearch: false,
  data: "",
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
  },
};










export const fetchInventory = createAsyncThunk(
  "user/fetchInventory",
  async () => {
    const existingInventoryState = getState().inventory;
    const response = await getDashboardProductStatusService(
      data?.postData,
      data?.tab
    )
      .then((res) => {
        const { page, limit, total } = res.data.data;
        useDispatch(setType("all"));
        const soldFIlteredData = res?.data?.data?.products.filter(
          (item) => !item?.sold?.product_id
        );
        let postData = {
          page: page,
          limit: limit,
          total: total,
        };
        let products = res?.data?.data?.products;
        const rows = soldFIlteredData.map((item) => {
          return [
            item.product,
            item?.shashank,
            item.model,
            item.color,
            item.imei,
            item.hdd,
            item.ram,
            moment(item.purchase_at).format("DD/MM/YYYY"),
            item.purchase.from,
            item.purchase.phone,
            item.purchase.purchase_amount,
            parseInt(item.purchase.payment.cash.amount) !== 0 &&
              parseInt(item.purchase.payment.online.amount) !== 0
              ? "Cash & Online"
              : item.purchase.payment.cash.amount !== 0
                ? "Cash"
                : "Online",
            parseInt(item.purchase.payment.cash.amount) +
            parseInt(item.purchase.payment.online.amount),
            item.purchase.balance,
            item.purchase.comment,
          ];
        });
        return {
          rows,
          postData,
          products,
        };
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
    return response;
  }
);







const dashboardSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.purchaseSearch = true;
      if (window.location.pathname === "/bahikhata/dev/app/sales") {
        if (action.payload.body.sold_type) {
          let soldType = action.payload.body.sold_type;
          if (action.payload.body.from !== "") {
            state.tableHeading =
              "Items sold from: " +
              moment(action.payload.body.from).format("DD/MM/YYYY") +
              " to " +
              moment(action.payload.body.to).format("DD/MM/YYYY") +
              ", showing : " +
              (soldType === "full"
                ? "Fully paid"
                : soldType === "half"
                  ? "Partially Paid"
                  : "All");
          } else {
            state.tableHeading =
              "Items sold today, showing : " +
              (soldType === "full"
                ? "Fully paid"
                : soldType === "half"
                  ? "Partially Paid"
                  : "All");
          }
        } else {
          if (
            action.payload.body.from !== "" &&
            !action.payload.body.search_btn
          ) {
            state.tableHeading =
              "Items sold from: " +
              moment(action.payload.body.from).format("DD/MM/YYYY") +
              " to " +
              moment(action.payload.body.to).format("DD/MM/YYYY") +
              ", showing : All";
          } else {
            state.tableHeading =
              action.payload.searchData.length > 1
                ? "Your Searched items"
                : "Your Searched item";
          }
        }
      } else if (window.location.pathname === "/bahikhata/dev/app/purchase") {
        if (action.payload.body.search_btn) {
        }
        if (
          action.payload.body.from !== "" &&
          !action.payload.body.search_btn
        ) {
          state.tableHeading =
            "Items purchased from: " +
            moment(action.payload.body.from).format("DD/MM/YYYY") +
            " to " +
            moment(action.payload.body.to).format("DD/MM/YYYY");
        } else {
          state.tableHeading =
            action.payload.searchData.length > 1
              ? "Your Searched items"
              : "Your Searched item";
        }
      }

      state.postData.total = action.payload.searchData.data.data.total;
      if (window.location.pathname === "/bahikhata/dev/app/sales") {
        state.products = action.payload.searchData.data.data.products.filter(
          (item) => item.is_sold
        );
        state.tableRows = action.payload.searchData.data.data.products.map(
          (item) => {
            if (item.sold.balance) {
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
                parseInt(item.purchase.payment.cash.amount) !== 0 &&
                  parseInt(item.purchase.payment.online.amount) !== 0
                  ? "Cash & Online"
                  : parseInt(item.purchase.payment.cash.amount) !== 0
                    ? "Cash"
                    : "Online",
                parseInt(item.purchase.payment.cash.amount) +
                parseInt(item.purchase.payment.online.amount),
                item.purchase.balance,
                item.purchase.comment,
              ];
            }
          }
        );
      } else {
        state.products = action.payload.searchData.data.data.products;
        state.tableRows = action.payload.searchData.data.data.products.map(
          (item) => {
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
              parseInt(item.purchase.payment.cash.amount) !== 0 &&
                parseInt(item.purchase.payment.online.amount) !== 0
                ? "Cash & Online"
                : parseInt(item.purchase.payment.cash.amount) !== 0
                  ? "Cash"
                  : "Online",
              parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
              item.purchase.balance,
              item.purchase.comment,
            ];
          }
        );
      }
    },
    setSellDeleteSearch: (state, action) => {
      const { list, productId } = action.payload;
      const temp = list.filter((item) => item._id !== productId);

      state.products = temp;
    },
    setCurrentTabOnDashboard: (state, action) => {
      state.currentTab = action.payload;
    },
    resetTableHeading: (state, action) => {
      state.tableHeading = initialState.tableHeading;
    },
    setdashboardSearch: (state, action) => {
      state.dashboardSearch = true;
    },
    resetSearch: (state, action) => {
      state.purchaseSearch = false;
    },
    setProductDetails: (state, action) => {
      state.productDetail = action.payload.productDetail;
    },
    setProductDetailsAndSellID: (state, action) => {
      state.productDetail = action.payload.productDetail;
      state.sellProductId = action.payload.sellProductId;
    },
    setShow: (state, action) => {
      state.show = action.payload;
    },
    setModalShow: (state, action) => {
      state.modalShow = !state.modalShow;
    },
    setSellPrice: (state, action) => {
      state.sell_price = action.payload;
    },
    setGST: (state, action) => {
      state.is_gst = action.payload;
    },
    setGstValue: (state, action) => {
      state.gst_per = action.payload;
    },
    setCash: (state, action) => {
      state.is_cash = action.payload;
    },
    setOnline: (state, action) => {
      state.is_online = action.payload;
    },
    setCashAmount: (state, action) => {
      state.cash_amount = action.payload;
    },
    setOnlineAmount: (state, action) => {
      state.online_amount = action.payload;
    },
    setClientDetails: (state, action) => {
      state.clientDetails = action.payload;
    },
    setSold: (state, action) => {
      state.is_sold = action.payload;
    },
    setInvoiceShow: (state, action) => {
      state.invoiceShow = action.payload;
    },
    setReceivedAmount: (state, action) => {
      state.received_amount = action.payload || 0;
    },
    setBalanceAmount: (state, action) => {
      state.balance_amount = action.payload || 0;
    },
    setProfitLoss: (state, action) => {
      state.pl = action.payload || 0;
    },
    setProfitLossPercent: (state, action) => {
      state.pl_percent = action.payload || 0;
    },
    setProfitLossDetails: (state, action) => {
      state.sell_price_with_gst = action.payload.sell_price_with_gst;
      // state.pl = action.payload.pl;
      // state.pl_percent = action.payload.pl_percent;
      // state.balance_amount = action.payload.balance_amount;
      // state.received_amount = action.payload.received_amount;
    },
    setProductEditData: (state, action) => {
      state.productEditData = action.payload.productEditData;
      state.rowId = action.payload.rowId;
      state.rowEdit = action.payload.rowEdit;
      state.purchaseId = action.payload.purchaseId;
    },
    getProductEditData: (state, action) => {
      const { name, value, checked } = action.payload.productEditData.target;
      let productEditData = state.productEditData;
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
            productEditData.cash = 0;
            productEditData.is_cash = isCashChecked;
          }
          productEditData.is_cash = isCashChecked;
          break;
        case "onlineChecked":
          let isOnlineChecked = checked ? true : false;
          if (!isOnlineChecked) {
            productEditData.online = 0;
            productEditData.is_online = isOnlineChecked;
          }
          productEditData.is_online = isOnlineChecked;
          break;
        case "cash":
          productEditData.cash = value;
          productEditData.balance = parseInt(productEditData.cash || 0);
          break;
        case "online":
          productEditData.online = value;
          productEditData.balance = parseInt(productEditData.online || 0);
          break;
        case "comment":
          productEditData.comment = value;
          break;
        default:
          break;
      }
      state.productEditData = productEditData;
    },
    setPurchaseFrom: (state, action) => {
      state.productEditData.purchase_from = action.payload.from;
      state.productEditData.phone = action.payload.phone;
    },
    setRowEdit: (state, action) => {
      state.rowEdit = false;
    },
    setProductEditDataForDel: (state, action) => {
      state.productEditData = action.payload;
    },
    setFrom: (state, action) => {
      state.headFrom = action.payload;
    },
    setTo: (state, action) => {
      state.headTo = action.payload;
    },
    setProductIdForDel: (state, action) => {
      state.productId = {
        _id: action.payload._id,
        index: action.payload.dIndex,
      };
    },
    setFormValid: (state, action) => {
      state.isFormValid = action.payload;
    },
    setFormErrors: (state, action) => {
      state.formErrors = action.payload;
    },
  },
  extraReducers: {
    [fetchInventory.fulfilled]: (state, action) => {
      state.tableRows = action.payload.rows;
      state.postData = action.payload.postData;
      state.products = action.payload.products;
      state.tableHeading = initialState.tableHeading;
      state.isLoading = false;
    },
    [fetchInventory.rejected]: (state, _) => {
      state.tableRows = [];
    },
    [fetchInventory.pending]: (state, _) => {
      state.tableRows = [];
    },
  },
});



export const {
  setSearch,
  setSellPrice,
  resetSearch,
  setProductDetails,
  setProductDetailsAndSellID,
  setShow,
  setGST,
  setGstValue,
  setCash,
  setOnline,
  setCashAmount,
  setOnlineAmount,
  setProfitLossDetails,
  setClientDetails,
  setSold,
  setInvoiceShow,
  setReceivedAmount,
  setBalanceAmount,
  setProductEditData,
  setRowEdit,
  setFormValid,
  setFormErrors,
  getProductEditData,
  setModalShow,
  setProductEditDataForDel,
  setProductIdForDel,
  setdashboardSearch,
  setCurrentTabOnDashboard,
  setProfitLoss,
  setProfitLossPercent,
  resetTableHeading,
  setPurchaseFrom,
  setSellDeleteSearch,
  setFrom,
  setTo,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
