import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class SettingOption extends HTMLElement {
  private _value: string;

  constructor(value: string) {
    super();


    this._value = value;
    this.textContent = this._value;

    applyStyles(this, {
      ...universalStyles,
      padding: "5px",
    } as CSSStyleDeclaration);

    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("selection-changed", { bubbles: true })
      );
    });

    // this.addEventListener("mouseenter", this.onMouseEnter);
    // this.addEventListener("mouseleave", this.onMouseLeave);
  }

  get value() {
    return this._value;
  }

}

customElements.define("setting-option", SettingOption);

export default SettingOption;
