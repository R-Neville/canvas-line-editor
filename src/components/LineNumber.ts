import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";

class LineNumber extends HTMLElement {
  private _highlighted: boolean;
  private _theme: ComponentTheme;

  constructor(num: number, theme: ComponentTheme) {
    super();

    this._theme = theme;

    this._highlighted = false;

    this.textContent = num.toString();

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "flex-end",
      paddingLeft: "20px",
      paddingRight: "5px",
      minWidth: "70px",
      border: "none",
      borderTop: "1px solid transparent",
      borderBottom: "1px solid transparent",
      backgroundColor: "inherit",
      fontSize: "14px",
      lineHeight: "18px",
      color: this._theme.fg,
    } as CSSStyleDeclaration);
  }

  updateTheme(newTheme: ComponentTheme) {
    this._theme = newTheme;
  }

  highlighted() {
    return this._highlighted;
  }

  highlight() {
    this._highlighted = true;
    this.style.color = this._theme.highlightFg;
  }

  unHighlight() {
    this._highlighted = false;
    this.style.color = this._theme.fg;
  }
}

customElements.define("editor-line-number", LineNumber);

export default LineNumber;
