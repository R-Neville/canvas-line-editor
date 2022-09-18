import { applyStyles } from "../helpers";
import ScrollView from "./ScrollView";
import Margin from "./Margin";
import TextArea from "./TextArea";
import universalStyles from "../universalStyles";

class Editor extends HTMLElement {
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _margin: Margin;
  private _textArea: TextArea;

  constructor() {
    super();

    this._scrollView = new ScrollView();
    this._contentWrapper = document.createElement("div");
    this._margin = new Margin();
    this._textArea = new TextArea();

    this._scrollView.addVerticalScrollBar(this._contentWrapper, 15);
    this._scrollView.addHorizontalScrollBar(this._textArea, 15);

    this._contentWrapper.appendChild(this._margin);
    this._contentWrapper.appendChild(this._textArea);

    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      gridTemplateColumns: "1fr",
      overflow: "hidden",
      padding: "5px",
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
  }

  show() {
    this.style.display = "grid";
    this._textArea.current = true;
  }

  hide() {
    this.style.display = "none";
    this._textArea.current = false;
  }

  appendLine(line: string) {
    this._margin.appendLines(1);
    this._textArea.appendLine(line);
  }

  // Event handlers:

  private onNoLineSelected(event: CustomEvent) {
    event.stopPropagation();
    this._margin.unHighlightLineNumbers();
  }

  private onSelectionChanged(event: CustomEvent) {
    event.stopPropagation();
    const { line } = event.detail.caret;
    this._margin.highlightLineNumber(line);
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
}

customElements.define("custom-editor", Editor);

export default Editor;
