import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { toast } from "react-toastify";
import { getDukandarDetailService } from "../../services/api.service";


const initialState = {}
const id = localStorage.getItem("userId")
export const userDetails = createAsyncThunk('user/userDetails', async () => {
  const response = await getDukandarDetailService(id)
    .then((res) => {      
      return res.data.data
    })
    .catch((err) => {
      toast.error(err.response.data.message, { timeOut: 5000 });
    });
  return response
})


const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    [userDetails.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [userDetails.rejected]: (state, _) => {
      state.tableRows = []
    },
    [userDetails.pending]: (state, _) => {
      state.tableRows = []
    },
  },
});

export const { } = userSlice.actions

export default userSlice.reducer