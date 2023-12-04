import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import {
  getOpeningStockService,
  getSearchPurchaseUser,
  purchaseProductService,
} from "../../services/api.service";
import toastr from "toastr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchPopup from "../Header/SearchPopup";
import { fetchInventory } from "../../store/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStatusService } from "../../services/api.service";
import headerSlice, {
  setDashboardStatus,
  setOpeningStock,
} from "../../store/slices/headerSlice";
import { SyncLoader } from "react-spinners";
const initFormData = {
  product: "",
  model: "",
  color: "",
  imei: "",
  ram: "",
  hdd: "",
  purchase_from: "",
  phone: "",
  purchase_amount: 0,
  purchase_at: new Date().toISOString().slice(0, 10),
  cash: "",
  online: "",
  comment: "",
  you_paid: 0,
  balance: 0,
};

export const PurchaseForm = ({ getAllInventory }) => {
  const dispatch = useDispatch();
  const date = new Date();
  // const { inventory } = useSelector((state) => state);
  const { openingStock } = useSelector((state) => state.header);
  const { setActiveToggle } = useSelector((state) => state.header);


  const todayDate = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate()}`;

  // form fields
  const [formData, setFormData] = useState({
    ...initFormData,
  });
  
  // form validation
  const [formErrors, setFormErrors] = useState({
    product: false,
    model: false,
    color: false,
    imei: false,
    cash: null,
    online: null,
    ram: false,
    hdd: false,
    purchase_from: false,
    phone: false,
    purchase_amount: false,
    purchase_at: false,
    is_cash: false,
    is_online: false,
    cash: "",
    online: "",
    comment: false,
    checked: false,
  });
  // is form valid
  const [isFormValid, setIsFormValid] = useState(false);
  const [errMessage, setErrMessage] = useState({});
  const [isRow, setIsRow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOnlineChecked, setIsOnlineChecked] = useState(false);
  const [search, setSearch] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState();

  const getListSize = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", getListSize);
  }, []);
  const updateWindowDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    if (!isChecked) {
      setFormData({ ...formData, cash: "" });
    } else if (!isOnlineChecked) {
      setFormData({ ...formData, online: "" });
    }
    // if (isChecked === false && isOnlineChecked === false) {
    //   setIsFormValid(false);
    // }
  }, [isChecked, isOnlineChecked]);

  // useEffect(() => {
  //  dispatch(fetchInventory({postData:inventory.postData,tab:"dashboard"}))
  // }, [])

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cash") {
      value ? setIsChecked(true) : setIsChecked(false);
      // setFormData({...initFormData,})
    }

    if (name === "online") {
      value ? setIsOnlineChecked(true) : setIsOnlineChecked(false);
      // setFormData({...initFormData,})
    }
    if (name !== "purchase_from") {
      setSearch(false);
    }
    setFormData({ ...formData, [name]: value });
    validateForm();
  };

  // search call for 'purchase from'
  const searchCall = async (e) => {
    setSearch(true);

    handleChange(e);
    const response = await getSearchPurchaseUser(e.target.value);
    setData(response.data.data);
  };

  const handleChangeCash = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: !isChecked, cash: null });
    setIsChecked(!isChecked);
    validateForm();
  };
  const handleChangeOnline = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: !isOnlineChecked, online: null });
    setIsOnlineChecked(!isOnlineChecked);
    validateForm();
  };

  const getDashboardStatus = () => {
    getDashboardStatusService()
      .then((res) => {
        dispatch(setDashboardStatus(res.data?.data));
      })
      .catch((err) => {
        toast.error(err.response.data.message, { timeOut: 5000 });
      });
  };
  // handle submit
  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    // call form validation

    if (formData.imei.length != 15) {
      setIsLoading(false);
      toast.error("Enter 15 digit IMEI number");
      return;
    }
    // else if(formData.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    // {
    //   toast("phone number should be numeric")
    // }
    else if (formData.phone.length != 10) {
      setIsLoading(false);
      toast.error("Enter 10 digit phone number");
      return;
    } else if (!formData.phone.match(/^[6-9]\d{9}$/)) {
      setIsLoading(false);
      toast.error("Enter a valid indian phone number");
      return;
    } else if (
      parseInt(formData.purchase_amount) <
      parseInt(formData.cash ? formData.cash : 0) +
        parseInt(formData.online ? formData.online : 0)
    ) {
      toast.error("Paid amount is greater than purchase amount");
      setIsLoading(false);
      return;
    }

    validateForm();
    if (isFormValid) {
      // call api
      // format form data
      const formattedFormData = {
        product: formData.product,
        model: formData.model,
        color: formData.color,
        imei: formData.imei,
        ram: formData.ram,
        hdd: formData.hdd,
        purchase_from: formData.purchase_from,
        phone: formData.phone,
        purchase_amount: parseInt(formData.purchase_amount),
        entry_type: "purchase",
        purchase_at: formData.purchase_at,
        is_cash: formData.cashChecked,
        is_online: formData.onlineChecked,
        mod: {
          cash: {
            amount: isNaN(parseInt(formData.cash))
              ? 0
              : parseInt(formData.cash),
          },
          online: {
            amount: isNaN(parseInt(formData.online))
              ? 0
              : parseInt(formData.online),
          },
        },
        comment: formData.comment,
      };
      // call purchase product service
      purchaseProductService(formattedFormData)
        .then((res) => {
          // reset form
          // setFormData({ ...initFormData });
          const postData = {
            page: 1,
            limit: 20,
            total: 0,
          };
          setFormData(initFormData);
          dispatch(fetchInventory({ postData, tab: "dashboard" }));
          getDashboardStatus();
          setIsChecked(false);
          setIsOnlineChecked(false);
          setIsFormValid(false);
          setIsLoading(false);
          getAllInventory(false);
          toast.success(res.data.message, { timeOut: 5000 });
          // setTimeout(() => {
          //   window.location.reload();
          // }, 3000);
          window.localStorage.setItem("section-update", this.props.section);
          window.dispatchEvent(new Event("storage"));
        })
        .catch((err) => {
          if (err.response) {
            setIsLoading(false);
            toast.error(err.response.data.message, { timeOut: 5000 });
          }
        });
    } else {
      setIsFormValid(false);
      setIsLoading(false);
      toast.error("Please Add Correct Product data.", { timeOut: 5000 });
    }
  };

  // form validation
  const validateForm = () => {
    let errors = formErrors;
    // check product is empty with trim
    if (formData.product.trim() === "") {
      errors.product = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state

      setIsFormValid(false);
      return;
    } else {
      errors.product = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state

      setIsFormValid(true);
    }
    // check model is empty with trim
    if (formData.model.trim() === "") {
      errors.model = true;
      // update formErrors state
      setFormErrors({ ...errors });

      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.model = false;
      // update formErrors state
      setFormErrors({ ...errors });

      // set isFormValid state
      setIsFormValid(true);
    }

    // check color is empty with trim
    if (formData.color.trim() === "") {
      errors.color = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);

      return;
    } else {
      errors.color = false;
      // update formErrors state
      setFormErrors({ ...errors });

      // set isFormValid state
      setIsFormValid(true);
    }
    // check imei is empty with trim
    if (formData.imei.trim() === "") {
      errors.imei = true;
      // setErrMessage({
      //   ...errMessage,
      //   imei: "IMEI Number should have 15 chars ",
      // });
      // setIsRow(true);
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);

      return;
    } else {
      errors.imei = false;
      // update formErrors state
      // setErrMessage({ ...errMessage, imei: false });
      // setIsRow(false);
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check ram is empty with trim
    if (formData.ram.trim() === "") {
      errors.ram = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);

      return;
    } else {
      errors.ram = false;

      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check hdd is empty with trim
    if (formData.hdd.trim() === "") {
      errors.hdd = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.hdd = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check purchase_from is empty with trim
    if (formData.purchase_from.trim() === "") {
      errors.purchase_from = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.purchase_from = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check phone is empty with trim
    if (formData.phone.trim() === "") {
      errors.phone = true;

      // setErrMessage({
      //   ...errMessage,
      //   phone: "Phone Number should have 10 chars ",
      // });
      // setIsRow(true);
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.phone = false;
      // update formErrors state
      // setErrMessage({ ...errMessage, imei: false });
      // setIsRow(false);
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check purchase_amount is empty with trim
    if (formData.purchase_amount === 0 || formData.purchase_amount === "") {
      errors.purchase_amount = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.purchase_amount = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check purchase_at is empty with trim
    if (formData.purchase_at.trim() === "") {
      errors.purchase_at = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.purchase_at = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check cash is empty with trim
    if (
      parseInt(formData.cash) < 0
      // || formData.cash === ""
    ) {
      errors.cash = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.cash = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check online is empty with trim
    if (
      parseInt(formData.online) < 0
      // || formData.online === ""
    ) {
      errors.online = true;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(false);
      return;
    } else {
      errors.online = false;
      // update formErrors state
      setFormErrors({ ...errors });
      // set isFormValid state
      setIsFormValid(true);
    }
    // check cash or online checked
    // if (!formData.cashChecked && !formData.onlineChecked) {
    //   errors.checked = true;
    //   // update formErrors state
    //   setFormErrors({ ...errors });
    //   // set isFormValid state
    //   setIsFormValid(false);
    //   return;
    // } else {
    //   errors.checked = false;
    //   // update formErrors state
    //   setFormErrors({ ...errors });
    //   // set isFormValid state
    //   setIsFormValid(true);
    // }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <tr>
        <td key={"product-name"} id="Productform">
          <FormControl
            id={"product-name"}
            aria-describedby={"product-name"}
            placeholder={"Product Name"}
            className={"fs-12"}
            value={formData.product}
            name={"product"}
            onChange={handleChange}
            required
          />
        </td>
        <td key={"model"}>
          <FormControl
            id={"model"}
            aria-describedby={"model"}
            placeholder={"Model"}
            className={"fs-12"}
            value={formData.model}
            name={"model"}
            style={{
              width: "100px",
              overflow: "hidden",
            }}
            onChange={handleChange}
            required
          />
        </td>
        <td key={"color"}>
          <FormControl
            id={"color"}
            value={formData.color}
            aria-describedby={"color"}
            placeholder={"Color"}
            className={"fs-12"}
            name={"color"}
            onChange={handleChange}
            required
            style={{
              width: "100px",
              overflow: "hidden",
            }}
          />
        </td>
        <td key={"imei"}>
          <FormControl
            id={"imei"}
            type="number"
            value={formData.imei}
            aria-describedby={"imei"}
            style={{ width: "fit-content" }}
            placeholder={"IMEI of 15 digits"}
            className={"fs-12"}
            name={"imei"}
            onChange={handleChange}
            maxLength="15"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 15))}
            required
          />
        </td>
        <td key={"ram"}>
          <FormControl
            id={"ram"}
            value={formData.ram}
            aria-describedby={"ram"}
            placeholder={"RAM"}
            className={"fs-12"}
            name={"ram"}
            onChange={handleChange}
            required
            type="number"
          />
        </td>
        <td key={"hdd"}>
          <FormControl
            id={"hdd"}
            value={formData.hdd}
            aria-describedby={"hdd"}
            placeholder={"HDD"}
            className={"fs-12"}
            name={"hdd"}
            onChange={handleChange}
            required
            type="number"
          />
        </td>
        <td key={"purchase-date"}>
          <input
            id="session-date"
            className={
              formErrors.purchase_at
                ? "fs-12 border border-danger"
                : "form-control fs-12 session-date"
            }
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={formData.purchase_at}
            name="purchase_at"
            onChange={handleChange}
            // required
          />
        </td>
        <td key={"purchase-from"} style={{ position: "relative" }}>
          <FormControl
            id={"purchase_from"}
            className={"fs-12"}
            aria-describedby={"purchase-from"}
            placeholder={"Purchased From"}
            name={"purchase_from"}
            onChange={searchCall}
            value={formData.purchase_from || ""}
            required
          />
          {search && (
            <SearchPopup
              data={data}
              setFormData={setFormData}
              formData={formData}
              setSearch={setSearch}
            />
          )}
        </td>
        <td key={"ph-no"}>
          <FormControl
            type="number"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
            id={"ph-no"}
            aria-describedby={"ph-no"}
            placeholder={"10 digit Phone No."}
            style={{ width: "fit-content" }}
            value={formData.phone || ""}
            className={"fs-12"}
            name={"phone"}
            onChange={handleChange}
            required
          />
        </td>
        <td key={"purchase-amount"}>
          <FormControl
            type="number"
            // value={formData.purchase_amount}
            id={"purchase-amount"}
            aria-describedby={"purchase-amount"}
            placeholder={"Purchase Amount"}
            onInput={(e) => (e.target.value = e.target.value.slice(0, 7))}
            className={"fs-12"}
            value={formData.purchase_amount || ""}
            name={"purchase_amount"}
            onChange={handleChange}
            required
          />
        </td>
        <td className="tran_mod">
          <DropdownButton
            variant="btn-sm fs-12 dropdown-specific-border"
            id="dropdown-item-button"
            title="Mode of Payment"
          >
            <div className="dropdown-item button-size fs-12 p-0 ">
              <div className="row d-flex align-items-center p-2  me-0">
                <div className="col-3 d-flex align-items-center">
                  <div>
                    <input
                      type="checkbox"
                      id="cash"
                      name="cashChecked"
                      onChange={handleChangeCash}
                      style={{ cursor: "pointer" }}
                      checked={isChecked}
                    />
                  </div>
                  <div className="pb-1">
                    <label
                      htmlFor="cash"
                      style={{ cursor: "pointer" }}
                      className="ms-2"
                    >
                      Cash
                    </label>
                  </div>
                </div>
                <div className="col-8">
                  <input
                    type="number"
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 7))
                    }
                    style={{ width: "6.25rem", height: "1.938rem" }}
                    name="cash"
                    value={formData.cash ? formData.cash : ""}
                    onChange={handleChange}
                    placeholder="0"
                    // value={formData.cash}
                    className="form-control ms-3 "
                  />
                </div>
              </div>
            </div>
            {/* <Dropdown.Divider /> */}
            <div className="dropdown-item button-size fs-12 p-0">
              <div className="row d-flex align-items-center p-2  me-0">
                <div className="col-3 d-flex align-items-center">
                  <div>
                    <input
                      type="checkbox"
                      id="online"
                      name="onlineChecked"
                      onChange={handleChangeOnline}
                      style={{ cursor: "pointer" }}
                      checked={isOnlineChecked}
                    />
                  </div>
                  <div className="pb-1">
                    <label
                      htmlFor="online"
                      style={{ cursor: "pointer" }}
                      className="ms-2  fw-400 payment-style "
                    >
                      Online
                    </label>
                  </div>
                </div>
                <div className="col-8 ">
                  {/* {isOnlineChecked && ( */}
                  <input
                    type="number"
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 7))
                    }
                    placeholder="0"
                    // value={formData.online}
                    style={{ width: "6.25rem", height: "1.938rem" }}
                    name="online"
                    value={formData.online ? formData.online : ""}
                    onChange={handleChange}
                    className="form-control ms-3"
                  />
                  {/* )} */}
                </div>
              </div>
            </div>
          </DropdownButton>
        </td>

        <td key={"you-paid"}>
          <label
            id={"you-paid"}
            aria-describedby={"you-paid"}
            placeholder={"You Paid"}
            // className="fs-12"
            name={"you_paid"}
            // value={
            //   parseInt(formData.cash || 0) + parseInt(formData.online || 0)
            // }
            // readOnly
          >
            {parseInt(formData.cash || 0) + parseInt(formData.online || 0)}
          </label>
        </td>
        <td key={"balance"}>
          <label
            id={"balance"}
            aria-describedby={"balance"}
            placeholder={"Balance"}
            // className="fs-12"
            name={"balance"}
            // value={
            //   parseInt(formData.purchase_amount || 0) -
            //   (parseInt(formData.cash || 0) + parseInt(formData.online || 0))
            // }
            // readOnly
          >
            {parseInt(formData.purchase_amount || 0) -
              (parseInt(formData.cash || 0) + parseInt(formData.online || 0))}
          </label>
        </td>
        <td key={"purchase-comments"}>
          <FormControl
            id={"purchase-comments"}
            value={formData.comment}
            aria-describedby={"purchase-comments"}
            placeholder={"Purchase Comments"}
            className={`fs-12  ${width < 420 ? "purchase-comment-break" : ""}`}
            name={"comment"}
            maxLength="100"
            onChange={handleChange}
          />
        </td>
        <td key="add-product-td">
          <Button
            className="col-7 "
            style={{ width: "max-content" }}
            variant="primary btn-sm"
            onClick={handleSubmit}
            disabled={!isFormValid ? true : false}
          >
            {isLoading ? (
              <SyncLoader size={5} color="white" />
            ) : (
              <>Add Product</>
            )}
          </Button>
        </td>
      </tr>
      {isRow && (
        <tr className="text-right">
          <td colSpan="15" className="text-danger">
            {errMessage.imei ||
              (errMessage.phone && (
                <p className=" bg-danger">
                  {errMessage.imei ? errMessage.imei : errMessage.phone}
                </p>
              ))}
          </td>
        </tr>
      )}
    </>
  );
};
