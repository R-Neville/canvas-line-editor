import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class SettingCheckbox extends HTMLElement {
  private _value: boolean;
  private _states: string[];
  private _stateDiv: HTMLDivElement;
  private _checkbox: HTMLDivElement;
  private _action: Function;

  constructor(value: boolean, action: Function, states: [string, string]) {
    super();
    
    this._value = value;
    this._checkbox = this.buildCheckBox();
    this._states = states;
    this._stateDiv = this.buildStateDiv();
    this.appendChild(this._stateDiv);

    this.append(this._checkbox);

    this._action = action;

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      userSelect: "none",
    } as CSSStyleDeclaration);
  }

  private buildCheckBox() {
    const checkbox = document.createElement("div");
    applyStyles(checkbox, {
      ...universalStyles,
      width: "20px",
      height: "20px",
      border: `2px solid ${window.theme.settingsView.highlightFg}`,
      borderRadius: "50%",
      backgroundColor: window.theme.settingsView.bg,
    } as CSSStyleDeclaration);

    const checked = document.createElement("div");
    applyStyles(checked, {
      ...universalStyles,
      display: this._value ? "block" : "none",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: window.theme.settingsView.fg,
    } as CSSStyleDeclaration);

    checkbox.appendChild(checked);

    this.addEventListener("click", () => {
      if (this._value) {
        this._value = false;
        checked.style.display = "none";
        if (this._stateDiv) this._stateDiv.textContent = this._states[0];
      } else {
        this._value = true;
        checked.style.display = "block";
        if (this._stateDiv) this._stateDiv.textContent = this._states[1];
      }

      this._action();
    });

    return checkbox;
  }

  private buildStateDiv() {
    const div = document.createElement("div");
    div.textContent = this._value ? this._states[1] : this._states[0];
    applyStyles(div, {
      ...universalStyles,
      marginRight: "1em",
      fontSize: "1em",
      color: window.theme.settingsView.fg,
    } as CSSStyleDeclaration);

    return div;
  }
}

customElements.define("setting-checkbox", SettingCheckbox);

export default SettingCheckbox;
