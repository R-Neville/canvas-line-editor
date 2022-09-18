import { applyStyles } from "../helpers";
import { buildCloseIconSVG } from "../icons";
import universalStyles from "../universalStyles";
import Icon from "./Icon";

class Tab extends HTMLElement {
  private _current: boolean;
  private _name: string;
  private _label: HTMLLabelElement;
  private _closeButton: HTMLButtonElement;

  constructor(text: string) {
    super();

    this.title = text;
    this._name = text;
    this._current = false;
    this._label = this.buildLabel();
    this._label.textContent = text;
    this._closeButton = this.buildCloseButton();

    this.appendChild(this._label);
    this.appendChild(this._closeButton);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5em 1em",
      fontSize: "1em",
      color: window.theme.sideBar.fg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", () => {
      const customEvent = new CustomEvent("tab-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("contextmenu", this.onContextMenu as EventListener);
  }

  get name() {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
    this.title = newName;
    this._label.textContent = newName;
  }

  highlight() {
    this._current = true;
    this.style.backgroundColor = window.theme.sideBar.highlightBg;
  }

  unHighlight() {
    this._current = false;
    this.style.backgroundColor = "inherit";
  }

  private onMouseEnter() {
    if (!this._current) {
      this.style.backgroundColor = window.theme.sideBar.highlightBg;
    }
  }

  private onMouseLeave() {
    if (!this._current) {
      this.style.backgroundColor = "inherit";
    }
  }

  private buildLabel() {
    const label = document.createElement("label");
    applyStyles(label, {
      overflowX: "hidden",
      fontSize: "1em",
      color: window.theme.sideBar.fg,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
    } as CSSStyleDeclaration);
    return label;
  }

  private buildCloseButton() {
    const button = document.createElement("button");
    applyStyles(button, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "20px",
      height: "20px",
      border: "none",
      borderRadius: "3px",
      backgroundColor: window.theme.sideBar.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    const icon = new Icon(buildCloseIconSVG(), "10px", true);
    icon.setColor(window.theme.sideBar.fg);
    button.appendChild(icon);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("close-button-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    return button;
  }

  private onContextMenu(event: MouseEvent) {
    const { pageX, pageY } = event;
    const customEvent = new CustomEvent("tab-context-menu", {
      bubbles: true,
      detail: {
        pageX,
        pageY,
      }
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("custom-tab", Tab);

export default Tab;