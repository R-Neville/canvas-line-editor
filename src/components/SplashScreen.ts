import { applyStyles } from "../helpers";
import universalStyles from "../universalStyles";

class SplashScreen extends HTMLElement {

  constructor() {
    super();

    const welcome = document.createElement("h1");
    welcome.textContent = "Watch this space!";
    this.appendChild(welcome);

    const p1 = document.createElement("p");
    p1.textContent = "I'm creating my own IDE with Electron.js ";
    p1.textContent += "and I'm using this webpage to experiment on ";
    p1.textContent += "an HTML canvas based plaintext editor for it.";

    const p2 = document.createElement("p");
    p2.textContent = "**This application won't work properly on your mobile**";

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
      textAlign: "center",
      color: window.theme.splashScreen.fg,
    } as CSSStyleDeclaration);

    [p1, p2, pn].forEach(p => {
      this.appendChild(p);
      applyStyles(p, {
        ...universalStyles,
        maxWidth: "500px",
        fontSize: "1em",
        textAlign: "center",
        color: window.theme.splashScreen.fg,
      } as CSSStyleDeclaration);
    });

    applyStyles(button, {
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      backgroundColor: window.theme.splashScreen.fg,
      fontSize: "1em",
      color: window.theme.splashScreen.bg,
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