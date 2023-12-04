import React from "react";
import Register from "./Register";
import Addon from "./Addon";
import Dashboard from "./Dashboard";
import Plans from "./Plans";
import Dashboard2 from "./Dashboard2";
import Footer from "./Footer";
import LoginDetails from "./LoginDetails";
import InvoiceManagement from "./InvoiceManagement";
import LoginDetails1 from "./LoginDetail1";
import ItemsPurchasedToday from "../../assets/img/ItemsPurchasedToday.png";
import DashboardTotalInventory from "../../assets/img/DashboardTotalInventory.png";
import DashboardLeft from "../../assets/img/Dashboard_TotalInventory.png";
import DashboardRight from "../../assets/img/Dashboard_TotalInventoryRight.png";
function Landingmain() {
  return (
    <div>
      <Register />
      <Addon />
      <Dashboard img={ItemsPurchasedToday} />
      <Plans />
      <Dashboard2 img={DashboardTotalInventory} />
      <LoginDetails />
      <div className="margin-20mob"></div>
      <Dashboard img={DashboardLeft} />
      <InvoiceManagement />
      <div className="margin_20" />
      <Dashboard2 img={DashboardRight} />
      <LoginDetails1 />
      <div className="margin-20mob"></div>
      <Dashboard img={DashboardLeft} />
      <InvoiceManagement />
      <div className="margin_20" />
      {/* <div className="margin-20" /> */}
      <Dashboard2 img={DashboardRight} />
      <div className="margin-20" />
      <Footer />
    </div>
  );
}

export default Landingmain;
