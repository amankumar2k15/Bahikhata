import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  DropdownButton,
  Dropdown,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import {
  getDashboardStatus,
  getStockLoadingStatus,
} from "../reducers/stock/stock.selectors";
import CommonUtils from "../utils/common.utils";
import moment from "moment";
import {
  SEARCH_KHATA_CREDITORS,
  SEARCH_KHATA_DEBTORS,
  SEARCH_KHATA_INDVIDUAL,
} from "../constants/searchPlaceholders";

const AppToolbar = ({ loading, status }) => {
  const history = useHistory();
  const path = CommonUtils.getPathFromHistory(history);
  const pathName = CommonUtils.getCharRemoveFromPath(path);

  const advanceSearch = () => {};
  const productSearch = () => {};

  const AppDateInput = ({ label }) => {
    return (
      <div className="row justify-content-between">
        <div className="col-6 d-flex align-items-center">
          <div className="label fs-6 fs-w600 text-primary me-md-3 ps-1">
            {label}
          </div>
        </div>
        <div className="col-6">
          <div className="input me-3">
            <input
              onChange={(e) => {}}
              type="date"
              style={{
                width: "100px",
              }}
              // value="2018-07-22"
              className="form-control fs-12 fs-w400 session-date date_input"
            />
          </div>
        </div>
      </div>
    );
  };

  const AppDropdownItem = ({ label }) => {
    return (
      <Dropdown.Item as="button" className="fs-12" onClick={() => {}}>
        {label}
      </Dropdown.Item>
    );
  };

  const AppDropdownFilter = () => {
    return (
      <div className="ms-2 mt-md-0 mt-3 all_filter">
        <DropdownButton
          id="dropdown-item-button"
          title="All"
          variant="primary btn-sm fs-12"
        >
          <AppDropdownItem label="Fully paid" />
          <AppDropdownItem label="Partially Paid" />
        </DropdownButton>
      </div>
    );
  };

  const AppDateFilter = () => {
    return (
      <div className="row w-100">
        <div className="col-md-3 d-flex align-items-center mb-2 mb-md-0">
          <AppDateInput label="From&nbsp;Date" />
        </div>
        <div className="col-md-3 d-flex align-items-center">
          <AppDateInput label="To Date" />
        </div>
        <div className="col-md-2 d-flex align-items-center two_btn">
          <button
            className="btn btn-primary  mt-md-0 mt-3 btn-sm fs-12 fs-w600"
            onClick={advanceSearch}
          >
            Search
          </button>
          {pathName === "sales" && <AppDropdownFilter />}
        </div>
      </div>
    );
  };

  const AppSearchInput = ({ label, name }) => {
    return (
      <div className="col-sm-5  mb-2 d-flex  align-items-center">
        <p className="search-title">{label}</p>
        <input
          type="text"
          className="form-control search-input ms-2"
          name={name}
        />
      </div>
    );
  };

  const AppAdvanceSearch = () => {
    const inputList = [
      { label: "Product&nbsp;Name", name: "product_name" },
      { label: "IMEI", name: "product_imei" },
      { label: "Model", name: "product_model" },
      { label: "User", name: "product_user" },
      { label: "User", name: "product_user" },
      { label: "Color", name: "product_color" },
      { label: "Ph. No.", name: "product_number" },
    ];
    return (
      <div className="filter-menu ms-auto me-3 mb-2 mb-sm-0">
        <DropdownButton
          id="dropdown-button-drop-down"
          key="down"
          drop="down"
          variant="outline-primary border-0 fs-12 fs-w600 ps-1"
          title="Advance Search"
        >
          <Form className="row pt-sm-0" method="POST" onSubmit={advanceSearch}>
            <div className="row mx-auto">
              <div className="col-sm-12">
                <div
                  className="row "
                  style={{
                    width: "31.25rem",
                    height: "auto",
                  }}
                >
                  {inputList.map((item) => (
                    <AppSearchInput key={item.name} {...item} />
                  ))}
                  <div className="col-sm-2 col-12 d-flex justify-content-center align-items-end ">
                    <div className="pb-2">
                      <button type="button" className="btn btn-primary btn-sm">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </DropdownButton>
      </div>
    );
  };

  const AppSearchFilter = () => {
    const getPlaceholderSearchFilter = () => {
      switch (pathName) {
        case "clientkhata":
          return SEARCH_KHATA_INDVIDUAL;
        case "debtors":
          return SEARCH_KHATA_DEBTORS;
        case "creditors":
          return SEARCH_KHATA_CREDITORS;
        default:
          return "Search Product Here";
      }
    };
    return (
      <div className="d-sm-flex align-items-center justify-content-end">
        {["purchase", "sales", "dashboard"].some((x) => x === pathName) && (
          <AppAdvanceSearch />
        )}
        <div className="search-product">
          <InputGroup>
            <FormControl
              className="fs-12"
              placeholder={getPlaceholderSearchFilter()}
              aria-label="Search Product Here"
              aria-describedby="search-product"
              onChange={(e) => {}}
            />
            <Button
              variant="primary fs-12 fs-w600"
              id="search-product-button"
              onClick={productSearch}
            >
              Search
            </Button>
          </InputGroup>
        </div>
      </div>
    );
  };

  const { creditors, debtors } = status?.khata;

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          <div className="card py-2 pe-3">
            <div className="row ms-1">
              <div className="col-lg-8 mb-md-0 d-flex align-items-sm-center">
                {["purchase", "sales"].some((x) => x === pathName) && (
                  <AppDateFilter />
                )}
                {pathName === "clientkhata" && (
                  <p className="fs-6 fs-w500 text-muted">
                    You will pay ₹{}
                    <span className="text-danger fs-w600">
                      {creditors[0].totalSum - debtors[0].totalSum}
                      /-
                    </span>{" "}
                    {/* {this.props?.khata?.searchedClient
                          ? "to " + this.props?.khata?.searchedClient
                          : ""} */}
                  </p>
                )}
              </div>
              <div className="col-lg-4 ms-lg-auto">
                <AppSearchFilter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state),
  status: getDashboardStatus(state),
});

export default connect(mapStateToProps)(AppToolbar);
