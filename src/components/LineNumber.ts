import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class LineNumber extends HTMLElement {
  private _highlighted: boolean;

  constructor(num: number) {
    super();

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
      color: window.theme.lineNumber.fg,
    } as CSSStyleDeclaration);
  }

  highlighted() {
    return this._highlighted;
  }

  highlight() {
    this._highlighted = true;
    this.style.color = window.theme.lineNumber.highlightFg;
  }

  unHighlight() {
    this._highlighted = false;
    this.style.color = window.theme.lineNumber.fg;
  }
}

customElements.define("editor-line-number", LineNumber);

export default LineNumber;
