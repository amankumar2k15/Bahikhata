const setItemInStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
const getItemFromStorage = (key) => {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
const removeItemFromStorage = (key) => window.localStorage.removeItem(key);

const StorageUtils = {
  setItemInStorage,
  getItemFromStorage,
  removeItemFromStorage
};

export default StorageUtils;
