import { applyStyles } from "./helpers";
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
} as CSSStyleDeclaration);

const app = new App(themes.defaultTheme);
document.body.appendChild(app);