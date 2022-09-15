import { applyStyles } from "../helpers";
import Icon from "./Icon";

class MenuOption extends HTMLElement {
  private _icon: Icon;

  constructor(icon: Icon, onClick: EventListener) {
    super();

    this._icon = icon;
    this._icon.setColor("#000");
    this.appendChild(this._icon);

    applyStyles(this, {
      display: "flex",
      alignItems: "center",
      padding: "0.5em",
      height: "100%",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
  }
}

customElements.define("menu-option", MenuOption);

export default MenuOption;