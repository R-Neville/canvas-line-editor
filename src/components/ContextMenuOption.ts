import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class ContextMenuOption extends HTMLElement {

  constructor(text: string, action: EventListener) {
    super();

    this.textContent = text;

    applyStyles(this, {
      ...universalStyles,
      padding: "5px",
      width: "100%",
      backgroundColor: "inherit",
      fontSize: "1em",
      color: window.theme.contextMenu.fg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", action);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.contextMenu.highlightBg;
  }

  private onMouseLeave() {
    this.style.backgroundColor = "inherit";
  }
}

customElements.define("context-menu-option", ContextMenuOption);

export default ContextMenuOption;
