import { applyStyles } from "../helpers";
import { buildCloseIconSVG } from "../icons";
import universalStyles from "../universalStyles";
import Icon from "./Icon";

class Tab extends HTMLElement {
  private _current: boolean;
  private _name: string;
  private _label: HTMLLabelElement;
  private _closeButton: HTMLButtonElement;

  constructor(text: string) {
    super();

    this.draggable = true;
    this.title = text;
    this._name = text;
    this._current = false;
    this._label = this.buildLabel();
    this._label.textContent = text;
    this._closeButton = this.buildCloseButton();

    this.appendChild(this._label);
    this.appendChild(this._closeButton);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      potition: "relative",
      padding: "0.5em 1em",
      border: "1px solid transparent",
      fontSize: "1em",
      color: window.theme.sideBar.fg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", () => {
      const customEvent = new CustomEvent("tab-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("contextmenu", this.onContextMenu as EventListener);
    this.addEventListener("dragstart", this.onDragStart as EventListener);
    this.addEventListener("dragend", this.onDragEnd as EventListener);
    this.addEventListener("dragover", this.onDragOver as EventListener);
    this.addEventListener("dragenter", this.onDragEnter as EventListener);
    this.addEventListener("dragleave", this.onDragLeave as EventListener);
    this.addEventListener("drop", this.onDrop as EventListener);
  }

  get name() {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
    this.title = newName;
    this._label.textContent = newName;
  }

  highlight() {
    this._current = true;
    this.style.backgroundColor = window.theme.sideBar.highlightBg;
  }

  unHighlight() {
    this._current = false;
    this.style.backgroundColor = "inherit";
  }

  private onMouseEnter() {
    if (!this._current) {
      this.style.backgroundColor = window.theme.sideBar.highlightBg;
    }
  }

  private onMouseLeave() {
    if (!this._current) {
      this.style.backgroundColor = "inherit";
    }
  }

  private buildLabel() {
    const label = document.createElement("label");
    applyStyles(label, {
      overflowX: "hidden",
      fontSize: "1em",
      color: window.theme.sideBar.fg,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
    } as CSSStyleDeclaration);
    return label;
  }

  private buildCloseButton() {
    const button = document.createElement("button");
    applyStyles(button, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "20px",
      height: "20px",
      border: "none",
      borderRadius: "3px",
      backgroundColor: window.theme.sideBar.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    const icon = new Icon(buildCloseIconSVG(), "10px", true);
    icon.setColor(window.theme.sideBar.fg);
    button.appendChild(icon);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("close-button-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    return button;
  }

  private onContextMenu(event: MouseEvent) {
    const { pageX, pageY } = event;
    const customEvent = new CustomEvent("tab-context-menu", {
      bubbles: true,
      detail: {
        pageX,
        pageY,
      }
    });
    this.dispatchEvent(customEvent);
  }

  private onDragStart(event: DragEvent) {
    this.style.opacity = "0.4";

    event.dataTransfer?.setData("text", this._name);
  }

  private onDragEnd(event: DragEvent) {
    this.style.opacity = "1"
  }

  private onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private onDragEnter(event: DragEvent) {
    this.style.borderColor = window.theme.sideBar.fg;
  }

  private onDragLeave(event: DragEvent) {
    this.style.borderColor = "transparent";
  }

  private onDrop(event: DragEvent) {
    event.stopPropagation();
    this.style.borderColor = "transparent";
    const droppedName = event.dataTransfer?.getData("text");
    if (droppedName) {
      const customEvent = new CustomEvent("move-tab", {
        bubbles: true,
        detail: {
          droppedName,
        },
      });
      this.dispatchEvent(customEvent);
    }
  }
}

customElements.define("custom-tab", Tab);

export default Tab;