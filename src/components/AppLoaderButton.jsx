import React from "react";
import { SyncLoader } from "react-spinners";

const AppLoaderButton = ({ loading, label, className, loaderColor }) => {
  return (
    <button type="submit" className={className} disabled={loading}>
      {!loading ? label : <SyncLoader size={10} color={loaderColor} />}
    </button>
  );
};

export default AppLoaderButton;
