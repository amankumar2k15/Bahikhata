import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { toast } from "react-toastify";
import { khataHeadings, khataTableData } from "../../constants/buttonHeadings";
import {
  TABLE_KHATA_CREDITORS,
  TABLE_KHATA_DEBTORS,
  TABLE_KHATA_INDVIDUAL,
} from "../../constants/tableHeadings";
import {
  getCreditorsAndDebitorslist,
  getIndivisualKhataAll,
} from "../../services/api.service";
import { setCurentTab } from "./headerSlice";

const initialState = {
  mapTableHeading: khataHeadings,
  isLoading: true,
  mapTableData: [],
  balanceToBePaid: 0,
  currentPage: "",
  searchedClient: "",
  editSettle: false,
  products: [],
  productId: null,
  rowId: null,
  tableHeading: TABLE_KHATA_CREDITORS,
  flag: 0,
  payment: null,
  downloadData: "Download Len-Dar Data",
  postData: {
    page: 1,
    limit: 20,
    total: 0,
  },
};
export const fetchKhata = createAsyncThunk("khata/fetchKhata",(_, { getState, dispatch }) => {
    let { page, limit } = initialState.postData;
    const header = getState().header;
    const pathName = window.location.pathname;
    let type;
    if (pathName === "/bahikhata/dev/app/khata") {
      type = "creditors";
      dispatch(setCurentTab({ currentTab: "Creditors" }));
    } else if (pathName === "/bahikhata/dev/app/debtors") {
      type = "debtors";
      dispatch(setCurentTab({ currentTab: "Debtors" }));
    } else {
      type = "clientKhata";
      dispatch(setCurentTab({ currentTab: "Client khata" }));
      const response = getIndivisualKhataAll({ page: page, limit: limit })
        .then((res) => {
          const { page, limit, total } = res.data.data;
          let postData = {
            page: page,
            limit: limit,
            total: total,
          };
          const emptyFiltered = res?.data?.data?.khata.filter(
            (item) => item.type && !item?.sold?.to
          );

          const toRemove = new Set(emptyFiltered);
          const difference = res?.data?.data?.khata.filter(
            (x) => !toRemove.has(x)
          );
          const rows = difference.map((item) => {
            return {
              row: [
                item.type
                  ? item?.sold?.to
                    ? item?.sold?.to
                    : "NA"
                  : item.purchase.from,
                item.type
                  ? item?.sold?.phone
                    ? item?.sold?.phone
                    : "NA"
                  : item.purchase.phone,
                item.product,
                item.model,
                item.color,
                item.imei,
                item.ram,
                item.hdd,
                item.type
                  ? "NA"
                  : moment(item.purchase_at).format("DD/MM/YYYY"),
                item.type ? "NA" : item.purchase.purchase_amount,
                item.type
                  ? "NA"
                  : isNaN(
                    parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount)
                  )
                    ? 0
                    : parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount),
                item.type
                  ? "NA"
                  : item.purchase.payment.cash.amount !== 0 &&
                    item.purchase.payment.online.amount !== 0 &&
                    item.purchase.payment.cash.amount !== "" &&
                    item.purchase.payment.online.amount !== ""
                    ? "Cash & Online"
                    : item.purchase.payment.cash.amount !== 0 &&
                      item.purchase.payment.cash.amount !== ""
                      ? "Cash"
                      : item.purchase.payment.online.amount !== 0 &&
                        item.purchase.payment.online.amount !== ""
                        ? "Online"
                        : "",
                item.type ? "NA" : item.purchase.balance,
                // "asdhjurf",
                item.type ? "NA" : item.purchase.comment,
                item.type
                  ? moment(item.sold?.sold_at).format("DD/MM/YYYY")
                  : "NA",
                item.type
                  ? item.sold.sell_price +
                  (item?.sold?.gst?.gst_amount
                    ? item?.sold?.gst?.gst_amount
                    : 0)
                  : "NA",
                item.type
                  ? parseInt(item.sold?.payment?.cash.amount) +
                  parseInt(item.sold?.payment?.online.amount) || 0
                  : "NA",
                item.type
                  ? item.sold.payment.cash.amount !== 0 &&
                    item.sold.payment.online.amount !== 0 &&
                    item.sold.payment.cash.amount !== "" &&
                    item.sold.payment.online.amount !== ""
                    ? "Cash & Online"
                    : item.sold.payment.cash.amount !== 0 &&
                      item.sold.payment.cash.amount !== ""
                      ? "Cash"
                      : item.sold.payment.online.amount !== 0 &&
                        item.sold.payment.online.amount !== ""
                        ? "Online"
                        : ""
                  : "NA",
                item.type ? item.sold?.sell_comment : "NA",
                item.type
                  ? (item?.sold?.is_gst
                    ? item?.sold?.gst?.gst_amount + item.sold?.balance
                    : item.sold?.balance) || 0
                  : "NA",
                item.type
                  ? moment(item.sold?.updated_at).format("DD/MM/YYYY")
                  : "NA",
              ],
              payment: item.purchase.payment,
              soldPayment: item.sold.payment,

              // actualData: difference,
              id: item._id,
              type: item.type,
              settled: item.is_settled,
            };
          });

          const originalData = res.data.data.khata.filter(
            (item) => item.type && item.type === "debit"
          );
          const filtereddata = originalData.filter(
            (item) => item.purchase && item.purchase.balance
          );
          const filteredSoldData = originalData.filter(
            (item) => item.sold && item.sold.balance
          );

          // const gst=originalData.filter(item=>item.sold )
          const totalBalanceTobePaid =
            filtereddata.length > 0 &&
            filtereddata.reduce((a, c) => a + c.purchase.balance, 0);
          const totalSoldBalanceTobePaid =
            filteredSoldData.length > 0 &&
            filteredSoldData.reduce((a, c) => a + c.sold.balance, 0);

          const finalBalance = totalBalanceTobePaid - totalSoldBalanceTobePaid;

          return new Promise((resolve, reject) => {
            try {
              resolve({
                mapTableData: rows,
                postData,
                balanceToBePaid: finalBalance,
                currentPage: pathName,
                tableHeading: TABLE_KHATA_INDVIDUAL + "of All",
                products: res.data.data.khata,
              });
            } catch (error) {
              reject(error);
            }
          });
        })
        .catch((err) => {
          toast.error(err.response.data.message, { timeOut: 5000 });
        });
      return response;
    }
    const response = getCreditorsAndDebitorslist({
      page: page,
      limit: limit,
      type: type,
    })
      .then(async (res) => {
        const { page, limit, total } = res.data.data;
        //   this.setState({
        let postData = {
          page: page,
          limit: limit,
          total: total,
        };

        //   });
        if (pathName === "/bahikhata/dev/app/khata") {
          const rows = res.data.data.products.map((item) => {
            return {
              row: [
                item.purchase.from,
                item.purchase.phone,
                moment(item.purchase_at).format("DD/MM/YYYY"),
                item.purchase.purchase_amount,
                parseInt(item.purchase.payment.cash.amount) +
                parseInt(item.purchase.payment.online.amount),
                item.purchase.payment.cash.amount !== 0 &&
                  item.purchase.payment.online.amount !== 0 &&
                  item.purchase.payment.cash.amount !== "" &&
                  item.purchase.payment.online.amount !== ""
                  ? "Cash & Online"
                  : item.purchase.payment.cash.amount !== 0 &&
                    item.purchase.payment.cash.amount !== ""
                    ? "Cash"
                    : item.purchase.payment.online.amount !== 0 &&
                      item.purchase.payment.online.amount !== ""
                      ? "Online"
                      : "",
                item.purchase.balance,
                item.purchase.comment,
                item.model,
                item.color,
                item.imei,
                item.ram,
                item.hdd,
              ],
              id: item._id,
              payment: item.purchase.payment,
              actualData: item,
              soldPayment: item.sold.payment,
              settled: item.is_settled,
            };
          });

          return {
            mapTableData: rows,
            postData,
            currentPage: pathName,
            tableHeading: TABLE_KHATA_CREDITORS,
            products: res.data.data.products,
          };
        } else if (pathName === "/bahikhata/dev/app/debtors") {
          const rows = res.data.data.products.map((item) => {
            return {
              row: [
                item.sold.to,
                item.sold.phone,
                moment(item.sold?.sold_at).format("DD/MM/YYYY"),
                item.sold.sell_price +
                (item?.sold?.gst?.gst_amount
                  ? item?.sold?.gst?.gst_amount
                  : 0),
                parseInt(item.sold?.payment?.cash.amount) +
                parseInt(item.sold?.payment?.online.amount) || 0,
                item.sold.payment.cash.amount !== 0 &&
                  item.sold.payment.online.amount !== 0 &&
                  item.sold.payment.cash.amount !== "" &&
                  item.sold.payment.online.amount !== ""
                  ? "Cash & Online"
                  : item.sold.payment.cash.amount !== 0 &&
                    item.sold.payment.cash.amount !== ""
                    ? "Cash"
                    : item.sold.payment.online.amount !== 0 &&
                      item.sold.payment.online.amount !== ""
                      ? "Online"
                      : "",
                item.sold?.balance +
                (item?.sold?.gst?.gst_amount
                  ? item?.sold?.gst?.gst_amount
                  : 0) || 0,
                item.sold?.sell_comment,
                item.model,
                item.color,
                item.imei,
                item.ram,
                item.hdd,
              ],
              id: item._id,
              payment: item.purchase.payment,
              actualData: item,
              soldPayment: item.sold.payment,
              settled: item.is_settled,
            };
          });
          return {
            mapTableData: rows,
            postData,
            currentPage: pathName,
            tableHeading: TABLE_KHATA_DEBTORS,
            products: res.data.data.products,
          };
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
    return response;
  }
);

const khataSlice = createSlice({
  name: "khata",
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.postData.type = action.payload;
    },
    setKhataSearch: (state, action) => {
      let { page, limit } = state;
      if (action.payload?.currentTab === "Debtors") {
        const rows = action.payload.data?.map((item) => {
          return {
            row: [
              item.sold.to,
              item.sold.phone,
              moment(item.sold?.sold_at).format("DD/MM/YYYY"),
              item.sold?.sell_price,
              parseInt(item.sold?.payment?.cash.amount) +
              parseInt(item.sold?.payment?.online.amount) || 0,
              item.purchase.payment.cash.amount !== 0 &&
                item.purchase.payment.online.amount !== 0 &&
                item.purchase.payment.cash.amount !== "" &&
                item.purchase.payment.online.amount !== ""
                ? "Cash & Online"
                : item.purchase.payment.cash.amount !== 0 &&
                  item.purchase.payment.cash.amount !== ""
                  ? "Cash"
                  : item.purchase.payment.online.amount !== 0 &&
                    item.purchase.payment.online.amount !== ""
                    ? "Online"
                    : "",
              item.sold?.balance || 0,
              item.sold?.sell_comment,
              item.model,
              item.color,
              item.imei,
              item.ram,
              item.hdd,
            ],
            payment: item.purchase.payment,
            soldPayment: item.sold.payment,
            actualData: item,
            id: item._id,
            settled: item.is_settled,
          };
        });
        state.mapTableData = rows;
        state.tableHeading = TABLE_KHATA_DEBTORS;
        state.products = action.payload.data;
      } else if (action.payload?.currentTab === "Creditors") {
        const rows = action.payload?.data.map((item) => {
          return {
            row: [
              item.purchase.from,
              item.purchase.phone,
              moment(item.purchase_at).format("DD/MM/YYYY"),
              item.purchase.purchase_amount,
              item.purchase.payment.cash.amount !== 0 &&
                item.purchase.payment.online.amount !== 0 &&
                item.purchase.payment.cash.amount !== "" &&
                item.purchase.payment.online.amount !== ""
                ? "Cash & Online"
                : item.purchase.payment.cash.amount !== 0 &&
                  item.purchase.payment.cash.amount !== ""
                  ? "Cash"
                  : item.purchase.payment.online.amount !== 0 &&
                    item.purchase.payment.online.amount !== ""
                    ? "Online"
                    : "",
              parseInt(item.purchase.payment.cash.amount) +
              parseInt(item.purchase.payment.online.amount),
              item.purchase.balance,
              item.purchase.comment,
              item.model,
              item.color,
              item.imei,
              item.ram,
              item.hdd,
            ],
            id: item._id,
            payment: item.purchase.payment,
            soldPayment: item.sold.payment,
            actualData: item,
            settled: item.is_settled,
          };
        });
        state.mapTableData = rows;
        state.tableHeading = TABLE_KHATA_CREDITORS;
        state.products = action.payload.data;
      } else {
        const searchQuery = window.location.search;
        const type = new URLSearchParams(searchQuery).get("type");
        // console.log(action.payload);
        const { search } = action.payload;
        let rows;
        if (search) {
          rows = action.payload.data.map((item) => {
            return {
              row: [
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? item.purchase.from
                  : item.sold.to,
                // !type === "credit" ? item.purchase.from : item.sold.to,
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? item.purchase.phone
                  : item.sold.phone,
                item.product,
                item.model,
                item.color,
                item.imei,
                item.ram,
                item.hdd,
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? moment(item.purchase_at).format("DD/MM/YYYY")
                  : "NA",
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? item.purchase.purchase_amount
                  : "NA",
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? isNaN(
                    parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount)
                  )
                    ? 0
                    : parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount)
                  : "NA",
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? parseInt(item.purchase.payment.cash.amount) !== 0 &&
                    parseInt(item.purchase.payment.online.amount) !== 0 &&
                    item.purchase.payment.cash.amount !== "" &&
                    item.purchase.payment.online.amount !== ""
                    ? "Cash & Online"
                    : parseInt(item.purchase.payment.cash.amount) !== 0 &&
                      item.purchase.payment.cash.amount !== ""
                      ? "Cash"
                      : parseInt(item.purchase.payment.online.amount) !== 0 &&
                        item.purchase.payment.online.amount !== ""
                        ? "Online"
                        : ""
                  : "NA",
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? item.purchase.balance
                  : "NA",
                item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? item.purchase.comment
                  : "NA",
                !item.purchase.from.match(search) ||
                  item.purchase.phone.match(search)
                  ? moment(item.sold?.sold_at).format("DD/MM/YYYY")
                  : "NA",

                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? item.sold.is_gst
                    ? item.sold?.sell_price + item.sold?.gst?.gst_amount
                    : item.sold?.sell_price
                  : "NA",
                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? parseInt(item.sold?.payment?.cash.amount) +
                  parseInt(item.sold?.payment?.online.amount) || 0
                  : "NA",
                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? parseInt(item.sold?.payment?.cash.amount) !== 0 &&
                    parseInt(item.sold?.payment?.online.amount) !== 0 &&
                    item.sold?.payment?.cash.amount !== "" &&
                    item.sold?.payment?.online.amount !== ""
                    ? "Cash & Online"
                    : parseInt(item.sold?.payment.cash.amount) !== 0 &&
                      item.sold?.payment.cash.amount !== ""
                      ? "Cash"
                      : parseInt(item.sold?.payment.online.amount) !== 0 &&
                        item.sold?.payment.online.amount !== ""
                        ? "Online"
                        : " "
                  : "NA",
                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? item.sold?.sell_comment
                  : "NA",
                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? item.sold?.is_gst
                    ? item.sold?.balance + item.sold?.gst.gst_amount
                    : item.sold?.balance
                  : "NA",
                !item.purchase.from.match(search) &&
                  !item.purchase.phone.match(search)
                  ? moment(item.sold?.updated_at).format("DD/MM/YYYY")
                  : "NA",
              ],
              payment: item.purchase.payment,
              soldPayment: item.sold.payment,
              actualData: item,
              id: item._id,
              type: type,
              settled: item.is_settled,
            };
          });
        } else {
          rows = action.payload.data.map((item) => {
            return {
              row: [
                type === "credit" ? item.purchase.from : item.sold.to,
                type === "credit" ? item.purchase.phone : item.sold.phone,
                item.product,
                item.model,
                item.color,
                item.imei,
                item.ram,
                item.hdd,
                type === "credit"
                  ? moment(item.purchase_at).format("DD/MM/YYYY")
                  : "NA",
                type === "credit" ? item.purchase.purchase_amount : "NA",
                type === "credit"
                  ? isNaN(
                    parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount)
                  )
                    ? 0
                    : parseInt(item.purchase.payment.cash.amount) +
                    parseInt(item.purchase.payment.online.amount)
                  : "NA",
                type === "credit"
                  ? parseInt(item.purchase.payment.cash.amount) !== 0 &&
                    parseInt(item.purchase.payment.online.amount) !== 0 &&
                    item.purchase.payment.cash.amount !== "" &&
                    item.purchase.payment.online.amount !== ""
                    ? "Cash & Online"
                    : parseInt(item.purchase.payment.cash.amount) !== 0 &&
                      item.purchase.payment.cash.amount !== ""
                      ? "Cash"
                      : parseInt(item.purchase.payment.online.amount) !== 0 &&
                        item.purchase.payment.online.amount !== ""
                        ? "Online"
                        : ""
                  : "NA",
                type === "credit" ? item.purchase.balance : "NA",
                type === "credit" ? item.purchase.comment : "NA",
                type === "debit"
                  ? moment(item.sold?.sold_at).format("DD/MM/YYYY")
                  : "NA",

                type === "debit"
                  ? item.sold.is_gst
                    ? item.sold?.sell_price + item.sold?.gst?.gst_amount
                    : item.sold?.sell_price
                  : "NA",
                type === "debit"
                  ? parseInt(item.sold?.payment?.cash.amount) +
                  parseInt(item.sold?.payment?.online.amount) || 0
                  : "NA",
                type === "debit"
                  ? parseInt(item.sold?.payment?.cash.amount) !== 0 &&
                    parseInt(item.sold?.payment?.online.amount) !== 0 &&
                    item.sold?.payment?.cash.amount !== "" &&
                    item.sold?.payment?.online.amount !== ""
                    ? "Cash & Online"
                    : parseInt(item.sold?.payment.cash.amount) !== 0 &&
                      item.sold?.payment.cash.amount !== ""
                      ? "Cash"
                      : parseInt(item.sold?.payment.online.amount) !== 0 &&
                        item.sold?.payment.online.amount !== ""
                        ? "Online"
                        : " "
                  : "NA",
                type === "debit" ? item.sold?.sell_comment : "NA",
                type === "debit"
                  ? item.sold?.is_gst
                    ? item.sold?.balance + item.sold?.gst.gst_amount
                    : item.sold?.balance
                  : "NA",
                type === "debit"
                  ? moment(item.sold?.updated_at).format("DD/MM/YYYY")
                  : "NA",
              ],
              payment: item.purchase.payment,
              soldPayment: item.sold.payment,
              actualData: item,
              id: item._id,
              type: type,
              settled: item.is_settled,
            };
          });
        }
        // const filtereddata = action.payload?.data.filter(item => item.purchase && item.purchase.balance)
        // const totalBalanceTobePaid = filtereddata.length > 0 && filtereddata.reduce((a, c) => a + c.purchase.balance, 0)
        const filtereddata = action.payload.data.filter(
          (item) => item.purchase && item.purchase.balance
        );
        const filteredSoldData = action.payload.data.filter(
          (item) => item.sold && (item.sold.balance || item.sold.is_gst)
        );

        const totalBalanceTobePaid =
          filtereddata.length > 0 &&
          filtereddata.reduce((a, c) => a + c.purchase.balance, 0);
        const totalSoldBalanceTobePaid =
          filteredSoldData.length > 0 &&
          filteredSoldData.reduce(
            (a, c) =>
              c.sold.is_gst
                ? a + c.sold.balance + c.sold.gst.gst_amount
                : a + c.sold.balance,
            0
          );
        let finalBalance = 0;
        if (search) {
          action.payload.data.forEach((item) => {
            item.purchase.from.match(search) ||
              item.purchase.phone.match(search)
              ? (finalBalance += isNaN(parseInt(item.purchase.balance))
                ? 0
                : parseInt(item.purchase.balance))
              : (finalBalance -= isNaN(parseInt(item.sold.balance))
                ? 0
                : parseInt(item.sold.balance));
          });
        } else {
          finalBalance =
            action.payload.type && action.payload.type === "debit"
              ? -totalSoldBalanceTobePaid
              : totalBalanceTobePaid;
        }
        // console.log(search);
        // const finalBalance = action.payload.type && action.payload.type === "debit" ? -totalSoldBalanceTobePaid : totalBalanceTobePaid - totalSoldBalanceTobePaid
        const clientName = new URLSearchParams(searchQuery).get("q");
        state.mapTableData = rows;
        state.products = action.payload.data;

        state.balanceToBePaid = finalBalance;
        if (search) {
          state.searchedClient = search;
          state.tableHeading = search
            ? TABLE_KHATA_INDVIDUAL + " of " + search
            : TABLE_KHATA_INDVIDUAL + " of  All";
        } else if (clientName !== "") {
          state.searchedClient = clientName;
          state.tableHeading = clientName
            ? TABLE_KHATA_INDVIDUAL + " of " + clientName
            : TABLE_KHATA_INDVIDUAL + " of  All";
        } else {
          state.searchedClient = filtereddata[0]?.purchase?.from;
          state.tableHeading = filtereddata[0]?.purchase?.from
            ? TABLE_KHATA_INDVIDUAL + " of " + filtereddata[0]?.purchase?.from
            : TABLE_KHATA_INDVIDUAL + " of  All";
        }
      }
    },
    resetSearchedClient: (state) => {
      state.searchedClient = null;
    },
    getPaymentData: (state, action) => {
      const { name, value, checked } = action.payload.paymentData.target;
      let payment = state.payment;
      switch (name) {
        case "cashChecked":
          let isCashChecked = checked ? true : false;
          if (!isCashChecked) {
            payment.cash = "";
            payment.is_cash = isCashChecked;
          }
          payment.is_cash = isCashChecked;
          break;
        case "onlineChecked":
          let isOnlineChecked = checked ? true : false;
          if (!isOnlineChecked) {
            payment.online = "";
            payment.is_online = isOnlineChecked;
          }
          payment.is_online = isOnlineChecked;
          break;
        case "cash":
          payment.cash = value;
          break;
        case "online":
          payment.online = value;
          break;

        default:
          break;
      }
      state.payment = payment;
    },
    resetKhataSearch: (state, action) => {
      state.searchedClient = false;
    },
    setEditSettle: (state, action) => {
      state.editSettle = true;
      state.rowId = action.payload;
    },
    setKhataRowEdit: (state, action) => {
      state.editSettle = false;
    },
    setKhataProductId: (state, action) => {
      state.productId = action.payload;
    },
  },
  extraReducers: {
    [fetchKhata.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchedClient = null;
      state.mapTableData = action.payload?.mapTableData;
      state.postData = action.payload?.postData;
      state.balanceToBePaid = action.payload?.balanceToBePaid;
      state.currentPage = action.payload?.currentPage;
      state.tableHeading = action.payload?.tableHeading;
      state.products = action.payload?.products;
    },
    [fetchKhata.rejected]: (state, _) => {
      state.mapTableData = [];
    },
    [fetchKhata.pending]: (state, _) => {
      state.isLoading = true;
      state.mapTableData = [];
    },
  },
});

export const {
  setCurrentTab,
  getPaymentData,
  setKhataSearch,
  setKhataProductId,
  resetKhataSearch,
  setEditSettle,
  resetSearchedClient,
  setKhataRowEdit,
} = khataSlice.actions;

export default khataSlice.reducer;
