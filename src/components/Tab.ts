import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class Tab extends HTMLElement {
  constructor() {
    super();

    applyStyles(this, {
      ...universalStyles,
    } as CSSStyleDeclaration);
  }
}

customElements.define("custom-tab", Tab);

export default Tab;