import React, { lazy, useEffect } from "react";
import { Switch } from "react-router-dom";
import Footer from "./utils/Footer";
import axios from "axios";
import { getToken } from "./helpers/token.helper";
import AppLayout from "./layouts/AppLayout";

const Khata = lazy(() => import("./components/Khata/Khata"));
const ClientKhata = lazy(() => import("./components/Khata/ClientKhata"));
const Debtors = lazy(() => import("./components/Khata/Debtors"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const Purchase = lazy(() => import("./components/Purchase"));
const Inventory = lazy(() => import("./components/Inventory"));
const Sales = lazy(() => import("./components/Sales"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const DashboardV2 = lazy(() => import("./pages/Dashboard"));
const landingmain = lazy(() => import("./components/landing/Landingmain"));
// axios interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AppRoutes = ({ authToken }) => {
  const routeList = [
    {
      path: "/landing",
      component: landingmain,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/khata",
      component: Khata,
    },
    {
      path: "/purchase",
      component: Purchase,
    },
    {
      path: "/inventory",
      component: Inventory,
    },
    {
      path: "/sales",
      component: Sales,
    },
    {
      path: "/debtors",
      component: Debtors,
    },
    {
      path: "/clientkhata",
      component: ClientKhata,
    },
    {
      path: "/profile",
      component: Profile,
    },
    {
      path: "/dashboard",
      component: DashboardV2,
    },
    {
      path: "/",
      component: Dashboard,
    },
  ];
  return (
    <>
      <Switch>
        {routeList.map((route) => (
          <AppLayout key={route.path} {...route} />
        ))}
      </Switch>
      <Footer />
    </>
  );
};

export default AppRoutes;
