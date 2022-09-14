import { applyStyles } from "../helpers";

class Tab extends HTMLElement {
  constructor() {
    super();

    applyStyles(this, {

    } as CSSStyleDeclaration);
  }
}

customElements.define("custom-tab", Tab);

export default Tab;