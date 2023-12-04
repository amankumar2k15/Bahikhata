import React from "react";
import { Redirect, Route } from "react-router-dom";

const EmptyLayout = ({ children }) => {
  return <>{children}</>;
};

export const EmptyRoute = ({ component: Component, authToken, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) =>
        authToken ? (
          <EmptyLayout>
            <Component {...matchProps} />
          </EmptyLayout>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
