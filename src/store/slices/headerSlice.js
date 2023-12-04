import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import {
  button_headings,
  khata_button_headings,
} from "../../constants/button_headings";
import { header_messages } from "../../constants/headerMessages";
import { getDukandarDetailService } from "../../services/api.service";

const initialState = {
  activeToggle: "dashboard",
  data: header_messages[0],
  isLoading: true,
  openingStock: 0,
  type: "all",
  hideValue: "",
  dashboardStatus: button_headings,
  khataStatus: khata_button_headings,
  isLoggedOut: false,
  currentTab: "Dashboards",
  dukandarData: null,
  postData: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setKhataStatus: (state, action) => {
      const khataData = action.payload;
      // check if khataData.creditors is empty
      if (khataData.creditors.length !== 0) {
        state.khataStatus[0].subHeading = khataData.creditors[0].totalSum;
      }
      // check if khataData.debtors is empty
      if (khataData.debtors.length !== 0) {
        state.khataStatus[1].subHeading =
          khataData.debtors[0].totalSum + khataData.debtors[0].gstSum;
      }
    },
    setDashboardStatus: (state, action) => {
      const { totalInventory, totalPurchase, totalSold } = action.payload[0];
      if (totalInventory.length !== 0) {
        state.dashboardStatus[0].subHeadingTextLeft =
          totalInventory[0]?.totalNumber;
        state.dashboardStatus[0].subHeadingTextRight =
          totalInventory[0]?.totalSum;
      } else {
        state.dashboardStatus[0].subHeadingTextLeft = 0;
        state.dashboardStatus[0].subHeadingTextRight = 0;
      }
      // check if totalPurchase is empty
      if (totalPurchase.length !== 0) {
        state.dashboardStatus[1].subHeadingTextLeft =
          totalPurchase[0]?.totalNumber;
        state.dashboardStatus[1].subHeadingTextRight =
          totalPurchase[0]?.totalSum;
      } else {
        state.dashboardStatus[1].subHeadingTextLeft = 0;
        state.dashboardStatus[1].subHeadingTextRight = 0;
      }
      // check if totalSold is empty
      if (totalSold.length !== 0) {
        state.dashboardStatus[2].subHeadingTextLeft = totalSold[0]?.totalNumber;
        state.dashboardStatus[2].subHeadingTextRight = totalSold[0]?.totalSum;
      } else {
        state.dashboardStatus[2].subHeadingTextLeft = 0;
        state.dashboardStatus[2].subHeadingTextRight = 0;
      }

      // state.dashboardStatus = action.payload
    },
    setDukandarDetails: (state, action) => {
      state.dukandarData = action.payload;
    },
    setOpeningStock: (state, action) => {
      state.openingStock = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = false;
    },
    setLogout: (state, action) => {
      state.openingStock = 0;
      state.isLoggedOut = true;
      state.dashboardStatus = button_headings;
      state.khataStatus = khata_button_headings;
    },
    setTab: (state, action) => {
      state.activeToggle = action.payload.activeToggle;
      state.hideValue = action.payload.hideValue;
      state.currentTab = action.payload.currentTab;
    },
    setCurentTab: (state, action) => {
      state.currentTab = action.payload.currentTab;
    },
    setHideValue: (state, action) => {
      state.hideValue = action.payload.currentTab;
    },
    setToggle: (state, action) => {
      state.hideValue = action.payload.hideValue;
      state.currentTab = action.payload.currentTab;
    },
    setActiveToggle: (state, action) => {
      state.activeToggle = action.payload;
    },
    setIndividualKhataTab: (state, action) => {
      state.activeToggle = "Khata";
      state.hideValue = "Khata";
      state.currentTab = "Khata";
    },
  },
});

export const {
  setKhataStatus,
  setHideValue,
  setActiveToggle,
  setToggle,
  setLogout,
  setCurentTab,
  setLoading,
  setTab,
  setType,
  setOpeningStock,
  setDukandarDetails,
  setDashboardStatus,
  setIndividualKhataTab,
} = headerSlice.actions;

export default headerSlice.reducer;
