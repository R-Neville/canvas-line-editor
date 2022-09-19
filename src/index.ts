import { applyStyles } from "./helpers";
import configManager from "./config";
import themes from "./themes";
import universalStyles from "./universalStyles";
import App from "./App";

applyStyles(document.body, {
  ...universalStyles,
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr",
  width: "100%",
  minHeight: "100vh",
  margin: "0px",
  userSelect: "none",
} as CSSStyleDeclaration);

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

window.configManager = configManager;

window.theme = themes.defaultTheme;

const app = new App();
document.body.appendChild(app);