import React, { useState } from "react";

const AppFormFile = ({
  name,
  accept,
  placeholder,
  divClass,
  inputClass,
  register,
  onFileChange,
}) => {
  const [isImagePreview, setImagePreview] = useState("");
  return (
    <div className={`form-group ${divClass}`}>
      <label
        htmlFor="filePicker"
        className={`text-center app-input-file ${inputClass}`}
      >
        {placeholder}
      </label>
      <input
        type="file"
        hidden
        {...register(name)}
        onChange={(e) => {
          const { files = [] } = e.target;
          if (files) {
            setImagePreview(URL.createObjectURL(files[0]));
          }
          onFileChange(files[0]);
        }}
        className="form-control d-none"
        id="filePicker"
        placeholder={placeholder}
        accept={accept}
      />
      <div className={isImagePreview ? "" : "d-none"}>
        <img src={isImagePreview} className="img-fluid mt-2 w-50" />
      </div>
    </div>
  );
};

export default AppFormFile;
