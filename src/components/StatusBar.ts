import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class StatusBar extends HTMLElement {
  private _caretPosDiv: HTMLDivElement;
  private _spacesDiv: HTMLDivElement;
  private _capsDiv: HTMLDivElement;
  
  constructor() {
    super();

    this._caretPosDiv = this.buildCaretPosDiv();
    this._spacesDiv = this.buildSpacesDiv();
    this._capsDiv = this.buildCapsDiv()

    this.appendChild(this._capsDiv);
    this.appendChild(this._spacesDiv);
    this.appendChild(this._caretPosDiv);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: "5px",
      width: "100%",
      height: "40px",
      backgroundColor: window.theme.editor.highlightBg,
    } as CSSStyleDeclaration);
  }

  updateCaretPos(line: number, col: number) {
    this._caretPosDiv.textContent = `${line} | ${col}`
  }

  updateCapsOn(capsOn: boolean) {
    this._capsDiv.textContent = capsOn ? "CAPS" : "caps";
  }

  updateSpaces() {
    this._spacesDiv.textContent = `Tab(${window.configManager.tabSize})`;
  }

  private buildCaretPosDiv() {
    const div = document.createElement("div");
    applyStyles(div, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 0.5em",
      fontSize: "1em",
      color: window.theme.editor.fg,
    } as CSSStyleDeclaration);
    div.textContent = "1 | 1";
    return div;
  }

  private buildSpacesDiv() {
    const div = document.createElement("div");
    applyStyles(div, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 0.5em",
      fontSize: "1em",
      color: window.theme.editor.fg,
    } as CSSStyleDeclaration);
    div.textContent = `Tab(${window.configManager.tabSize})`;
    return div;
  }

  private buildCapsDiv() {
    const div = document.createElement("div");
    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 0.5em",
      fontSize: "1em",
      color: window.theme.editor.fg,
    } as CSSStyleDeclaration);
    div.textContent = "caps";
    return div;
  }
}

customElements.define("status-bar", StatusBar);

export default StatusBar;