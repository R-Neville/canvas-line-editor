import { applyStyles } from "../../helpers";
import SettingOption from "./SettingOption";

class SettingSelector extends HTMLElement {
  private _currentValue: string;
  private _options: SettingOption[];
  private _expander: HTMLDivElement;
  private _dropdown: HTMLDivElement;

  constructor(initialValue: string, callback: Function) {
    super();

    this._currentValue = initialValue;
    this._options = [];
    this._expander = document.createElement("div");
    this._expander.textContent = this._currentValue;
    this._dropdown = document.createElement("div");

    this.appendChild(this._expander);
    this.appendChild(this._dropdown);

    applyStyles(this, {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      userSelect: "none",
    } as CSSStyleDeclaration);

    applyStyles(this._expander, {
      display: "flex",
      flexDirection: "row",
      padding: "5px",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    applyStyles(this._dropdown, {
      display: "none",
      flexDirection: "column",
    } as CSSStyleDeclaration);

    this.addEventListener("selection-changed", (event) => {
      event.stopPropagation();
      const option = event.target as SettingOption;
      if (option.value !== this._currentValue) {
        this._expander.textContent = option.value;
        this._currentValue = option.value;
        callback(this._currentValue);
      }
      this._expander.style.border = "none";
      this._dropdown.style.display = "none";
    });

    this._expander.addEventListener("click", (event) => {
      if (this._dropdown.style.display !== "none") {
        this._expander.style.border = "none";
        this._dropdown.style.display = "none";
      } else {
        this._expander.style.borderBottom = `1px solid #FFF`;
        this._dropdown.style.display = "flex";
      }
    });

    this._dropdown.addEventListener("focusout", () => {
      this._expander.style.border = "none";
      this._dropdown.style.display = "none";
    });
  }

  addOption(option: SettingOption) {
    this._options.push(option);
    this._dropdown.appendChild(option);
  }
}

customElements.define("setting-selector", SettingSelector);

export default SettingSelector;
