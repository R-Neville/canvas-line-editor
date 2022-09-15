import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";
import ComponentTheme from "../themes/ComponentTheme";
import ResizeHandle from "./ResizeHandle";
import Tab from "./Tab";

const MIN_WIDTH = 200;

class SideBar extends HTMLElement {
  private _theme: ComponentTheme;
  private _tabs: Tab[];
  private _contentWrapper: HTMLDivElement;
  private _resizeHandle: ResizeHandle;

  constructor(theme: ComponentTheme) {
    super();

    this._theme = theme;
    this._tabs = [];
    this._contentWrapper = this.buildContentWrapper();
    this._resizeHandle = new ResizeHandle(theme);

    this.appendChild(this._contentWrapper);
    this.appendChild(this._resizeHandle);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      gridTemplateColumns: "1fr max-content",
      width: "200px",
      height: "100%",
      backgroundColor: this._theme.bg,
    } as CSSStyleDeclaration);

    this.addEventListener("resize-handle-used", this.onResizeHandleUsed as EventListener);
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    } as CSSStyleDeclaration);
    return wrapper;
  }

  private onResizeHandleUsed(event: CustomEvent) {
    const { deltaX } = event.detail;
    const newWidth = this.getBoundingClientRect().width + deltaX;
    if (newWidth > MIN_WIDTH) {
      this.style.width = newWidth + "px";
    }
  }
}

customElements.define("side-bar", SideBar);

export default SideBar;