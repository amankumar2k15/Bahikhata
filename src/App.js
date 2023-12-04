import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faBookOpen,
  faBookReader,
  faCaretRight,
  faColumns,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { SyncLoader } from "react-spinners";
import { getToken } from "./helpers/token.helper";

library.add(
  fab,
  faColumns,
  faBookReader,
  faBookOpen,
  faQuestionCircle,
  faCaretRight
);

function App() {
  const routsuser = JSON.parse(sessionStorage.getItem("url"));

  return (
    <Router basename={"/bahikhata/dev/app/"}>
      {/* {!getToken() && <Redirect to={routsuser ? routsuser.path : "/login"} />} */}
      <Suspense
        fallback={
          <>
            <div
              className="d-flex align-items-center justify-content-center w-100"
              style={{ height: "100vh" }}
            >
              <SyncLoader size={20} color="#143B64" />
            </div>
          </>
        }
      >
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
