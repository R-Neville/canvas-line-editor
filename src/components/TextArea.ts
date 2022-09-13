import { applyStyles } from "../helpers";
import Theme from "../themes/Theme";
import universalStyles from "../universalStyles";
import LineManager from "../LineManager";
import LineElement from "./LineElement";

class TextArea extends HTMLElement {
  private _theme: Theme;
  private _lineManager: LineManager;
  private _lines: string[];
  private _lineElements: LineElement[];
  private _capsOn: boolean;

  constructor(theme: Theme) {
    super();

    this._theme = theme;
    this._lineManager = new LineManager();
    this._lines = [];
    this._lineElements = [];
    this._capsOn = false;

    applyStyles(this, {
      ...universalStyles,
      position: "relative",
      overflowX: "hidden",
      height: "100%",
      maxWidth: "100%",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);

    this.addEventListener("no-line-selected", this.onNoLineSelected);
    this.addEventListener(
      "line-selected",
      this.onLineSelected as EventListener
    );
    this.addEventListener("line-changed", this.onLineChanged as EventListener);
    this.addEventListener(
      "new-line-requested",
      this.onNewLineRequested as EventListener
    );
    this.addEventListener(
      "line-removal-requested",
      this.onLineRemovalRequested as EventListener
    );
    this.addEventListener(
      "append-text-to-previous-line",
      this.onAppendTextToPreviousLine as EventListener
    );
    this.addEventListener("move-caret-up", this.onMoveCaretUp as EventListener);
    this.addEventListener(
      "move-caret-down",
      this.onMoveCaretDown as EventListener
    );
    this.addEventListener(
      "move-caret-left",
      this.onMoveCaretLeft as EventListener
    );
    this.addEventListener(
      "move-caret-right",
      this.onMoveCaretRight as EventListener
    );
  }

  get capsOn() {
    return this._capsOn;
  }

  set capsOn(value: boolean) {
    this._capsOn = value;
  }

  updateTheme(newTheme: Theme) {
    this._theme = newTheme;
    this._lineElements.forEach((el) => {
      el.updateTheme(this._theme.lineElement);
    });
  }

  appendLine(line: string) {
    const newLineElement = this.buildLine(line);
    this._lines.push(line);
    this._lineElements.push(newLineElement);
    this.appendChild(newLineElement);
    this._lineManager.currentLineCount = this._lineManager.currentLineCount + 1;
  }

  addLine(line: string, index?: number) {
    const newLineElement = this.buildLine(line);
    if (index !== undefined) {
      this._lines.splice(index, 0, line);
      this._lineElements.splice(index, 0, newLineElement);
      this.insertBefore(newLineElement, this.children[index]);
    } else {
      this._lines.push(line);
      this._lineElements.push(newLineElement);
      this.appendChild(newLineElement);
    }
    this._lineManager.currentLineCount = this._lineManager.currentLineCount + 1;
  }

  private buildLine(text: string) {
    const lineElement = new LineElement(this, text, this._theme.lineElement);
    return lineElement;
  }

  private setCaret(line: number, col: number) {
    this._lineManager.updateCaretPos(line, col);
  }

  // Custom event emitting methods:

  private dispatchSelectionChanged() {
    const customEvent = new CustomEvent("selection-changed", {
      bubbles: true,
      detail: {
        caret: this._lineManager.caret,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private dispatchLineCountChanged() {
    const customEvent = new CustomEvent("line-count-changed", {
      bubbles: true,
      detail: {
        delta:
          this._lineManager.currentLineCount - this._lineManager.oldLineCount,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private dispatchContentChanged(lineIndex: number, removed: boolean) {
    const customEvent = new CustomEvent("content-changed", {
      bubbles: true,
      detail: {
        lineIndex,
        removed,
      },
    });
    this.dispatchEvent(customEvent);
  }

  // Event handlers:

  private onNoLineSelected() {
    this.setCaret(-1, -1);
  }

  private onLineSelected(event: CustomEvent) {
    event.stopPropagation();
    const lineElement = event.target as LineElement;
    const { charIndex } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    this.setCaret(lineIndex, charIndex);
    this.dispatchSelectionChanged();
  }

  private onLineChanged(event: CustomEvent) {
    event.stopPropagation();
    const lineElement = event.target as LineElement;
    const { newColStart, newValue } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    this._lines[lineIndex] = newValue;
    this.setCaret(lineIndex, newColStart);
    this.dispatchContentChanged(lineIndex, false);
    this.dispatchSelectionChanged();
  }

  private onNewLineRequested(event: CustomEvent) {
    event.stopPropagation();
    const { textBeforeCaret, textAfterCaret } = event.detail;
    const { lineStart } = this._lineManager.caret;
    const newLineStart = lineStart + 1;
    let indentation = this.getIndentation(textBeforeCaret);
    const newColStart = indentation.length;
    this.addLine(indentation + textAfterCaret, newLineStart);
    this.setCaret(newLineStart, newColStart);
    this._lineElements[newLineStart].focusAt(newColStart);
    this.dispatchLineCountChanged();
    this.dispatchContentChanged(newLineStart, false);
    this.dispatchSelectionChanged();
  }

  private onLineRemovalRequested(event: CustomEvent) {
    event.stopPropagation();
    const lineElement = event.target as LineElement;
    const lineIndex = this._lineElements.indexOf(lineElement);
    if (lineIndex > 0) {
      this._lineElements.splice(lineIndex, 1);
      lineElement.remove();
      this._lines.splice(lineIndex, 1);
      this._lineManager.currentLineCount =
        this._lineManager.currentLineCount - 1;
      const newLineIndex = lineIndex - 1;
      const lineAbove = this._lineElements[newLineIndex];
      const newColStart = lineAbove && lineAbove.text?.length;
      this.setCaret(newLineIndex, newColStart || 0);
      lineAbove.focusAt(newColStart || 0);
      this.dispatchLineCountChanged();
      this.dispatchContentChanged(newLineIndex, true);
      this.dispatchSelectionChanged();
    }
  }

  private onAppendTextToPreviousLine(event: CustomEvent) {
    event.stopPropagation();
    const lineElement = event.target as LineElement;
    const { text } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    if (lineIndex > 0) {
      const newLineIndex = lineIndex - 1;
      const previousLine = this._lineElements[newLineIndex];
      const newColStart = previousLine && previousLine.text?.length;
      this._lines[newLineIndex] += text;
      previousLine.appendText(text);
      this.dispatchContentChanged(newLineIndex, false);
      setTimeout(() => {
        this.setCaret(newLineIndex, newColStart || 0);
        previousLine.focusAt(newColStart || 0);
        this.dispatchSelectionChanged();
      });
    }
  }

  private onMoveCaretUp(event: CustomEvent) {
    event.stopPropagation();
    const { lineStart, colStart } = this._lineManager.caret;
    if (lineStart > 0) {
      const newLineStart = lineStart - 1;
      const lineAbove = this._lineElements[newLineStart];
      let newColStart = colStart;
      if (lineAbove && lineAbove.text.length < colStart) {
        newColStart = lineAbove.text.length;
      }
      this.setCaret(newLineStart, newColStart);
      lineAbove.focusAt(newColStart);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretDown(event: CustomEvent) {
    event.stopPropagation();
    const { lineStart, colStart } = this._lineManager.caret;
    if (lineStart < this._lineManager.currentLineCount - 1) {
      const newLineStart = lineStart + 1;
      const lineBelow = this._lineElements[newLineStart];
      let newColStart = colStart;
      if (lineBelow && lineBelow.text.length < colStart) {
        newColStart = lineBelow.text.length;
      }
      this.setCaret(newLineStart, newColStart);
      lineBelow.focusAt(newColStart);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretLeft(event: CustomEvent) {
    event.stopPropagation();
    const { colStart, lineStart } = this._lineManager.caret;
    if (colStart > 0) {
      const newColStart = colStart - 1;
      const currentLine = this._lineElements[lineStart];
      this.setCaret(lineStart, newColStart);
      currentLine.focusAt(newColStart);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretRight(event: CustomEvent) {
    event.stopPropagation();
    const { colStart, lineStart } = this._lineManager.caret;
    const currentLine = this._lineElements[lineStart];
    if (currentLine.text && colStart < currentLine.text.length) {
      const newColStart = colStart + 1;
      this.setCaret(lineStart, newColStart);
      currentLine.focusAt(newColStart);
      this.dispatchSelectionChanged();
    }
  }

  // Helper methods:

  private getIndentation(textBeforeCaret: string) {
    const matches = textBeforeCaret.match(/^\s+/);
    if (matches) {
      return matches[0];
    }
    return "";
  }
}

customElements.define("editor-text-area", TextArea);

export default TextArea;
