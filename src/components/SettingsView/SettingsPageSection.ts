import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import SettingInput from "./SettingInput";
import SettingCheckbox from "./SettingCheckbox";
import SettingSelector from "./SettingSelector";

class SettingsPageSection extends HTMLElement {
  private _heading: HTMLHeadingElement;
  private _input: SettingInput|null;
  private _checkbox: SettingCheckbox|null;
  private _selector: SettingSelector|null;

  constructor(text: string) {
    super();

    this._heading = document.createElement("h2");
    this._heading.textContent = text;
    this._input = null;
    this._checkbox = null;
    this._selector = null;

    this.appendChild(this._heading);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      width: "100%",
      marginBottom: "1em",
    } as CSSStyleDeclaration);

    applyStyles(this._heading, {
      ...universalStyles,
      paddingBottom: "10px",
      width: "100%",
      margin: "0",
      marginBottom: "1em",
      color: window.theme.settingsView.fg,
    } as CSSStyleDeclaration);
  }

  setInput(input: SettingInput) {
    this.appendChild(input);
    this._input = input;
  }

  setCheckbox(checkbox: SettingCheckbox) {
    this.appendChild(checkbox);
    this._checkbox = checkbox;
  }

  setSelector(selector: SettingSelector) {
    this.appendChild(selector);
    this._selector = selector;
  }
}

customElements.define("settings-page-section", SettingsPageSection);

export default SettingsPageSection;
