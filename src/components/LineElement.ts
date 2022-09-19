import { applyStyles } from "../helpers";
import TextArea from "./TextArea";

interface PairingChar {
  open: string;
  close: string;
}

const PAIRING_CHARS = [
  { open: "(", close: ")" },
  { open: "{", close: "}" },
  { open: "[", close: "]" },
  { open: "'", close: "'" },
  { open: '"', close: '"' },
  { open: "`", close: "`" },
] as PairingChar[];

function getPairFromOpen(char: string) {
  const found = PAIRING_CHARS.filter((pair) => {
    return pair.open === char;
  });
  if (found.length > 0) {
    return found[0];
  }
  return null;
}

function isPair(char1: string, char2: string) {
  for (let pair of PAIRING_CHARS) {
    if (char1 === pair.open && char2 === pair.close) {
      return true;
    }
  }
  return false;
}

class LineElement extends HTMLCanvasElement {
  private _text: string;
  private _caretPos: number;
  private _textArea: TextArea;
  private _focused: boolean;
  private _selection: Function | null;

  constructor(parent: TextArea, text: string) {
    super();

    this._textArea = parent;
    this._text = text;
    this._caretPos = 0;
    this.height = window.configManager.lineHeight;
    this.tabIndex = 0;
    this._focused = false;
    this._selection = null;

    applyStyles(this, {
      display: "block",
      position: "relative",
      outline: "none",
      cursor: "text",
    } as CSSStyleDeclaration);

    this.addEventListener("blur", this.onBlur);
    this.addEventListener("focus", this.onFocus);
    this.addEventListener("keydown", this.onKeyDown as EventListener);
    this.addEventListener("mousedown", this.onMouseDown);
    this.addEventListener("click", this.onClick as EventListener);
  }

  connectedCallback() {
    this.width = this._textArea.getBoundingClientRect().width;
    this.refresh();
    const observer = new ResizeObserver((entries) => {
      const { scrollWidth } = this._textArea;
      const { width } = this._textArea.getBoundingClientRect();
      if (this.textWidth() < width) {
        this.clear();
        this.width = width;
        this.drawText();
        if (this._focused) {
          this.drawCaret();
        }
      } else if (this.textWidth() < scrollWidth) {
        this.clear();
        this.width = scrollWidth;
        this.drawText();
        if (this._focused) {
          this.drawCaret();
        }
      }
    });
    observer.observe(this._textArea);
  }

  get text() {
    return this._text;
  }

  focusAt(index: number) {
    this.focus();
    if (this._text.length < index) {
      this.setCaretPos(this._text.length);
    } else {
      this.setCaretPos(index);
    }
    this.refresh();
    this.drawCaret();
  }

  appendText(text: string) {
    this._text += text;
  }

  insertText(text: string, col: number) {
    const newText = this._text.slice(0, col) + text + this._text.slice(col);
    this.setCaretPos(col + text.length);
    this.update(newText);
  }

  refresh() {
    this.clear();
    this.drawText();
    if (this._focused) {
      this.drawCaret();
    }
  }

  setText(text: string) {
    this._text = text;
  }

  textWidth() {
    return this.charWidth() * this._text.length;
  }

  charWidth() {
    const context = this.getContext("2d");
    if (context) {
      context.font = `normal ${this.fontSize()}px monospace`;
      return context.measureText("0").width;
    }
    return 0;
  }

  selection() {
    if (this._selection) {
      return this._selection();
    }
  }

  drawSelection(start: number, end: number) {
    this.clear();
    this.drawText();
    const context = this.getContext("2d");
    if (context) {
      context.fillStyle = window.theme.lineElement.fg + "55";
      if (this._text.length > 0) {
        context.fillRect(
          2 + start * this.charWidth(),
          0,
          (end - start) * this.charWidth(),
          this.height
        );
      } else {
        context.fillRect(2, 0, this.charWidth(), this.height);
      }
    }
  }

  unHighlight() {
    this._focused = false;
    applyStyles(this, {
      backgroundColor: "transparent",
    } as CSSStyleDeclaration);
  }

  update(text: string) {
    this.clear();
    this.setText(text);
    const textWidth = this.textWidth();
    if (textWidth > this.width) {
      this.width = textWidth;
    }
    this.drawText();
    if (this._focused) {
      this.drawCaret();
    }
  }

  private fontSize() {
    return Math.round(this.height * 0.7);
  }

  private drawText() {
    const context = this.getContext("2d");
    if (context) {
      context.textBaseline = "middle";
      context.font = `normal ${this.fontSize()}px monospace`;
      context.fillStyle = window.theme.lineElement.fg;
      context.fillText(this._text, 2, this.height / 2 + 0.1 * this.height);
    }
  }

  private clear() {
    const context = this.getContext("2d");
    if (context) {
      context.clearRect(0, 0, this.width, this.height);
    }
  }

  private drawCaret() {
    const context = this.getContext("2d");
    if (context) {
      context.beginPath();
      const x = this.getCaretPos() * this.charWidth() + 2;
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
      context.lineWidth = 2;
      context.strokeStyle = window.theme.lineElement.fg;
      context.stroke();
    }
  }

  private setCaretPos(pos: number) {
    this._caretPos = pos;
  }

  private getCaretPos() {
    return this._caretPos;
  }

  // Event handlers:

  private onFocus() {
    this._focused = true;
    applyStyles(this, {
      backgroundColor: window.theme.lineElement.highlightBg,
    } as CSSStyleDeclaration);
  }

  private onBlur() {
    this._focused = false;
    this.clear();
    this.drawText();
    applyStyles(this, {
      backgroundColor: "transparent",
    } as CSSStyleDeclaration);
    const customEvent = new CustomEvent("line-blurred", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this._focused) return;
    const caretPos = this.getCaretPos();
    switch (event.key) {
      case "Escape":
        this.handleEscapeKey();
        return;
      case "Enter":
        this.handleEnterKey();
        return;
      case "ArrowUp":
        this.handleArrowUpKey();
        return;
      case "ArrowDown":
        this.handleArrowDownKey();
        return;
      case "ArrowLeft":
        this.handleArrowLeftKey();
        return;
      case "ArrowRight":
        this.handleArrowRightKey();
        return;
      case "Backspace":
        if (!this._text) {
          this.requestLineRemoval();
        } else if (caretPos === 0) {
          this.appendTextAndRemove();
        } else {
          this.deletePreviousChar();
        }
        return;
      case "Delete":
        if (!this._text) {
          this.requestLineRemoval();
        } else if (caretPos === this._text.length) {
          this.deletePreviousChar();
        } else {
          this.deleteFollowingChar();
        }
        return;
      case "Tab":
        this.handleTabKey();
        return;
      case "Shift":
        return;
      case "Alt":
        return;
      case "Control":
        return;
      case "CapsLock":
        const capsOn = !event.getModifierState("CapsLock");
        const customEvent = new CustomEvent("caps-lock-changed", {
          bubbles: true,
          detail: {
            capsOn,
          },
        });
        this.dispatchEvent(customEvent);
        return;
      default:
        break;
    }

    this.insertCharAtCaret(event.key);
  }

  private onClick(event: MouseEvent) {
    event.preventDefault();
  }

  private onMouseDown() {
    const onMouseUp = (event: MouseEvent) => {
      if (!this._textArea.selecting) {
        this.clear();
        this.drawText();
        const textWidth = this.textWidth();
        const charWidth = this.charWidth();
        const { pageX } = event;
        const { left } = this.getBoundingClientRect();
        const offsetX = pageX - left;
        if (textWidth > offsetX) {
          this.setCaretPos(Math.round(offsetX / charWidth));
        } else {
          this.setCaretPos(Math.round(textWidth / charWidth));
        }
        this.drawCaret();
      }
      this.removeEventListener("mouseup", onMouseUp as EventListener);
    };
    this.dispatchLineSelected();
    this.addEventListener("mouseup", onMouseUp as EventListener);
  }

  // Helper methods:

  private dispatchLineSelected() {
    const customEvent = new CustomEvent("line-selected", {
      bubbles: true,
      detail: {
        colIndex: this.getCaretPos(),
      },
    });
    this.dispatchEvent(customEvent);
  }

  private dispatchLineChanged() {
    const customEvent = new CustomEvent("line-changed", {
      bubbles: true,
      detail: {
        newColIndex: this.getCaretPos(),
        newValue: this._text,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private handleEscapeKey() {
    this.blur();
    const customEvent = new CustomEvent("no-line-selected", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private handleEnterKey() {
    const caretPos = this.getCaretPos();
    const textBeforeCaret = this._text.slice(0, caretPos);
    const textAfterCaret = this._text.slice(caretPos);
    this._text = textBeforeCaret;
    let pair = false;
    if (isPair(textBeforeCaret.slice(-1), textAfterCaret[0])) {
      pair = true;
    }
    const customEvent = new CustomEvent("new-line-requested", {
      bubbles: true,
      detail: {
        textBeforeCaret,
        textAfterCaret,
        pair,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private handleArrowUpKey() {
    const customEvent = new CustomEvent("move-caret-up", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private handleArrowDownKey() {
    const customEvent = new CustomEvent("move-caret-down", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private handleArrowLeftKey() {
    const customEvent = new CustomEvent("move-caret-left", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private handleArrowRightKey() {
    const customEvent = new CustomEvent("move-caret-right", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private requestLineRemoval() {
    const customEvent = new CustomEvent("line-removal-requested", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private appendTextAndRemove() {
    const appendEvent = new CustomEvent("append-text-to-previous-line", {
      bubbles: true,
      detail: {
        text: this._text,
      },
    });
    this.dispatchEvent(appendEvent);
    this.requestLineRemoval();
  }

  private deleteFollowingChar() {
    const caretPos = this.getCaretPos();
    const newText =
      this._text.slice(0, caretPos) + this._text.slice(caretPos + 1);
    this.update(newText);
    this.dispatchLineChanged();
  }

  private deletePreviousChar() {
    const caretPos = this.getCaretPos();
    const newText =
      this._text.slice(0, caretPos - 1) + this._text.slice(caretPos);
    this.setCaretPos(caretPos - 1);
    this.update(newText);
    this.dispatchLineChanged();
  }

  private handleTabKey() {
    const caretPos = this.getCaretPos();
    const textBeforeCaret = this._text.slice(0, caretPos);
    const textAfterCaret = this._text.slice(caretPos);
    const tab = " ".repeat(window.configManager.tabSize);
    const insertSpacesNum = textBeforeCaret.length % tab.length;
    if (textAfterCaret.length === 0) {
      this.setCaretPos(caretPos + tab.length);
      this.update(textBeforeCaret + tab);
    } else {
      const insertSpaces =
        insertSpacesNum > 0 ? " ".repeat(insertSpacesNum) : tab;
      this.setCaretPos(caretPos + insertSpaces.length);
      this.update(textBeforeCaret + insertSpaces + textAfterCaret);
    }
    this.dispatchLineChanged();
  }

  private insertCharAtCaret(char: string) {
    const caretPos = this.getCaretPos();
    const textBeforeCaret = this._text.slice(0, caretPos);
    const textAfterCaret = this._text.slice(caretPos);
    const pair = getPairFromOpen(char);
    let newText: string;
    if (window.configManager.pairing && pair) {
      newText = `${textBeforeCaret}${pair.open}${pair.close}${textAfterCaret}`;
    } else {
      newText = `${textBeforeCaret}${char}${textAfterCaret}`;
    }
    this.setCaretPos(caretPos + 1);
    this.update(newText);
    this.dispatchLineChanged();
  }
}

customElements.define("line-element", LineElement, { extends: "canvas" });

export default LineElement;
