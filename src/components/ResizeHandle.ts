import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class ResizeHandle extends HTMLElement {

  constructor() {
    super();

    applyStyles(this, {
      ...universalStyles,
      width: "3px",
      minWidth: "3px",
      height: "100%",
      backgroundColor: window.theme.sideBar.fg,
      cursor: "ew-resize",
    } as CSSStyleDeclaration);

    this.addEventListener("mousedown", this.onMouseDown);
  }

  private onMouseDown(event: MouseEvent) {
    const self = this;
    let startX = event.clientX;

    const onMouseMove = function (event: MouseEvent) {
      const deltaX = event.clientX - startX;
      const customEvent = new CustomEvent("resize-handle-used", {
        bubbles: true,
        detail: { deltaX },
      });
      self.dispatchEvent(customEvent);
      startX = event.clientX;
    };

    const onMouseUp = function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
}

customElements.define("resize-handle", ResizeHandle);

export default ResizeHandle;
