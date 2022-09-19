import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class SettingsMenuOption extends HTMLElement {

  constructor(text: string, onClick: EventListener) {
    super();

    this.textContent = text;

    applyStyles(this, {
      ...universalStyles,
      padding: "0.5em 1em",
      width: "100%",
      backgroundColor: "inherit",
      color: window.theme.settingsView.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
    this.addEventListener("click", this.highlight);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  highlight() {
    const menu = this.closest("settings-menu");
    if (menu) {
      const currentOption = menu.querySelector("settings-menu-option.current");
      if (currentOption)
        (currentOption as SettingsMenuOption).removeHighlight();
      this.classList.add("current");
      applyStyles(this, {
        backgroundColor: window.theme.settingsView.highlightFg,
      } as CSSStyleDeclaration);
    }
  }

  removeHighlight() {
    this.classList.remove("current");
    applyStyles(this, {
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);
  }

  private onMouseEnter() {
    if (!this.classList.contains("current")) {
      applyStyles(this, {
        backgroundColor: window.theme.settingsView.highlightFg,
      } as CSSStyleDeclaration);
    }
  }

  private onMouseLeave() {
    if (!this.classList.contains("current")) {
      applyStyles(this, {
        backgroundColor: "inherit",
      } as CSSStyleDeclaration);
    }
  }
}

customElements.define("settings-menu-option", SettingsMenuOption);

export default SettingsMenuOption;
