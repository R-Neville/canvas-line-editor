import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";

const MIN_THUMB_SIZE = 40;

class ScrollBar extends HTMLElement {
  private _theme: ComponentTheme;
  private _mountEl: HTMLElement;
  private _scrollEl: HTMLElement;
  private _horizontal: boolean;
  private _thumb: HTMLDivElement;
  private _actualThumbSize: number;
  private _thumbSize: number;
  private _mountResizeObserver: ResizeObserver;
  private _scrollResizeObserver: ResizeObserver;

  constructor(
    mountEl: HTMLElement,
    scrollEl: HTMLElement,
    horizontal: boolean,
    size: number,
    theme: ComponentTheme
  ) {
    super();

    this._thumbSize = 0;
    this._actualThumbSize = 0;
    this._theme = theme;
    this._mountEl = mountEl;
    this._scrollEl = scrollEl;
    this._horizontal = horizontal;
    this._mountResizeObserver = new ResizeObserver(
      this.resizeObserverCallback.bind(this)
    );
    this._mountResizeObserver.observe(this._mountEl);
    this._scrollResizeObserver = new ResizeObserver(
      this.resizeObserverCallback.bind(this)
    );
    this._scrollResizeObserver.observe(this._scrollEl);
    this._thumb = document.createElement("div");

    this.appendChild(this._thumb);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      alignItems: "center",
      position: "sticky",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);

    applyStyles(this._thumb, {
      ...universalStyles,
      display: "block",
      position: "absolute",
      borderRadius: "5px",
      cursor: "grab",
      backgroundColor: this._theme.bg,
    } as CSSStyleDeclaration);

    if (this._horizontal) {
      applyStyles(this, {
        bottom: "0px",
        width: "100%",
        height: `${size}px`,
        borderTop: "2px solid transparent",
        borderBottom: "2px solid transparent",
      } as CSSStyleDeclaration);
      applyStyles(this._thumb, {
        height: "100%",
      } as CSSStyleDeclaration);
    } else {
      applyStyles(this, {
        right: "0px",
        width: `${size}px`,
        borderLeft: "2px solid transparent",
        borderRight: "2px solid transparent",
      } as CSSStyleDeclaration);
      applyStyles(this._thumb, {
        width: "100%",
      } as CSSStyleDeclaration);
    }

    this._mountEl.addEventListener(
      "wheel",
      this.onWheel.bind(this) as EventListener
    );
    this._scrollEl.addEventListener("scroll", this.onScroll.bind(this));
    this._thumb.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this) as EventListener
    );
  }

  connectedCallback() {
    this.updateThumb();
  }

  updateTheme(newTheme: ComponentTheme) {
    this._theme = newTheme;
  }

  updateThumb() {
    const { scrollWidth, scrollHeight } = this._scrollEl;
    const { clientWidth: scrollElWidth, clientHeight: scrollElHeight } =
      this._scrollEl;
    const { clientWidth: width, clientHeight: height } = this;
    if (this._horizontal) {
      this.updateThumbSize(scrollElWidth, scrollWidth, width);
      this._thumb.style.width = this._thumbSize + "px";
    } else {
      this.updateThumbSize(scrollElHeight, scrollHeight, height);
      this._thumb.style.height = this._thumbSize + "px";
    }
    this.toDisplayOrNotToDisplay();
  }

  private updateThumbSize(size: number, scrollSize: number, mountSize: number) {
    this._actualThumbSize = (size / scrollSize) * mountSize;
    if (this._actualThumbSize < MIN_THUMB_SIZE) {
      this._thumbSize = MIN_THUMB_SIZE;
    } else {
      this._thumbSize = this._actualThumbSize;
    }
  }

  private resizeObserverCallback(entries: ResizeObserverEntry[]) {
    entries.forEach(() => {
      this.updateThumb();
    });
  }

  private toDisplayOrNotToDisplay() {
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
      this._scrollEl;
    if (this._horizontal) {
      if (scrollWidth > clientWidth) {
        this.style.display = "flex";
      } else {
        this.style.display = "none";
      }
    } else {
      if (scrollHeight > clientHeight) {
        this.style.display = "flex";
      } else {
        this.style.display = "none";
      }
    }
  }

  private onWheel(event: WheelEvent) {
    const { deltaX, deltaY } = event;
    if (deltaX && this._horizontal) {
      this._scrollEl.scrollLeft += deltaX;
    }
    if (deltaY && !this._horizontal) {
      this._scrollEl.scrollTop += deltaY;
    }
    this.updateThumb();
  }

  private onScroll() {
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = this._scrollEl;
    const { clientWidth: width, clientHeight: height } = this;
    if (this._horizontal) {
      const newScrollLeft = (scrollLeft / scrollWidth) * width;
      this._thumb.style.left = newScrollLeft + "px";
    } else {
      const newScrollTop = (scrollTop / scrollHeight) * height;
      this._thumb.style.top = newScrollTop + "px";
    }
    this.updateThumb();
  }

  private onMouseDown(event: MouseEvent) {
    let startX = event.clientX;
    let startY = event.clientY;

    document.body.style.userSelect = "none";

    const { clientWidth: width, clientHeight: height } = this;

    if (this._horizontal) {
      const onMouseMove = (event: MouseEvent) => {
        const deltaX = event.clientX - startX;
        const scrollX = (deltaX / width) * this._scrollEl.scrollWidth;
        this._scrollEl.scrollLeft += scrollX;
        startX = event.clientX;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "all";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      const onMouseMove = (event: MouseEvent) => {
        const deltaY = event.clientY - startY;
        const scrollY = (deltaY / height) * this._scrollEl.scrollHeight;
        this._scrollEl.scrollTop += scrollY;
        startY = event.clientY;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "all";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  }
}

customElements.define("custom-scroll-bar", ScrollBar);

export default ScrollBar;
