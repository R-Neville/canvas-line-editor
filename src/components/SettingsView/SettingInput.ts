import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class SettingInput extends HTMLInputElement {
  constructor(value: string, onBlur: EventListener) {
    super();

    this.value = value;

    applyStyles(this, {
      ...universalStyles,
      width: "100%",
      border: `1px solid ${window.theme.settingsView.fg}`,
      borderRadius: "3px",
      outline: "none",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);

    this.addEventListener("blur", onBlur);
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.blur();
      }
    });
  }

  showErrorStyles() {
    this.style.border = "1px solid red";
    this.style.backgroundColor = "#F5B7B1";
  }

  removeErrorStyles() {
    this.style.border = `1px solid ${window.theme.settingsView.fg}`;
    this.style.backgroundColor = "inherit";
  }
}

customElements.define("setting-input", SettingInput, { extends: "input" });

export default SettingInput;
