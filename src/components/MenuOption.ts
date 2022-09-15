import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import Icon from "./Icon";

class MenuOption extends HTMLElement {
  private _icon: Icon;
  private _theme: ComponentTheme;

  constructor(icon: Icon, onClick: EventListener, theme: ComponentTheme) {
    super();

    this._theme = theme;
    this._icon = icon;
    this._icon.setColor(this._theme.fg);
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