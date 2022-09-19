import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import SettingsMenuOption from "./SettingsMenuOption";

class SettingsMenu extends HTMLElement {
  private _options: SettingsMenuOption[];

  constructor() {
    super();

    this._options = [];

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: window.theme.settingsView.fg,
    } as CSSStyleDeclaration);
  }

  addOption(text: string, onClick: EventListener) {
    const option = new SettingsMenuOption(text, onClick);
    this.appendChild(option);
    this._options.push(option);
    setTimeout(() => {
      if (this._options.length === 1) option.highlight();
    });
  }
}

customElements.define("settings-menu", SettingsMenu);

export default SettingsMenu;
