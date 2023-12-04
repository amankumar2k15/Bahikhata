import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppHeader from "../components/AppHeader";
import AppNavigation from "../components/AppNavigation";
import AppStatusbar from "../components/AppStatusbar";
import AppStatusbarWrapper from "../components/AppStatusbarWrapper";
import AppStockNotification from "../components/AppStockNotification";
import AppToolbar from "../components/AppToolbar";
import HeaderNew from "../components/Header/HeaderNew";
import { getAuthToken } from "../reducers/user/user.selectors";

const AppLayout = ({ path, component: Component, authToken, ...rest }) => {
  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          authToken ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/landing",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  };
  const isPublicRoute = ["/login", "/register", "/forgot-password", "/landing"].some(
    (item) => item === path
  );
  return isPublicRoute ? (
    <Route exact path={path}>
      <Component authToken={authToken} {...rest} />
    </Route>
  ) : (
    <PrivateRoute exact authToken={authToken} path={path}>
      <>
        <HeaderNew />
        <ToastContainer />
        {/* <AppHeader />
        <AppNavigation />
        <AppStatusbarWrapper>
          <AppStockNotification />
          <AppStatusbar />
          <AppToolbar />
        </AppStatusbarWrapper> */}
        <Component authToken={authToken} {...rest} />
      </>
    </PrivateRoute>
  );
};

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
});

export default connect(mapStateToProps)(AppLayout);
