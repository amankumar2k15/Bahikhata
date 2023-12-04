export const getUserState = (state) => state.owner;

export const isUserLoginLoading = (state) => {
  const { loading } = getUserState(state);
  return loading;
};

export const getAuthToken = (state) => {
  const { loading, userData } = getUserState(state);
  return !loading && userData && userData.token ? userData.token : null;
};

export const getUserId = (state) => {
  const { loading, userData } = getUserState(state);
  return !loading && userData && userData._id ? userData._id : null;
};
