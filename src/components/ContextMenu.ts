import { applyStyles } from "../helpers";
import ContextMenuOption from "./ContextMenuOption";

class ContextMenu extends HTMLElement {

  constructor() {
    super();

    applyStyles(this, {
      display: "none",
      flexDirection: "column",
      position: "absolute",
      zIndex: "99",
      width: "200px",
      backgroundColor: window.theme.contextMenu.bg,
    } as CSSStyleDeclaration);

    document.addEventListener(
      "click",
      this.onClickAway.bind(this) as EventListener
    );
  }

  addOption(text: string, action: EventListener) {
    const option = new ContextMenuOption(text, action);
    this.appendChild(option);
  }

  show(x: number, y: number) {
    this.style.left = x + "px";
    this.style.top = y + "px";
    this.style.display = "flex";
  }

  destroy() {
    this.remove();
    document.removeEventListener("click", this.onClickAway);
  }

  private onClickAway(event: Event) {
    this.destroy();
  }
}

customElements.define("context-menu", ContextMenu);

export default ContextMenu;
