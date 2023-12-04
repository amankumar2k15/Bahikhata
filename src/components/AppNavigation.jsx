import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { getStockLoadingStatus } from "../reducers/stock/stock.selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommonUtils from "../utils/common.utils";

const AppNavigation = ({ loading }) => {
  const history = useHistory();
  const pathname = CommonUtils.getPathFromHistory(history);

  const [activeTab, setActiveTab] = useState("");

  const navItemList = [
    {
      label: "Dashboard",
      type: "dashboard",
      path: "/dashboard",
      icon: "columns"
    },
    { label: "Khata", type: "khata", path: "/khata", icon: "book-open" }
  ];

  useEffect(() => {
    navItemList.forEach(({ type, path }) => {
      if (pathname.includes(type)) {
        setActiveTab(type);
      }
    });
  }, [pathname]);

  const AppNavItem = ({ type, label, path, icon }) => (
    <Nav.Item as="li" onClick={() => setActiveTab(type)} className="nav-tab">
      <NavLink
        to={path}
        data-toggle="tab"
        className={`text-white text-decoration-none${
          type === activeTab ? " active bg-active show" : ""
        }`}
      >
        <div>
          <i>
            <FontAwesomeIcon icon={icon} className="me-1" />
          </i>{" "}
          {label}
        </div>
      </NavLink>
    </Nav.Item>
  );

  return (
    <Navbar bg="primary" variant="dark" className="h-71">
      <Nav as="ul" className="ps-3">
        {!loading &&
          navItemList.map((item) => <AppNavItem key={item.type} {...item} />)}
      </Nav>
      <Nav className="ms-auto me-2">
        <Nav.Link href="#deets" className="nav-link-sub-right">
          <FontAwesomeIcon icon="question-circle" />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  loading: getStockLoadingStatus(state)
});

export default connect(mapStateToProps)(AppNavigation);
