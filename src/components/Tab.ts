import { applyStyles } from "../helpers";
import { buildCloseIconSVG } from "../icons";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";
import Icon from "./Icon";

class Tab extends HTMLElement {
  private _theme: ComponentTheme;
  private _current: boolean;
  private _name: string;
  private _label: HTMLLabelElement;
  private _closeButton: HTMLButtonElement;

  constructor(text: string, theme: ComponentTheme) {
    super();

    this.title = text;
    this._name = text;
    this._theme = theme;
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
      color: this._theme.fg,
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
  }

  highlight() {
    this._current = true;
    this.style.backgroundColor = this._theme.highlightBg;
  }

  unHighlight() {
    this._current = false;
    this.style.backgroundColor = "inherit";
  }

  private onMouseEnter() {
    if (!this._current) {
      this.style.backgroundColor = this._theme.highlightBg;
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
      color: this._theme.fg,
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
      backgroundColor: this._theme.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    const icon = new Icon(buildCloseIconSVG(), "10px", true);
    icon.setColor(this._theme.fg);
    button.appendChild(icon);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("close-button-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    return button;
  }
}

customElements.define("custom-tab", Tab);

export default Tab;