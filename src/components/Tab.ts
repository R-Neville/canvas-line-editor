import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";

class Tab extends HTMLElement {
  private _theme: ComponentTheme;
  private _current: boolean;

  constructor(text: string, theme: ComponentTheme) {
    super();

    this.textContent = text;
    this._theme = theme;
    this._current = false;

    applyStyles(this, {
      ...universalStyles,
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

    } as CSSStyleDeclaration);
  }
}

customElements.define("custom-tab", Tab);

export default Tab;