import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";
import Icon from "./Icon";

class MenuOption extends HTMLElement {
  private _icon: Icon;

  constructor(icon: Icon, onClick: EventListener) {
    super();

    this._icon = icon;
    this._icon.setColor(window.theme.menuBar.fg);
    this.appendChild(this._icon);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      alignItems: "center",
      padding: "0.5em",
      height: "100%",
      borderRadius: "3px",
      backgroundColor: "inherit",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.menuBar.highlightBg;
  }

  private onMouseLeave() {
    this.style.backgroundColor = "inherit";
  }
}

customElements.define("menu-option", MenuOption);

export default MenuOption;