export const getStock = (state) => state.stock;

export const getStockLoadingStatus = (state) => {
  const { loading } = getStock(state);
  return loading;
};

export const getDahboardPostData = (state) => {
  const {
    search,
    postData: { page, limit },
    currentTab: tab
  } = getStock(state);
  return {
    search,
    page,
    limit,
    tab
  };
};

export const getProductsData = (state) => {
  const { products = [] } = getStock(state);
  return products;
};

export const getDukaandarData = (state) => {
  const { dukaandar } = getStock(state);
  return dukaandar;
};

export const getOpeningStockStatus = (state) => {
  const { openingStock } = getStock(state);
  return openingStock;
};

export const getDashboardStatus = (state) => {
  const { status = { dashboard: null, khata: null } } = getStock(state);
  return status;
};
