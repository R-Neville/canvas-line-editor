import { applyStyles } from "../helpers";
import Theme from "../themes/Theme";
import universalStyles from "../universalStyles";
import ScrollBar from "./ScrollBar";

class ScrollView extends HTMLElement {
  private _theme: Theme;
  private _verticalScrollBar: ScrollBar | null;
  private _horizontalScrollBar: ScrollBar | null;

  constructor(theme: Theme) {
    super();

    this._theme = theme;

    this._verticalScrollBar = null;
    this._horizontalScrollBar = null;

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateColumns: "1fr max-content",
      gridTemplateRows: "1fr max-content",
      overflow: "hidden",
      position: "relative",
      maxWidth: "100%",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);
  }

  updateTheme(newTheme: Theme) {
    this._theme = newTheme;
  }

  addHorizontalScrollBar(scrollEl: HTMLElement, height: number) {
    this._horizontalScrollBar = new ScrollBar(
      this,
      scrollEl,
      true,
      height,
      this._theme.scrollBar
    );
    applyStyles(this._horizontalScrollBar, {
      gridRow: "2",
      gridColumn: "1",
    } as CSSStyleDeclaration);
    this.appendChild(this._horizontalScrollBar);
  }

  addVerticalScrollBar(scrollEl: HTMLElement, width: number) {
    this._verticalScrollBar = new ScrollBar(
      this,
      scrollEl,
      false,
      width,
      this._theme.scrollBar
    );
    applyStyles(this._verticalScrollBar, {
      gridRow: "1",
      gridColumn: "2",
    } as CSSStyleDeclaration);
    this.appendChild(this._verticalScrollBar);
  }

  setContent(contentEl: HTMLElement) {
    applyStyles(contentEl, {
      gridRow: "1",
      gridColumn: "1",
    } as CSSStyleDeclaration);
    this.appendChild(contentEl);
  }
}

customElements.define("scroll-view", ScrollView);

export default ScrollView;
