import { applyStyles } from "../../helpers";
import Input from "./Input";
import Action from "./Action";
import universalStyles from "../../universalStyles";
import Selector from "./Selector";

class Modal extends HTMLElement {
  private _valid: boolean;
  private _input: Input|null;
  private _selector: Selector|null;
  private _selection: string|null;
  private _contentWrapper: HTMLDivElement;
  private _header: HTMLDivElement;
  private _body: HTMLDivElement;
  private _actions: HTMLDivElement;

  constructor(text: string) {
    super();

    this._valid = false;
    this._input = null;
    this._selector = null;
    this._selection = null;

    this._contentWrapper = document.createElement("div");
    this._header = document.createElement("div");
    this._header.textContent = text;
    this._body = document.createElement("div");
    this._actions = document.createElement("div");

    this.appendChild(this._contentWrapper);
    this._contentWrapper.appendChild(this._header);
    this._contentWrapper.appendChild(this._body);
    this._body.appendChild(this._actions);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      padding: "1em",
      backgroundColor: "#000000AA",
      userSelect: "none",
    } as CSSStyleDeclaration);

    applyStyles(this._contentWrapper, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: "500px",
    });

    applyStyles(this._header, {
      ...universalStyles,
      padding: "1em",
      backgroundColor: window.theme.modal.fg,
      fontSize: "1em",
      color: window.theme.modal.bg,
    });

    applyStyles(this._body, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      padding: "1em",
      backgroundColor: window.theme.modal.bg,
    });


    applyStyles(this._actions, {
      ...universalStyles,
      display: "flex",
      justifyContent: "flex-end",
    });
    
    this.addEventListener("selection-changed", ((event: CustomEvent) => {
      event.stopPropagation();
      const { newValue } = event.detail;
      this._selection = newValue;
      this._valid = true;
    }) as EventListener);
  }

  get valid() {
    return this._valid;
  }

  get inputValue() {
    if (this._input) {
      return this._input.value;
    }
    return "";
  }

  get selection() {
    return this._selection;
  }

  destroy() {
    this.remove();
  }

  lock() {
    this._valid = false;
    if (this._input) {
      applyStyles(this._input, {
        borderColor: window.theme.error.fg,
        backgroundColor: window.theme.error.bg,
        color: window.theme.error.fg,
      } as CSSStyleDeclaration);
    }
  }

  unlock() {
    this._valid = true;
    if (this._input) {
      applyStyles(this._input, {
        borderColor: window.theme.modal.fg,
        backgroundColor: window.theme.modal.bg,
        color: window.theme.modal.fg,
      } as CSSStyleDeclaration);
    }
  }

  addInput(onInput: EventListener, initialValue: string) {
    this._input = new Input(onInput, initialValue);
    this._body.insertBefore(this._input, this._actions);
  }

  addSelector(options: string[]) {
    this._selector = new Selector(options);
    this._body.insertBefore(this._selector, this._actions);
  }

  addAction(text: string, onClick: EventListener) {
    const action = new Action(text, onClick);
    this._actions.appendChild(action);
  }
}

customElements.define("custom-modal", Modal);

export default Modal;
