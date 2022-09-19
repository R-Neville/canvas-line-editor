import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import SettingsPageSection from "./SettingsPageSection";

class SettingsPage extends HTMLElement {
  private _sections: SettingsPageSection[];

  constructor() {
    super();

    this._sections = [];

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      flexDirection: "column",
      overflowY: "scroll",
      padding: "1em",
      width: "100%",
    } as CSSStyleDeclaration);
  }

  hide() {
    this.style.display = "none";
  }

  show() {
    this.style.display = "flex";
  }

  addSection(section: SettingsPageSection) {
    this.appendChild(section);
    this._sections.push(section);
  }
}

customElements.define("settings-page", SettingsPage);

export default SettingsPage;
