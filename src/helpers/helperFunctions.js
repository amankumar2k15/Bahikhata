// get Khata status

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getKhataStatusService } from "../services/api.service";
import { setKhataStatus } from "../store/slices/headerSlice";

export const getKhataStatus = () => {
  const dispatch=useDispatch()
  getKhataStatusService()
    .then((res) => {
      const khataData = res.data.data[0];
      dispatch(setKhataStatus(khataData));
    })
    .catch((err) => {
      toast.error(err.response.data.message, { timeOut: 5000 });
    });
};