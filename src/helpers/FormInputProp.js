export class FormInputProp {
  constructor(type, name, validation, placeholder, cn) {
    this.type = type || "text";
    this.name = name;
    this.validation = validation;
    this.placeholder = placeholder || "";
    this.divClass = (cn && cn.divCn) || "";
    this.inputClass = (cn && cn.inputCn) || "";
  }
}

export class FormSelectProp {
  constructor(name, validation, placeholder, options, labelKey, cn) {
    this.type = "select";
    this.name = name;
    this.validation = validation;
    this.placeholder = placeholder || "";
    this.labelKey = labelKey || "";
    this.options = options || [];
    this.divClass = (cn && cn.divCn) || "";
    this.inputClass = (cn && cn.inputCn) || "";
  }
}

export class FormFileProp {
  constructor(name, placeholder, accept, onFileChange, cn) {
    this.type = "file";
    this.name = name;
    this.placeholder = placeholder || "";
    this.accept = accept || "image/*";
    this.onFileChange = onFileChange;
    this.divClass = (cn && cn.divCn) || "";
    this.inputClass = (cn && cn.inputCn) || "";
  }
}
