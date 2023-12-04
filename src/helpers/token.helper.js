// jwt token getter setter

export const getToken = () => {
  return localStorage.getItem('token');
}

// set token to local storage
export const setToken = (token) => {
  localStorage.setItem('token', token);
}

// set data to local storage
export const setData = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
}

// get data by key from local storage
export const getData = (key) => {
  return JSON.parse(localStorage.getItem('data'))[key];
}

// remove token from local storage
export const removeToken = () => {
  localStorage.removeItem('token');
}

// clear local storage
export const clearStorage = () => {
  localStorage.clear();
}
