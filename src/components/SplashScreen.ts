import { applyStyles } from "../helpers";
import ComponentTheme from "../themes/ComponentTheme";
import universalStyles from "../universalStyles";

class SplashScreen extends HTMLElement {
  private _theme: ComponentTheme;

  constructor(theme: ComponentTheme) {
    super();

    this._theme = theme;

    const welcome = document.createElement("h1");
    welcome.textContent = "Watch this space!";
    this.appendChild(welcome);

    const p1 = document.createElement("p");
    p1.textContent = "I'm creating my own IDE with Electron.js, ";
    p1.textContent += "and I'm using this webpage to experiment on ";
    p1.textContent += "creating an HTML canvas based plaintext editor.";

    const pn = document.createElement("p");
    pn.textContent = "Copyright Robbie Neville 2022";

    const button = document.createElement("button");
    button.textContent = "Give it a whirl!";
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("new-editor-requested", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
    } as CSSStyleDeclaration);

    applyStyles(welcome, {
      ...universalStyles,
      color: this._theme.fg,
    } as CSSStyleDeclaration);

    [p1, pn].forEach(p => {
      this.appendChild(p);
      applyStyles(p, {
        ...universalStyles,
        maxWidth: "500px",
        fontSize: "1em",
        textAlign: "center",
        color: this._theme.fg,
      } as CSSStyleDeclaration);
    });

    applyStyles(button, {
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      backgroundColor: this._theme.fg,
      fontSize: "1em",
      color: this._theme.bg,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.appendChild(button);
  }

  show() {
    this.style.display = "flex";
  }

  hide() {
    this.style.display = "none";
  }
}

customElements.define("splash-screen", SplashScreen);

export default SplashScreen;