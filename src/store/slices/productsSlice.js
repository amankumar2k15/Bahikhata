import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { toast } from "react-toastify";
import { getDukandarDetailService, getProductlist } from "../../services/api.service";


const initialState = {}
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await getProductlist()
    .then((res) => {      
      return res.data.data
    })
    .catch((err) => {
      toast.error(err.response.data.message, { timeOut: 5000 });
    });
  return response
})


const productsSlice = createSlice({
  name: 'products',
  initialState,
  extraReducers: {
    [fetchProducts.fulfilled]: (state, action) => {
      state.products = action.payload
    },
    [fetchProducts.rejected]: (state, _) => {
      state.tableRows = []
    },
    [fetchProducts.pending]: (state, _) => {
      state.tableRows = []
    },
  },
});

export const { } = productsSlice.actions

export default productsSlice.reducer