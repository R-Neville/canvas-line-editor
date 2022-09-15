import { applyStyles } from "../helpers";
import Theme from "../themes/Theme";
import universalStyles from "../universalStyles";
import LineNumber from "./LineNumber";

class Margin extends HTMLElement {
  private _theme: Theme;
  private _lineNumbers: LineNumber[];

  constructor(theme: Theme) {
    super();

    this._theme = theme;
    this._lineNumbers = [];

    applyStyles(this, {
      ...universalStyles,
      display: "block",
      paddingRight: "10px",
      height: "100%",
      backgroundColor: "inherit",
      userSelect: "none",
    } as CSSStyleDeclaration);
  }

  updateTheme(newTheme: Theme) {
    this._theme = newTheme;
    this._lineNumbers.forEach((ln) => {
      ln.updateTheme(this._theme.lineNumber);
    });
  }

  appendLines(lineCount: number) {
    for (let i = 0; i < lineCount; i++) {
      const lineNumber = this.buildLineNumber(this._lineNumbers.length + 1);
      this._lineNumbers.push(lineNumber);
      this.appendChild(lineNumber);
    }
  }

  updateLineNumbers(delta: number) {
    if (delta > 0) {
      do {
        const newLineNumber = this.buildLineNumber(
          this._lineNumbers.length + 1
        );
        this._lineNumbers.push(newLineNumber);
        this.appendChild(newLineNumber);
        delta--;
      } while (delta > 0);
    }

    if (delta < 0) {
      do {
        const lineToRemove = this._lineNumbers.pop();
        if (lineToRemove) {
          lineToRemove.remove();
        }
        delta++;
      } while (delta < 0);
    }
  }

  highlightLineNumber(index: number) {
    // Add new highlight
    this._lineNumbers[index].highlight();
  }

  unHighlightLineNumber(index: number) {
    this._lineNumbers[index].unHighlight();
  }

  unHighlightLineNumbers() {
    this._lineNumbers.forEach((ln) => {
      if (ln.highlighted()) ln.unHighlight();
    });
  }

  private buildLineNumber(num: number) {
    const lineNumber = new LineNumber(num, this._theme.lineNumber);
    return lineNumber;
  }
}

customElements.define("editor-margin", Margin);

export default Margin;
