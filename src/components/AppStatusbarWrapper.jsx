import React from "react";
import { useHistory } from "react-router-dom";
import { header_messages } from "../constants/headerMessages";
import CommonUtils from "../utils/common.utils";
import Stocks from "./Dashboard/Stocks";

const AppStatusbarWrapper = ({ children }) => {
  const history = useHistory();
  const pathname = CommonUtils.getPathFromHistory(history);
  const pathId = pathname.substring(1);

  return (
    <div className="tab-content">
      <div id={pathId} className="tab-pane fade active show">
        {children}
      </div>
    </div>
  );
};

export default AppStatusbarWrapper;
