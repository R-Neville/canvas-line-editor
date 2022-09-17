import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";
import Theme from "../themes/Theme";
import ResizeHandle from "./ResizeHandle";
import Tab from "./Tab";
import ScrollView from "./ScrollView";

const MIN_WIDTH = 200;

class SideBar extends HTMLElement {
  private _theme: Theme;
  private _tabs: Tab[];
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _resizeHandle: ResizeHandle;

  constructor(theme: Theme) {
    super();

    this._theme = theme;
    this._tabs = [];
    this._contentWrapper = this.buildContentWrapper();
    this._resizeHandle = new ResizeHandle(this._theme.sideBar);
    this._scrollView = new ScrollView(this._theme);
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 10);
    this._scrollView.setContent(this._contentWrapper);
    
    this.appendChild(this._scrollView);
    this.appendChild(this._resizeHandle);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      gridTemplateColumns: "1fr max-content",
      overflow: "hidden",
      width: "200px",
      height: "100%",
      backgroundColor: this._theme.sideBar.bg,
    } as CSSStyleDeclaration);

    this.addEventListener("resize-handle-used", this.onResizeHandleUsed as EventListener);
    this.addEventListener("tab-clicked", this.onTabClicked as EventListener);
    this.addEventListener("close-button-clicked", this.onCloseButtonClicked as EventListener);

    this.showNoEditors();
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  addTabAtIndex(tab: Tab, index: number) {
    this.removeNoEditors();
    const nextTab = this._tabs[index];
    if (nextTab) {
      this._contentWrapper.insertBefore(tab, nextTab);
    } else {
      this._contentWrapper.appendChild(tab);
    }
    this._tabs.splice(index, 0, tab);
  }

  removeTabAtIndex(index: number) {
    const tab = this._tabs.splice(index, 1)[0];
    tab.remove();
    if (this._tabs.length === 0) {
      this.showNoEditors();
    }
  }

  highlightTabAtIndex(index: number) {
    this._tabs[index].highlight();
  }

  unHighlightTabAtIndex(index: number) {
    this._tabs[index].unHighlight();
  }

  getTabNameAtIndex(index: number) {
    return this._tabs[index].name;
  }

  private showNoEditors() {
    const p = document.createElement("p");
    p.textContent = "No Open Editors";
    applyStyles(p, {
      ...universalStyles,
      textAlign: "center",
      color: this._theme.sideBar.fg,
    } as CSSStyleDeclaration);
    this._contentWrapper.appendChild(p);
  }

  private removeNoEditors() {
    this._contentWrapper.querySelector("p")?.remove();
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
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

  private onTabClicked(event: CustomEvent) {
    event.stopPropagation();
    const tab = event.target as Tab;
    const index = this._tabs.indexOf(tab);
    const customEvent = new CustomEvent("switch-editor-requested", {
      bubbles: true,
      detail: {
        index,
      }
    })
    this.dispatchEvent(customEvent);
  }

  private onCloseButtonClicked(event: CustomEvent) {
    event.stopPropagation();
    const tab = event.target as Tab;
    const index = this._tabs.indexOf(tab);
    const customEvent = new CustomEvent("close-editor-requested", {
      bubbles: true,
      detail: {
        index,
      }
    })
    this.dispatchEvent(customEvent);
  }
}

customElements.define("side-bar", SideBar);

export default SideBar;