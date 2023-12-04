import React from "react";
import { useDispatch } from "react-redux";
import { setPurchaseFrom } from "../../store/slices/dashboardSlice";

const SearchPopup = ({
  data,
  setSearch,
  setFormData,
  formData,
  fromTab,
  setPurchase,
}) => {
  const dispatch = useDispatch();
  const setPurchaseCallback = (data) => {
    setPurchase(data);
  };

  return (
    <>
      {data.length > 0 && (
        <div className="search-popup">
          {data.map((item, i) => (
            <div
              key={i}
              className="search-popup-data cursor-pointer"
              onClick={() => {
                if (fromTab === "dashboard") {
                  dispatch(
                    setPurchaseFrom({ from: item.from, phone: item.phone })
                  );
                  setSearch(false);
                } else if (fromTab === "purchase") {
                  setPurchaseCallback(item);
                  setSearch(false);
                } else {
                  setFormData({
                    ...formData,
                    purchase_from: item.from,
                    phone: item.phone,
                  });
                  setSearch(false);
                }
              }}
            >
              {`${item.from} (${item.phone})`}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchPopup;
