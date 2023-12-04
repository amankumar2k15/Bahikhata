const CheckPassword = (text) => {
  var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
  return text.match(decimal);
};

const getPathFromHistory = (history) => {
  const {location: { pathname }} = history;
  return pathname;
};

const getCharRemoveFromPath = (pathname) => pathname.substring(1);

const CommonUtils = {
  CheckPassword,
  getPathFromHistory,
  getCharRemoveFromPath
};
export default CommonUtils;
