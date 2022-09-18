import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class Selector extends HTMLElement {
  private _options: HTMLDivElement[];

  constructor(options: string[]) {
    super();

    this._options = [];

    options.forEach(option => {
      this._addOption(option);
    });

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      height: "200px",
      width: "100%",
      border: `1px solid ${window.theme.modal.fg}`,
      borderRadius: "3px",
      margin: "1em auto",
    });
  }

  _addOption(option: string) {
    const el = document.createElement("div");
    el.textContent = option;
    el.title = option;
    this._options.push(el);
    this.appendChild(el);
    applyStyles(el, {
      ...universalStyles,
      overflow: "hidden",
      padding: "5px",
      width: "100%",
      backgroundColor: window.theme.modal.bg,
      fontSize: "1em",
      wordWrap: "nowrap",
      textOverflow: "ellipsis",
      color: window.theme.modal.fg,
      cursor: "pointer",
    });
    el.addEventListener("mouseenter", () => {
      if (!el.classList.contains("selected")) {
        el.style.backgroundColor = window.theme.modal.fg;
        el.style.color = window.theme.modal.bg;
      }
    });
    el.addEventListener("mouseleave", () => {
      if (!el.classList.contains("selected")) {
        el.style.backgroundColor = window.theme.modal.bg;
        el.style.color = window.theme.modal.fg;
      }
    });
    el.addEventListener("click", () => {
      this._options.forEach((option) => {
        if (option.classList.contains("selected")) {
          option.classList.remove("selected");
          option.style.backgroundColor = window.theme.modal.bg;
          option.style.color = window.theme.modal.fg;
        }
      });
      el.classList.add("selected");
      el.style.backgroundColor = window.theme.modal.fg;
      el.style.color = window.theme.modal.bg;
      const customEvent = new CustomEvent("selection-changed", {
        bubbles: true,
        detail: {
          newValue: option
        }
      });
      this.dispatchEvent(customEvent);
    });
  }
}

customElements.define("custom-selector", Selector);

export default Selector;
