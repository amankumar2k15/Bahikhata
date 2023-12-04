import React from "react";
import HeaderNew from "../components/Header/HeaderNew";
import { useHistory, Route } from "react-router-dom";

const MainLayout = ({ children }) => {
  return (
    <>
      <HeaderNew />
      {children}
    </>
  );
};

export const MainRoute = ({ component: Component, authToken, ...rest }) => {
  
  if (!authToken || authToken === "") {
    const history = useHistory();
    history.replace("/login");
  }
  return (
    <Route
      history={history}
      {...rest}
      render={(matchProps) => (
        <MainLayout>
          <Component {...matchProps} />
        </MainLayout>
      )}
    />
  );
};
