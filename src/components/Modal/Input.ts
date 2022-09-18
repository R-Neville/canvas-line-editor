import { applyStyles } from "../../helpers";

class Input extends HTMLInputElement {
  constructor(onInput: EventListener, defaultValue: string) {
    super();

    if (defaultValue) this.value = defaultValue;

    applyStyles(this, {
      padding: "0 5px",
      height: "30px",
      border: `1px solid ${window.theme.modal.fg}`,
      borderRadius: "3px",
      outline: "none",
      margin: "1em 0",
      fontSize: "1em",
      color: window.theme.modal.fg,
    } as CSSStyleDeclaration);

    this.addEventListener("blur", onInput);
    this.addEventListener("input", onInput);
  }
}

customElements.define("custom-input", Input, { extends: "input" });

export default Input;
