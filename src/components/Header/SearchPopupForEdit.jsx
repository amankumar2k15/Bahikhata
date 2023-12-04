import React from "react";

const SearchPopup = ({ data, setSearch, setFormData,formData }) => {
  
  return (
    <div className="search-popup">
      {data.length > 0  ? data.map((item,i) =>
      <div
      key={i}
        className="search-popup-data cursor-pointer"
        onClick={() => {
          setFormData({...formData,purchase_from:item.from,phone:item.phone});
          setSearch(false);
        }}
      >
        {`${item.from} (${item.phone})`}
      </div> ): <div
        className="search-popup-data"
        onClick={() => {
            setSearch(false);
          }}
      >No data found</div>
      }
    </div>
  );
};

export default SearchPopup;
