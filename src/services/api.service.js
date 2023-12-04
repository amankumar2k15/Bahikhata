import axios from "axios";
import moment from "moment";

const { REACT_APP_API_URL, REACT_APP_PAYMENT_API_URL } = process.env;

export const LoginService = async (data) => {
  return await axios.post(`${REACT_APP_API_URL}login`, data);
};
export const ForgotPasswordService = async (data) => {
  return await axios.post(`${REACT_APP_API_URL}forget-password`, data);
};
export const ChangePasswordService = async (data) => {
  return await axios.put(`${REACT_APP_API_URL}change-password`, data);
};
export const RegisterService = async (data) => {
  return await axios({
    method: "POST",
    url: `${REACT_APP_API_URL}dukandar-register`,
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
};
export const ProfileUpadteService = async (data) => {
  return await axios.put(`${REACT_APP_API_URL}dukandar-update-profile`, data);
};
export const ProfileProfileImageUpadteService = async (data) => {
  return await axios({
    method: "POST",
    url: `${REACT_APP_API_URL}dukandar/profile-image`,
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
};

export const getDukandarDetailService = async (id) => {
  return await axios.get(`${REACT_APP_API_URL}dukandar/${id}`);
};
export const getDashboardStatusService = async () => {
  return await axios.get(`${REACT_APP_API_URL}product/status`);
};
export const getOpeningStockService = async () => {
  return await axios.get(`${REACT_APP_API_URL}dukandar/get-opening-stock`);
};
export const getKhataStatusService = async () => {
  return await axios.get(`${REACT_APP_API_URL}khata-status`);
};
export const getProductDetailById = async (id) => {
  return await axios.get(`${REACT_APP_API_URL}product/${id}`);
};
export const sellProductService = async (data) => {
  return await axios.post(`${REACT_APP_API_URL}product/sell`, data);
};
export const purchaseProductService = async (data) => {
  return await axios.post(`${REACT_APP_API_URL}product/purchase`, data);
};
export const purchaseProductupdateService = async (id, data) => {
  return await axios.put(`${REACT_APP_API_URL}product/purchase/${id}`, data);
};
export const getDashboardProductStatusService = async (
  { page, limit, search },
  tab
) => {
  const body = {
    search,
    tab,
  };
  // post request
  return await axios.post(
    `${REACT_APP_API_URL}product/dashboard-status?page=${page}&limit=${limit}`,
    body
  );
};
export const getAdvanceProductStatusService = async ({ page, limit, body }) => {
  return await axios.post(
    `${REACT_APP_API_URL}product/advance-search?page=${page}&limit=${limit}`,
    body
  );
};
export const loadStatus = async (dukandarId, { page, limit }) => {
  const r1 = axios.get(`${REACT_APP_API_URL}dukandar/${dukandarId}`);
  const r2 = axios.get(`${REACT_APP_API_URL}product/status`);
  const r3 = axios.get(`${REACT_APP_API_URL}dukandar/get-opening-stock`);
  const r4 = axios.get(`${REACT_APP_API_URL}khata-status`);
  // const r5 = axios.get(`${REACT_APP_API_URL}product/${productId}`);
  const r6 = axios.post(
    `${REACT_APP_API_URL}product/dashboard-status?page=${page}&limit=${limit}`,
    {
      search: "",
      tab: "dashboard",
    }
  );
  return await axios.all([r1, r2, r3, r4, r6]);
};

// search products for khata
export const getSearchProducts = async (body) => {
  // post request

  const data = await axios.post(`${REACT_APP_API_URL}search/product`, body);

  return data;
};
export const getSettleKhata = async (body) => {
  // post request
  return await axios.post(`${REACT_APP_API_URL}product/settle-khata`, body);
};
// search purchase user
export const getSearchPurchaseUser = async (str) => {
  // get request
  return await axios.get(
    `${REACT_APP_API_URL}search/user-by-product-purchased?q=${str}`
  );
};
export const getSearchSoldUser = async (str) => {
  // get request
  return await axios.get(
    `${REACT_APP_API_URL}search/user-by-product-sold?q=${str}`
  );
};

// Get Product list
export const getProductlist = async ({ page, limit, body }) => {
  // post request
  return await axios.post(
    `${REACT_APP_API_URL}product/get-list?page=${page}&limit=${limit}`,
    body
  );
};

// delete product by id
export const deleteProductService = async (id) => {
  return await axios.delete(`${REACT_APP_API_URL}product/delete/${id}`);
};

// delete sell by id
export const deletesellProductService = async (id) => {
  return await axios.delete(`${REACT_APP_API_URL}product/delete/sell/${id}`);
};

// Plans & payment api

// get all plans
export const getAllPlans = async () => {
  return await axios.get(`${REACT_APP_API_URL}Allplans`);
};

// select a plan
export const selectPlan = async (tenure) => {
  return await axios.post(`${REACT_APP_PAYMENT_API_URL}payments/select-plan`, {
    plan: tenure,
  });
};
// Verify payment
export const verifyPayment = async (body) => {
  const { order_id, payment_id, signature, subscription_id } = body;
  return await axios.post(
    `${REACT_APP_PAYMENT_API_URL}payments/verify-payment`,
    {
      order_id,
      payment_id,
      signature,
      subscription_id,
    }
  );
};

// get purchased plans
export const getAllPurchasedPlans = async (body) => {
  return await axios.get(`${REACT_APP_API_URL}dukandar/get-subscriptions`);
};

// Get Get Len daar and Den daar list list
export const getCreditorsAndDebitorslist = async ({ page, limit, type }) => {
  const body = {
    type: type,
  };
  // post request
  return await axios.post(
    `${REACT_APP_API_URL}khata-status?page=${page}&limit=${limit}`,
    body
  );
};

// Get individual khata all list
export const getIndivisualKhataAll = async ({ page, limit }) => {
  // post request
  return await axios.get(
    `${REACT_APP_API_URL}individual-client-khata-all?q=&page=${page}&limit=${limit}`
  );
};

// Get individual khata list
export const getIndivisualKhata = async ({
  page,
  limit,
  search,
  type,
  tab,
}) => {
  if (tab) {
    return await axios.get(
      `${REACT_APP_API_URL}individual-client-khata?q=${search}&page=${page}&limit=${limit}&type=${type}&tab=${tab}`
    );
  } else {
    return await axios.get(
      `${REACT_APP_API_URL}individual-client-khata?q=${search}&page=${page}&limit=${limit}&type=${type}&tab=Client%20khata`
    );
  }
  // post request
};

// Report APIS

export const getInventoryReport = async (body) => {
  if (!body) {
    body = {
      from: "1970-01-01",
      to: moment(new Date()).format("YYYY-MM-DD"),
      search: "",
      is_sold: false,
    };
  }
  // post request
  return await axios.post(
    `${REACT_APP_API_URL}generate-inventory-report`,
    body
  );
};
export const getSalesReport = async (body) => {
  // post request
  return await axios.post(`${REACT_APP_API_URL}generate-sale-report`, body);
};
export const getKhataReport = async () => {
  const body = {
    type: "debtors",
  };
  // post request
  return await axios.post(`${REACT_APP_API_URL}generate-khata-report`, body);
};

export const getindivisualReport = async () => {
  // get request
  return await axios.get(
    `${REACT_APP_API_URL}generate-indivisual-khata-report`
  );
};

export const sendReminder = async (productId) => {
  // get request
  return await axios.get(`${REACT_APP_API_URL}send-reminder/${productId}`);
};
