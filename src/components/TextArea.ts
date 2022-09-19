import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";
import LineManager, { LMSelection } from "../LineManager";
import LineElement from "./LineElement";

class TextArea extends HTMLElement {
  private _lineManager: LineManager;
  private _lines: string[];
  private _lineElements: LineElement[];
  private _capsOn: boolean;
  private _selecting: boolean;
  private _current: boolean;

  constructor() {
    super();

    this._lineManager = new LineManager();
    this._lines = [];
    this._lineElements = [];
    this._capsOn = false;
    this._selecting = false;
    this._current = false;

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
    this.addEventListener("line-blurred", this.onLineBlurred as EventListener);
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
    this.addEventListener("mousedown", this.onMouseDown as EventListener);
    this.addEventListener(
      "scroll-to-line-end",
      this.onScrollToLineEnd as EventListener
    );
    this.addEventListener(
      "insert-text-requested",
      this.onInsertTextRequested as EventListener
    );
    document.addEventListener(
      "keydown",
      this.onKeyDown.bind(this) as EventListener
    );
  }

  get capsOn() {
    return this._capsOn;
  }

  set capsOn(value: boolean) {
    this._capsOn = value;
  }

  get selecting() {
    return this._selecting;
  }

  set current(newValue: boolean) {
    this._current = newValue;
  }

  refresh() {
    this._lineElements.forEach((lineElement) => {
      lineElement.height = window.configManager.lineHeight;
      lineElement.refresh();
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
    const lineElement = new LineElement(this, text);
    return lineElement;
  }

  private setCaret(line: number, col: number) {
    this._lineManager.updateCaretPos(line, col);
  }

  private selectionStart() {
    return this._lineManager.selectionStart;
  }

  private setSelectionStart(line?: number, col?: number) {
    if (line === undefined || col === undefined) {
      this._lineManager.selectionStart = null;
    } else {
      this._lineManager.selectionStart = {
        line,
        col,
      } as LMSelection;
    }
  }

  private selectionEnd() {
    return this._lineManager.selectionEnd;
  }

  private setSelectionEnd(line?: number, col?: number) {
    if (line === undefined || col === undefined) {
      this._lineManager.selectionEnd = null;
    } else {
      this._lineManager.selectionEnd = {
        line,
        col,
      } as LMSelection;
    }
  }

  private clearSelection() {
    const selectionStart = this.selectionStart();
    const selectionEnd = this.selectionEnd();
    if (selectionStart !== null && selectionEnd !== null) {
      let selectedLineElements: LineElement[];
      if (selectionStart.line < selectionEnd.line) {
        selectedLineElements = this._lineElements.slice(
          selectionStart.line,
          selectionEnd.line + 1
        );
      } else if (selectionStart.line > selectionEnd.line) {
        selectedLineElements = this._lineElements.slice(
          selectionEnd.line,
          selectionStart.line + 1
        );
      } else {
        selectedLineElements = [this._lineElements[selectionStart.line]];
      }
      selectedLineElements.forEach((lineElement) => {
        lineElement.refresh();
      });
    }
    this.setSelectionStart();
    this.setSelectionEnd();
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
    if (!this._selecting) {
      this.clearSelection();
    }
    const lineElement = event.target as LineElement;
    const { colIndex } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    this.setCaret(lineIndex, colIndex);
    this.dispatchSelectionChanged();
  }

  private onLineBlurred(event: CustomEvent) {
    event.stopPropagation();
    const lineElement = event.target as LineElement;
    const index = this._lineElements.indexOf(lineElement);
    const customEvent = new CustomEvent("unhighlight-line-number", {
      bubbles: true,
      detail: {
        index,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private onLineChanged(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const lineElement = event.target as LineElement;
    const { newColIndex, newValue } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    this._lines[lineIndex] = newValue;
    this.setCaret(lineIndex, newColIndex);
    this.dispatchContentChanged(lineIndex, false);
    this.dispatchSelectionChanged();
  }

  private onNewLineRequested(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const { textBeforeCaret, textAfterCaret } = event.detail;
    const { line: lineIndex } = this._lineManager.caret;
    const newLineIndex = lineIndex + 1;
    let indentation = this.getIndentation(textBeforeCaret);
    const newColIndex = indentation.length;
    this.addLine(indentation + textAfterCaret, newLineIndex);
    this.setCaret(newLineIndex, newColIndex);
    this._lineElements[newLineIndex].focusAt(newColIndex);
    this.dispatchLineCountChanged();
    this.dispatchContentChanged(newLineIndex, false);
    this.dispatchSelectionChanged();
  }

  private onLineRemovalRequested(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const lineElement = event.target as LineElement;
    const lineIndex = this._lineElements.indexOf(lineElement);
    if (lineIndex > 0) {
      this.removeLineAtIndex(lineIndex);
    }
  }

  private onAppendTextToPreviousLine(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const lineElement = event.target as LineElement;
    const { text } = event.detail;
    const lineIndex = this._lineElements.indexOf(lineElement);
    if (lineIndex > 0) {
      const newLineIndex = lineIndex - 1;
      const previousLine = this._lineElements[newLineIndex];
      const newColIndex = previousLine && previousLine.text?.length;
      this._lines[newLineIndex] += text;
      previousLine.appendText(text);
      this.dispatchContentChanged(newLineIndex, false);
      setTimeout(() => {
        this.setCaret(newLineIndex, newColIndex || 0);
        previousLine.focusAt(newColIndex || 0);
        this.dispatchSelectionChanged();
      });
    }
  }

  private onMoveCaretUp(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const { line: lineIndex, col: colIndex } = this._lineManager.caret;
    if (lineIndex > 0) {
      const newLineIndex = lineIndex - 1;
      const lineAbove = this._lineElements[newLineIndex];
      let newColIndex = colIndex;
      if (lineAbove && lineAbove.text.length < colIndex) {
        newColIndex = lineAbove.text.length;
      }
      this.setCaret(newLineIndex, newColIndex);
      lineAbove.focusAt(newColIndex);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretDown(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const { line: lineIndex, col: colIndex } = this._lineManager.caret;
    if (lineIndex < this._lineManager.currentLineCount - 1) {
      const newLineIndex = lineIndex + 1;
      const lineBelow = this._lineElements[newLineIndex];
      let newColIndex = colIndex;
      if (lineBelow && lineBelow.text.length < colIndex) {
        newColIndex = lineBelow.text.length;
      }
      this.setCaret(newLineIndex, newColIndex);
      lineBelow.focusAt(newColIndex);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretLeft(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const { col: colIndex, line: lineIndex } = this._lineManager.caret;
    if (colIndex > 0) {
      const newColIndex = colIndex - 1;
      const currentLine = this._lineElements[lineIndex];
      this.setCaret(lineIndex, newColIndex);
      currentLine.focusAt(newColIndex);
      this.dispatchSelectionChanged();
    }
  }

  private onMoveCaretRight(event: CustomEvent) {
    event.stopPropagation();
    this.clearSelection();
    const { col: colIndex, line: lineIndex } = this._lineManager.caret;
    const currentLine = this._lineElements[lineIndex];
    if (currentLine.text && colIndex < currentLine.text.length) {
      const newColIndex = colIndex + 1;
      this.setCaret(lineIndex, newColIndex);
      currentLine.focusAt(newColIndex);
      this.dispatchSelectionChanged();
    }
  }

  private onMouseDown(event: MouseEvent) {
    if (event.target === this) {
      this.clearSelection();
      return;
    }
    const { pageX: initPageX } = event;
    let oldY = event.pageY;
    const initLineElement = event.target as LineElement;
    const initLineIndex = this._lineElements.indexOf(initLineElement);
    const lineX = initLineElement.getBoundingClientRect().left;
    let initColIndex = Math.round(
      (initPageX - lineX) / initLineElement.charWidth()
    );
    if (initColIndex > initLineElement.text.length) {
      initColIndex = initLineElement.text.length;
    }

    this.setSelectionStart(initLineIndex, initColIndex);
    this.setSelectionEnd(initLineIndex, initColIndex);

    const onMouseMove = (event: MouseEvent) => {
      if (event.target === this) return;
      initLineElement.blur();
      this._selecting = true;
      const { pageX, pageY } = event;
      const targetLineElement = event.target as LineElement;
      const targetLineIndex = this._lineElements.indexOf(targetLineElement);
      let newColIndex = Math.round(
        (pageX - lineX) / targetLineElement.charWidth()
      );
      if (newColIndex > targetLineElement.text.length) {
        newColIndex = targetLineElement.text.length;
      }
      this.setSelectionEnd(targetLineIndex, newColIndex);

      const selectionStart = this.selectionStart();
      const selectionEnd = this.selectionEnd();
      if (selectionStart && selectionEnd) {
        const deltaY = pageY - oldY;
        if (targetLineIndex === initLineIndex) {
          // Selection is on one line - the current/initial line:
          targetLineElement.drawSelection(selectionStart.col, selectionEnd.col);
          const previousLine = this._lineElements[initLineIndex - 1];
          if (previousLine) {
            previousLine.refresh();
          }
          const nextLine = this._lineElements[initLineIndex + 1];
          if (nextLine) {
            nextLine.refresh();
          }
        } else if (deltaY > 0) {
          // Selection is moving down:
          if (targetLineIndex > initLineIndex) {
            // Selection is moving away from the inital line index:
            const previousLineElement = this._lineElements[targetLineIndex - 1];
            if (previousLineElement !== initLineElement) {
              previousLineElement.drawSelection(
                0,
                previousLineElement.text.length
              );
            } else {
              initLineElement.drawSelection(
                selectionStart.col,
                previousLineElement.text.length
              );
            }
            targetLineElement.drawSelection(0, selectionEnd.col);
          } else {
            // Selection is moving towards the initial line index:
            const previousLineElement = this._lineElements[targetLineIndex - 1];
            if (
              previousLineElement &&
              previousLineElement !== initLineElement
            ) {
              previousLineElement.refresh();
            } else if (previousLineElement) {
              initLineElement.drawSelection(
                selectionStart.col,
                previousLineElement.text.length
              );
            }
            targetLineElement.drawSelection(
              selectionEnd.col,
              targetLineElement.text.length
            );
          }
        } else if (deltaY < 0) {
          // Selection is moving up the page:
          if (targetLineIndex < initLineIndex) {
            // Selection is moving away from the initial line index:
            const nextLineElement = this._lineElements[targetLineIndex + 1];
            if (nextLineElement !== initLineElement) {
              nextLineElement.drawSelection(0, nextLineElement.text.length);
            } else {
              initLineElement.drawSelection(0, selectionStart.col);
            }
            targetLineElement.drawSelection(
              selectionEnd.col,
              targetLineElement.text.length
            );
          } else {
            // Selection is moving towards the initial line index:
            const nextLineElement = this._lineElements[targetLineIndex + 1];
            if (nextLineElement && nextLineElement !== initLineElement) {
              nextLineElement.refresh();
            } else {
              initLineElement.drawSelection(0, initLineElement.text.length);
            }
            targetLineElement.drawSelection(0, selectionEnd.col);
          }
        }
      }
      oldY = pageY;
    };

    const onMouseUp = () => {
      this._selecting = false;
      this.removeEventListener("mousemove", onMouseMove as EventListener);
      document.removeEventListener("mouseup", onMouseUp.bind(this));
    };

    this.addEventListener("mousemove", onMouseMove as EventListener);
    document.addEventListener("mouseup", onMouseUp.bind(this));
  }

  private onScrollToLineEnd(event: CustomEvent) {}

  private onKeyDown(event: KeyboardEvent) {
    if (!this._current) return;
    switch (event.key) {
      case "Backspace":
        this.deleteSelectedText();
        this.setSelectionStart();
        this.setSelectionEnd();
        return;
      case "Delete":
        this.deleteSelectedText();
        this.setSelectionStart();
        this.setSelectionEnd();
        return;
      case "Enter":
        this.deleteSelectedText();
        const newIndex = this._lineManager.caret.line + 1;
        this.addLine("", newIndex);
        this.setCaret(newIndex, 0);
        this._lineElements[newIndex].focusAt(0);
        this.dispatchLineCountChanged();
        this.dispatchContentChanged(newIndex, false);
        this.dispatchSelectionChanged();
        return;
      default:
        break;
    }

    if (event.ctrlKey && event.key === "c") {
      this.copySelectedText();
      return;
    }

    if (event.ctrlKey && event.key === "x") {
      this.copySelectedText();
      this.deleteSelectedText();
      return;
    }

    const selectionStart = this.selectionStart();
    const selectionEnd = this.selectionEnd();

    if (selectionStart && selectionEnd && event.key.length === 1) {
      this.deleteSelectedText();
      const customEvent = new CustomEvent("insert-text-requested", {
        bubbles: true,
        detail: {
          text: event.key,
        },
      });
      this.dispatchEvent(customEvent);
    }
  }

  private onInsertTextRequested(event: CustomEvent) {
    const { text } = event.detail;
    const { line, col } = this._lineManager.caret;
    this._lineElements[line].insertText(text, col);
  }

  // Helper methods:

  private getIndentation(textBeforeCaret: string) {
    const matches = textBeforeCaret.match(/^\s+/);
    if (matches) {
      return matches[0];
    }
    return "";
  }

  private deleteSelectedText() {
    const selectionStart = this.selectionStart();
    const selectionEnd = this.selectionEnd();
    if (selectionStart && selectionEnd) {
      if (selectionStart.line === selectionEnd.line) {
        const lineIndex = selectionStart.line;
        if (selectionStart.col < selectionEnd.col) {
          this.deleteTextFromLine(
            lineIndex,
            selectionStart.col,
            selectionEnd.col
          );
          this.setCaret(lineIndex, selectionStart.col);
          this._lineElements[lineIndex].focusAt(selectionStart.col);
        } else {
          this.deleteTextFromLine(
            lineIndex,
            selectionEnd.col,
            selectionStart.col
          );
          this.setCaret(lineIndex, selectionEnd.col);
          this._lineElements[lineIndex].focusAt(selectionEnd.col);
        }
      } else if (selectionStart.line < selectionEnd.line) {
        const lastLineIndex = selectionEnd.line;
        const lastLine = this._lineElements[lastLineIndex];
        this.deleteTextFromLine(lastLineIndex, 0, selectionEnd.col);
        if (lastLine.text.length === 0) {
          this.removeLineAtIndex(lastLineIndex);
        }
        let i = lastLineIndex - 1;
        while (i > selectionStart.line) {
          this.removeLineAtIndex(i);
          i--;
        }
        const firstLineIndex = selectionStart.line;
        const firstLine = this._lineElements[firstLineIndex];
        this.deleteTextFromLine(
          firstLineIndex,
          selectionStart.col,
          firstLine.text.length
        );
        this.setCaret(
          firstLineIndex,
          this._lineElements[firstLineIndex].text.length
        );
        this._lineElements[firstLineIndex].focusAt(
          this._lineElements[firstLineIndex].text.length
        );
      } else {
        const lastLineIndex = selectionStart.line;
        const lastLine = this._lineElements[lastLineIndex];
        this.deleteTextFromLine(lastLineIndex, 0, selectionStart.col);
        if (lastLine.text.length === 0) {
          this.removeLineAtIndex(lastLineIndex);
        }
        let i = lastLineIndex - 1;
        while (i > selectionEnd.line) {
          this.removeLineAtIndex(i);
          i--;
        }
        const firstLineIndex = selectionEnd.line;
        const firstLine = this._lineElements[firstLineIndex];
        this.deleteTextFromLine(
          firstLineIndex,
          selectionEnd.col,
          firstLine.text.length
        );
        this.setCaret(
          firstLineIndex,
          this._lineElements[firstLineIndex].text.length
        );
        this._lineElements[firstLineIndex].focusAt(
          this._lineElements[firstLineIndex].text.length
        );
      }
    }
  }

  private removeLineAtIndex(index: number) {
    const lineElement = this._lineElements.splice(index, 1)[0];
    lineElement.remove();
    this._lines.splice(index, 1);
    this._lineManager.currentLineCount = this._lineManager.currentLineCount - 1;
    const newLineIndex = index - 1;
    const lineAbove = this._lineElements[newLineIndex];
    const newColIndex = lineAbove && lineAbove.text.length;
    this.setCaret(newLineIndex, newColIndex || 0);
    lineAbove.focusAt(newColIndex || 0);
    this.dispatchLineCountChanged();
    this.dispatchContentChanged(newLineIndex, true);
    this.dispatchSelectionChanged();
  }

  private copySelectedText() {
    const selectionStart = this.selectionStart();
    const selectionEnd = this.selectionEnd();
    let text = "";
    if (selectionStart && selectionEnd) {
      if (selectionStart.line === selectionEnd.line) {
        const lineIndex = selectionStart.line;
        if (selectionStart.col < selectionEnd.col) {
          text += this._lines[lineIndex].slice(
            selectionStart.col,
            selectionEnd.col
          );
        } else {
          text += this._lines[lineIndex].slice(
            selectionEnd.col,
            selectionStart.col
          );
        }
      } else if (selectionStart.line < selectionEnd.line) {
        const startLineIndex = selectionStart.line;
        const endLineIndex = selectionEnd.line;
        text += this._lines[startLineIndex].slice(selectionStart.col) + "\n";
        let i = startLineIndex + 1;
        while (i < endLineIndex) {
          text += this._lines[i] + "\n";
          i++;
        }
        text += this._lines[endLineIndex].slice(0, selectionEnd.col);
      } else {
        const startLineIndex = selectionEnd.line;
        const endLineIndex = selectionStart.line;
        text += this._lines[startLineIndex].slice(selectionEnd.col) + "\n";
        let i = startLineIndex + 1;
        while (i < endLineIndex) {
          text += this._lines[i] + "\n";
          i++;
        }
        text += this._lines[endLineIndex].slice(0, selectionStart.col);
      }
    }
    this.copyToClipboard(text);
  }

  private deleteTextFromLine(
    lineIndex: number,
    colStart: number,
    colEnd: number
  ) {
    const oldText = this._lines[lineIndex];
    const newText = oldText.slice(0, colStart) + oldText.slice(colEnd);
    this._lines[lineIndex] = newText;
    this._lineElements[lineIndex].update(newText);
  }

  private copyToClipboard(text: string) {
    window.navigator.clipboard.writeText(text);
  }
}

customElements.define("editor-text-area", TextArea);

export default TextArea;
