import { applyStyles } from "../helpers";
import ScrollView from "./ScrollView";
import Margin from "./Margin";
import TextArea from "./TextArea";
import universalStyles from "../universalStyles";
import StatusBar from "./StatusBar";

class Editor extends HTMLElement {
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _margin: Margin;
  private _textArea: TextArea;
  private _statusBar: StatusBar;

  constructor() {
    super();

    this._scrollView = new ScrollView();
    this._contentWrapper = document.createElement("div");
    this._margin = new Margin();
    this._textArea = new TextArea();
    this._statusBar = new StatusBar();

    this._scrollView.addVerticalScrollBar(this._contentWrapper, 15);
    this._scrollView.addHorizontalScrollBar(this._textArea, 15);

    this._contentWrapper.appendChild(this._margin);
    this._contentWrapper.appendChild(this._textArea);

    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);
    this.appendChild(this._statusBar);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr max-content",
      overflow: "hidden",
      width: "100%",
      maxHeight: "100%",
      backgroundColor: window.theme.editor.bg,
    } as CSSStyleDeclaration);

    applyStyles(this._contentWrapper, {
      ...universalStyles,
      display: "grid",
      gridTemplateColumns: "max-content 1fr",
      paddingTop: "5px",
      paddingRight: "5px",
      overflow: "hidden",
    } as CSSStyleDeclaration);

    this.addEventListener(
      "no-line-selected",
      this.onNoLineSelected as EventListener
    );
    this.addEventListener(
      "line-count-changed",
      this.onLineCountChanged as EventListener
    );
    this.addEventListener("unhighlight-line-number", this.onUnhighlightLineNumber as EventListener);
    this.addEventListener(
      "selection-changed",
      this.onSelectionChanged as EventListener
    );
    this.addEventListener("caps-lock-changed", this.onCapsLockChanged as EventListener);
  }

  show() {
    this.style.display = "grid";
    this._textArea.current = true;
  }

  hide() {
    this.style.display = "none";
    this._textArea.current = false;
  }

  refresh() {
    this._margin.refresh();
    this._textArea.refresh();
  }

  appendLine(line: string) {
    this._margin.appendLines(1);
    this._textArea.appendLine(line);
  }

  updateStatusBar() {
    this._statusBar.updateSpaces();
  }

  // Event handlers:

  private onNoLineSelected(event: CustomEvent) {
    event.stopPropagation();
    this._margin.unHighlightLineNumbers();
  }

  private onSelectionChanged(event: CustomEvent) {
    event.stopPropagation();
    const { line, col } = event.detail.caret;
    this._margin.highlightLineNumber(line);
    this._statusBar.updateCaretPos(line + 1, col + 1);
  }

  private onUnhighlightLineNumber(event: CustomEvent) {
    event.stopPropagation();
    const { index } = event.detail;
    this._margin.unHighlightLineNumber(index);
  }

  private onLineCountChanged(event: CustomEvent) {
    event.stopPropagation();
    const { delta } = event.detail;
    this._margin.updateLineNumbers(delta);
  }

  private onCapsLockChanged(event: CustomEvent) {
    const { capsOn } = event.detail;
    this._statusBar.updateCapsOn(capsOn);
  }
}

customElements.define("custom-editor", Editor);

export default Editor;
