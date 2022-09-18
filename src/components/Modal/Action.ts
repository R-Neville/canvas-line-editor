import { applyStyles } from "../../helpers";

class Action extends HTMLButtonElement {
  constructor(text: string, onClick: EventListener) {
    super();

    this.textContent = text;

    applyStyles(this, {
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      marginLeft: "0.5em",
      backgroundColor: window.theme.modal.fg,
      fontSize: "1em",
      color: window.theme.modal.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener('click', onClick);
  }
}

customElements.define("chromaticity-action", Action, { extends: "button" });

export default Action;