import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import TextArea from "./TextArea";

class LineElement extends HTMLCanvasElement {
  private _theme: ComponentTheme;
  private _text: string;
  private _caretPos: number;
  private _textArea: TextArea;
  private _focused: boolean;

  constructor(parent: TextArea, text: string, theme: ComponentTheme) {
    super();

    this._textArea = parent;
    this._text = text;
    this._caretPos = 0;
    this._theme = theme;
    this.height = 18;
    this.tabIndex = 0;
    this._focused = false;

    applyStyles(this, {
      display: "block",
      position: "relative",
      outline: "none",
      borderTop: "1px solid transparent",
      borderBottom: "1px solid transparent",
      cursor: "text",
    } as CSSStyleDeclaration);

    this.addEventListener("blur", this.onBlur);
    this.addEventListener("focus", this.onFocus);
    this.addEventListener("keydown", this.onKeyDown as EventListener);
    this.addEventListener("click", this.onClick as EventListener);
  }

  connectedCallback() {
    this.width = this._textArea.getBoundingClientRect().width;
    this.refresh();
    const observer = new ResizeObserver((entries) => {
      const { width } = this._textArea.getBoundingClientRect();
      if (this.textWidth() < width) {
        this.clear();
        this.width = width;
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

  updateTheme(theme: ComponentTheme) {
    this._theme = theme;
    applyStyles(this, {
      color: this._theme.fg,
    } as CSSStyleDeclaration);
  }

  focusAt(index: number) {
    this.focus();
    this.setCaretPos(index);
    this.refresh();
    this.drawCaret();
  }

  appendText(text: string) {
    this._text += text;
  }

  refresh() {
    this.clear();
    this.drawText();
  }

  updateText(text: string) {
    this._text = text;
  }

  private fontSize() {
    return Math.round(this.height * 0.8);
  }

  private drawText() {
    const context = this.getContext("2d");
    if (context) {
      context.textBaseline = "middle";
      context.font = `normal ${this.fontSize()}px monospace`;
      context.fillStyle = this._theme.fg;
      context.fillText(this._text, 2, this.height / 2 + 1);
    }
  }

  private clear() {
    const context = this.getContext("2d");
    if (context) {
      context.clearRect(0, 0, this.width, this.height);
    }
  }

  private charWidth() {
    const context = this.getContext("2d");
    if (context) {
      context.font = `normal ${this.fontSize()}px monospace`;
      return context.measureText("0").width;
    }
    return 0;
  }

  private textWidth() {
    return this.charWidth() * this._text.length;
  }

  private drawCaret() {
    const context = this.getContext("2d");
    if (context) {
      context.beginPath();
      const x = this.getCaretPos() * this.charWidth() + 2;
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
      context.lineWidth = 2;
      context.strokeStyle = this._theme.fg;
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
      backgroundColor: this._theme.highlightBg,
    } as CSSStyleDeclaration);
  }

  private onBlur() {
    this._focused = false;
    this.clear();
    this.drawText();
    applyStyles(this, {
      backgroundColor: "transparent",
    } as CSSStyleDeclaration);
  }

  private onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
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
        this._textArea.capsOn = !this._textArea.capsOn;
        return;
      default:
        break;
    }

    if (
      (event.shiftKey && !this._textArea.capsOn) ||
      (!event.shiftKey && this._textArea.capsOn)
    ) {
      this.insertCharAtCaret(event.key.toUpperCase());
    } else {
      this.insertCharAtCaret(event.key);
    }
  }

  private onClick(event: MouseEvent) {
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
    this.dispatchLineSelected();
  }

  // Helper methods:

  private dispatchLineSelected() {
    const customEvent = new CustomEvent("line-selected", {
      bubbles: true,
      detail: {
        charIndex: this.getCaretPos(),
      },
    });
    this.dispatchEvent(customEvent);
  }

  private dispatchLineChanged() {
    const customEvent = new CustomEvent("line-changed", {
      bubbles: true,
      detail: {
        newColStart: this.getCaretPos(),
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
    const customEvent = new CustomEvent("new-line-requested", {
      bubbles: true,
      detail: {
        textBeforeCaret,
        textAfterCaret,
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
        text: this.textContent,
      },
    });
    this.dispatchEvent(appendEvent);
    this.requestLineRemoval();
  }

  private deletePreviousChar() {
    const caretPos = this.getCaretPos();
    const newText =
      this._text.slice(0, caretPos - 1) + this._text.slice(caretPos);
    this._text = newText; // Triggers line-changed event.
    this.setCaretPos(caretPos - 1);
    this.clear();
    this.drawText();
    this.drawCaret();
    this.dispatchLineChanged();
  }

  private handleTabKey() {
    const caretPos = this.getCaretPos();
    const textBeforeCaret = this._text.slice(0, caretPos);
    const textAfterCaret = this._text.slice(caretPos);
    const tab = " ".repeat(4);
    const insertSpacesNum = textBeforeCaret.length % tab.length;
    if (textAfterCaret.length === 0) {
      this.updateText(textBeforeCaret + tab);
      this.setCaretPos(caretPos + tab.length);
    } else {
      const insertSpaces =
        insertSpacesNum > 0 ? " ".repeat(insertSpacesNum) : tab;
      this.updateText(textBeforeCaret + insertSpaces + textAfterCaret);
      this.setCaretPos(caretPos + insertSpaces.length);
    }
    this.clear();
    this.drawText();
    this.drawCaret();
    this.dispatchLineChanged();
  }

  private insertCharAtCaret(char: string) {
    const caretPos = this.getCaretPos();
    const textBeforeCaret = this._text.slice(0, caretPos);
    const textAfterCaret = this._text.slice(caretPos);
    const newText = `${textBeforeCaret}${char}${textAfterCaret}`;
    this.updateText(newText);
    this.setCaretPos(caretPos + 1);
    this.clear();
    this.drawText();
    this.drawCaret();
    this.dispatchLineChanged();
  }
}

customElements.define("line-element", LineElement, { extends: "canvas" });

export default LineElement;
